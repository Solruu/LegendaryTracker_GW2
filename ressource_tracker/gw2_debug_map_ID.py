"""
GW2 MumbleLink — Diagnostic MapID
===================================
Lance ce script EN JEU sur une map dont tu connais le MapID
(ex: Blazeridge Steppes = 20).
Il affiche tous les uint32 du bloc context qui pourraient être le MapID.
"""

import mmap
import struct

MUMBLE_LINK_SIZE = 5460

def main():
    try:
        ml = mmap.mmap(-1, MUMBLE_LINK_SIZE, "MumbleLink")
    except Exception as e:
        print(f"Erreur ouverture MumbleLink : {e}")
        return

    ml.seek(0)
    data = ml.read(MUMBLE_LINK_SIZE)

    ui_tick = struct.unpack_from("<I", data, 4)[0]
    print(f"uiTick = {ui_tick}  ({'OK — GW2 écrit' if ui_tick > 0 else 'ZERO — GW2 pas en jeu ?'})")

    ax, ay, az = struct.unpack_from("<fff", data, 8)
    print(f"Position avatar : x={ax:.2f} y={ay:.2f} z={az:.2f}")

    print(f"\n--- Scan du bloc context (offset 1196, 256 bytes) ---")
    print(f"    Tu dois être sur une map dont tu connais l'ID.")
    print(f"    Repère la valeur qui correspond à ton MapID actuel.\n")

    # Scan tous les uint32 possibles dans les 256 bytes du context
    context_start = 1196
    for i in range(0, 256 - 3, 4):
        val = struct.unpack_from("<I", data, context_start + i)[0]
        if val > 0:
            print(f"    context[{i:3d}] = {val}")

    print(f"\n--- Recherche de la valeur 20 dans TOUTE la mémoire MumbleLink ---\n")
    found = False
    for i in range(0, MUMBLE_LINK_SIZE - 3, 4):
        val = struct.unpack_from("<I", data, i)[0]
        if val == 20:
            print(f"    offset {i} = 20  ← CANDIDAT MapID !")
            found = True
    if not found:
        print("    Aucune valeur 20 trouvée.")

    print(f"\n--- Tous les uint32 non-nuls entre offset 500 et 1500 ---\n")
    for i in range(500, 1500, 4):
        val = struct.unpack_from("<I", data, i)[0]
        if 0 < val < 100000:
            print(f"    offset {i} = {val}")

    ml.close()

if __name__ == "__main__":
    main()