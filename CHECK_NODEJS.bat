@echo off
echo ========================================
echo   Checking Node.js Installation
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is NOT installed
    echo.
    echo Please install Node.js:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download the LTS version (recommended)
    echo 3. Run the installer
    echo 4. Restart your computer
    echo 5. Run this script again to verify
    echo.
    echo Opening Node.js download page...
    start https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed!
echo.
node --version
echo.
npm --version
echo.
echo ========================================
echo   You're ready to run the app!
echo ========================================
echo.
echo Next steps:
echo 1. Double-click START_HERE.bat
echo 2. Wait for installation
echo 3. The app will open automatically
echo.
pause


