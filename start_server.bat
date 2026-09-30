@echo off
echo ================================================
echo   GW2 Legendary Tracker Server
echo ================================================
echo.

REM Resolution de la derniere version du serveur (numerique, pas alphabetique)
for /f "delims=" %%f in ('python -c "import glob,re;print(max(glob.glob('gw2_flask_server_v*.py'),key=lambda p:int(re.search(r'_v(\d+)\.py$',p).group(1))))"') do set SERVER=%%f
if not defined SERVER (
    echo [ERREUR] Aucun gw2_flask_server_v*.py trouve dans ce dossier.
    pause
    exit /b 1
)
echo Serveur : %SERVER%
echo Demarrage sur http://localhost:5000
echo Pour arreter : fermer cette fenetre ou Ctrl+C
echo.

REM Charger la cle API depuis .env si present
if exist .env (
    echo Cle API detectee dans .env
    python "%SERVER%" --env
) else (
    echo Pas de .env detecte - la cle sera passee depuis le tracker
    python "%SERVER%"
)

pause
