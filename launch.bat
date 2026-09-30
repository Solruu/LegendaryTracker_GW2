@echo off
echo ================================================
echo   GW2 Legendary Tracker Server (.exe)
echo ================================================
echo.

if not exist dist\gw2_server.exe (
    echo [ERREUR] dist\gw2_server.exe absent. Lancez build.bat d'abord.
    pause
    exit /b 1
)

REM Lancer le .exe avec chargement de la cle API depuis .env
if exist .env (
    echo Cle API detectee dans .env
    dist\gw2_server.exe --env
) else (
    echo ATTENTION : fichier .env non trouve !
    echo Copiez .env.example en .env et ajoutez votre cle API.
    pause
    exit /b 1
)

pause
