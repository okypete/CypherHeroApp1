@echo off
title Cypher Hero - Quick Start
color 0A

echo.
echo   ╔════════════════════════════════════════╗
echo   ║     CYPHER HERO - QUICK START         ║
echo   ╚════════════════════════════════════════╝
echo.
echo   This will install dependencies and start the app
echo.
echo   Press any key to continue...
pause >nul
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo   [X] Node.js is not installed!
    echo.
    echo   Please install Node.js first:
    echo   https://nodejs.org/
    echo.
    echo   After installing Node.js, run this script again.
    echo.
    pause
    exit /b 1
)

echo   [OK] Node.js found
node --version
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check if node_modules exists
if exist "node_modules" (
    echo   [OK] Dependencies already installed
    echo.
) else (
    echo   [*] Installing dependencies...
    echo   This may take 2-3 minutes...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo   [X] Installation failed!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo   [OK] Installation complete!
    echo.
)

REM Create .env.local if it doesn't exist
if not exist ".env.local" (
    echo # Supabase Configuration (Optional) > .env.local
    echo # Add your Supabase credentials for multiplayer features >> .env.local
    echo NEXT_PUBLIC_SUPABASE_URL= >> .env.local
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY= >> .env.local
)

echo   ╔════════════════════════════════════════╗
echo   ║   Starting Cypher Hero App...         ║
echo   ╚════════════════════════════════════════╝
echo.
echo   The app will open at: http://localhost:3000
echo.
echo   Press Ctrl+C to stop the server
echo.
echo   ════════════════════════════════════════
echo.

call npm run dev

pause


