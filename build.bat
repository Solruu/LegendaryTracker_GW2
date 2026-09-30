@echo off
echo ================================================
echo   GW2 Legendary Tracker - Generation du .exe
echo ================================================
echo.

REM Verifier que Python est disponible
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Python n'est pas installe ou pas dans le PATH.
    echo Telechargez Python sur https://python.org
    pause
    exit /b 1
)

REM Resolution des dernieres versions (numerique, pas alphabetique)
for /f "delims=" %%f in ('python -c "import glob,re;print(max(glob.glob('gw2_build_html_v*.py'),key=lambda p:int(re.search(r'_v(\d+)\.py$',p).group(1))))"') do set BUILDHTML=%%f
for /f "delims=" %%f in ('python -c "import glob,re;print(max(glob.glob('gw2_flask_server_v*.py'),key=lambda p:int(re.search(r'_v(\d+)\.py$',p).group(1))))"') do set SERVER=%%f
if not defined BUILDHTML (
    echo [ERREUR] Aucun gw2_build_html_v*.py trouve.
    pause
    exit /b 1
)
if not defined SERVER (
    echo [ERREUR] Aucun gw2_flask_server_v*.py trouve.
    pause
    exit /b 1
)
echo Build HTML : %BUILDHTML%
echo Serveur    : %SERVER%
echo.

echo [1/4] Installation des dependances...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERREUR] L'installation des dependances a echoue.
    pause
    exit /b 1
)

echo.
echo [2/4] Generation du HTML standalone depuis le JSX...
python "%BUILDHTML%"
if errorlevel 1 (
    echo [ERREUR] La generation du HTML a echoue.
    pause
    exit /b 1
)

echo.
echo [3/4] Generation du .exe avec PyInstaller...
pyinstaller ^
    --onefile ^
    --console ^
    --name "gw2_server" ^
    --add-data "requirements.txt;." ^
    "%SERVER%"
if errorlevel 1 (
    echo [ERREUR] La generation du .exe a echoue.
    pause
    exit /b 1
)

echo.
echo [4/4] Nettoyage des fichiers temporaires...
if exist build rmdir /s /q build
if exist gw2_server.spec del gw2_server.spec

echo.
echo ================================================
echo   Succes ! Le fichier est dans : dist\gw2_server.exe
echo ================================================
echo.
pause
