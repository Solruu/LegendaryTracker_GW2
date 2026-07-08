#!/usr/bin/env python3
"""
gw2_build_html.py
=================
Convertit gw2_legendary_tracker.jsx en gw2_legendary_tracker.html autonome.

Usage :
    python gw2_build_html.py
    python gw2_build_html.py --jsx mon_fichier.jsx --out dist/tracker.html

Le script :
1. Lit le .jsx
2. Adapte le storage API (window.storage → localStorage)
3. Supprime l'export default
4. Emballe dans un template HTML avec React + Babel standalone via CDN
"""

import argparse
import json
import re
import sys
from pathlib import Path

# ── Chemins par défaut (relatifs au script) ───────────────────────────────────
DEFAULT_JSX = "gw2_legendary_tracker.jsx"
DEFAULT_OUT = "gw2_legendary_tracker.html"

# ── Template HTML ─────────────────────────────────────────────────────────────
HTML_HEAD = """\
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GW2 Legendary Tracker</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080c18; }
  .leg-selector { display: flex; gap: 8px; padding: 16px; border-bottom: 1px solid rgba(226,201,126,0.1); overflow-x: auto; }
  .leg-btn { flex-shrink: 0; padding: 8px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(226,201,126,0.12); border-radius: 6px; color: rgba(226,201,126,0.5); font-family: 'Cinzel', serif; font-size: 11px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.06em; }
  .leg-btn.active { color: var(--leg-color); border-color: var(--leg-color); background: var(--leg-bg); }
  .tabs { display: flex; border-bottom: 1px solid rgba(226,201,126,0.08); overflow-x: auto; }
  .tab { flex-shrink: 0; padding: 10px 14px; background: none; border: none; border-bottom: 2px solid transparent; color: rgba(226,201,126,0.35); font-family: 'Cinzel', serif; font-size: 10px; cursor: pointer; transition: all 0.2s; letter-spacing: 0.08em; white-space: nowrap; }
  .tab.active { color: var(--leg-color); border-bottom-color: var(--leg-color); }
  .card { border: 1px solid rgba(226,201,126,0.1); border-radius: 8px; padding: 13px 15px; margin: 7px 14px; background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.18s; }
  .card:hover { background: rgba(255,255,255,0.04); border-color: rgba(226,201,126,0.2); }
  .card.checked { opacity: 0.38; }
  .card.imminent { border-color: rgba(251,146,60,0.45); box-shadow: 0 0 10px rgba(251,146,60,0.08); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{box-shadow:0 0 10px rgba(251,146,60,0.08)}50%{box-shadow:0 0 20px rgba(251,146,60,0.2)} }
  .tip-box { margin-top: 10px; padding: 9px 12px; background: rgba(226,201,126,0.04); border-left: 2px solid rgba(226,201,126,0.25); font-family: 'Crimson Text', serif; font-style: italic; font-size: 13px; color: rgba(226,201,126,0.65); }
  .wp-btn { background: rgba(226,201,126,0.08); border: 1px solid rgba(226,201,126,0.2); color: rgba(226,201,126,0.7); border-radius: 3px; padding: 2px 7px; font-family: monospace; font-size: 10px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .wp-btn:hover { background: rgba(226,201,126,0.15); }
  .wp-btn.copied { background: rgba(74,222,128,0.12); border-color: rgba(74,222,128,0.4); color: #4ade80; }
  .check-btn { background: none; border: 1px solid rgba(226,201,126,0.25); color: #e2c97e; border-radius: 4px; padding: 4px 10px; font-family: 'Cinzel', serif; font-size: 10px; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
  .check-btn:hover { background: rgba(226,201,126,0.08); }
  .check-btn.done { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.35); color: #4ade80; }
  .prog-bar { background: rgba(255,255,255,0.06); border-radius: 3px; height: 5px; overflow: hidden; margin-top: 5px; }
  .prog-fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
  .adj-btn { background: rgba(226,201,126,0.06); border: 1px solid rgba(226,201,126,0.15); color: rgba(226,201,126,0.7); border-radius: 3px; padding: 3px 8px; font-family: monospace; font-size: 11px; cursor: pointer; transition: all 0.15s; }
  .adj-btn:hover { background: rgba(226,201,126,0.12); }
  .section-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(226,201,126,0.3); padding: 12px 14px 4px; font-family: 'Crimson Text', serif; }
  .upcoming-box { margin: 8px 14px; padding: 11px 13px; background: rgba(251,146,60,0.04); border: 1px solid rgba(251,146,60,0.12); border-radius: 8px; }
  .wvw-card { border: 1px solid rgba(251,146,60,0.12); border-radius: 8px; padding: 13px 15px; margin: 7px 14px; background: rgba(255,255,255,0.02); }
  .reset-info { font-size: 10px; color: rgba(226,201,126,0.2); font-family: 'Crimson Text', serif; text-align: center; padding: 6px; }
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const { useState, useEffect, useCallback, useRef } = React;
"""

HTML_STORAGE_SHIM = """\
// ── Storage shim : localStorage pour version HTML standalone ─────────────────
function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
async function storeGet(key) { return lsGet(key); }
async function storeSet(key, val) { lsSet(key, val); }

"""

HTML_FOOT = """\

ReactDOM.createRoot(document.getElementById('root')).render(<GW2LegendaryTracker />);
</script>
</body>
</html>
"""

# ── Transformations JSX → HTML ────────────────────────────────────────────────

def inject_sources_db(src: str, sources_path: Path) -> str:
    """Injecte le contenu de gw2_sources.json comme constante JS dans le source."""
    if "// __SOURCES_DB_INJECT__" not in src:
        return src
    if not sources_path.exists():
        print(f"[WARN] {sources_path} introuvable — SOURCES_DB non injectée")
        return src.replace("// __SOURCES_DB_INJECT__", "const SOURCES_DB = {};")
    data = json.loads(sources_path.read_text(encoding="utf-8"))
    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    injection = f"const SOURCES_DB = {json_str};"
    return src.replace("// __SOURCES_DB_INJECT__", injection)


def transform_jsx(src: str) -> str:
    """Applique les transformations nécessaires pour rendre le JSX compatible HTML standalone."""

    # 1. Supprimer les imports React (inutiles, React est global via CDN)
    src = re.sub(r'^import\s+.*?from\s+["\']react["\'];?\n', '', src, flags=re.MULTILINE)

    # 2. Supprimer tous les autres imports (si ajoutés un jour)
    src = re.sub(r'^import\s+.*?;\n', '', src, flags=re.MULTILINE)

    # 3. export default function Foo → function Foo
    src = re.sub(r'\bexport\s+default\s+function\b', 'function', src)

    # 4. Remplacer le bloc storeGet/storeSet window.storage par le shim localStorage
    #    (le shim est injecté séparément — on supprime juste les fonctions du JSX)
    src = re.sub(
        r'async function storeGet\(.*?\}\s*\}\s*\nasync function storeSet\(.*?\}\s*\}',
        '// storage: voir shim localStorage ci-dessus',
        src,
        flags=re.DOTALL
    )

    return src.strip()


# ── Main ──────────────────────────────────────────────────────────────────────

def build(jsx_path: Path, out_path: Path):
    if not jsx_path.exists():
        print(f"[ERREUR] Fichier JSX introuvable : {jsx_path}")
        sys.exit(1)

    src = jsx_path.read_text(encoding="utf-8")
    sources_path = jsx_path.parent / "gw2_sources.json"
    src = inject_sources_db(src, sources_path)
    transformed = transform_jsx(src)

    html = HTML_HEAD + HTML_STORAGE_SHIM + transformed + HTML_FOOT
    out_path.write_text(html, encoding="utf-8")

    lines_in  = src.count('\n')
    lines_out = html.count('\n')
    print(f"[OK] {jsx_path.name} ({lines_in} lignes) → {out_path.name} ({lines_out} lignes)")


def main():
    parser = argparse.ArgumentParser(description="JSX → HTML standalone pour GW2 Legendary Tracker")
    parser.add_argument("--jsx", default=DEFAULT_JSX, help="Fichier JSX source")
    parser.add_argument("--out", default=DEFAULT_OUT, help="Fichier HTML de sortie")
    args = parser.parse_args()

    script_dir = Path(__file__).parent
    jsx_path = Path(args.jsx) if Path(args.jsx).is_absolute() else script_dir / args.jsx
    out_path = Path(args.out) if Path(args.out).is_absolute() else script_dir / args.out

    print(f"Source : {jsx_path}")
    print(f"Sortie : {out_path}")
    build(jsx_path, out_path)


if __name__ == "__main__":
    main()
