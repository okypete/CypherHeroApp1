@echo off
echo ========================================
echo   Cypher Hero - Install and Run
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check if node_modules exists
if exist "node_modules" (
    echo [INFO] Dependencies already installed
    echo.
) else (
    echo [INFO] Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Installation failed!
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
    echo.
)

REM Check for .env.local
if not exist ".env.local" (
    echo [INFO] Creating .env.local file...
    echo # Supabase Configuration (Optional) > .env.local
    echo # Add your Supabase credentials here for multiplayer features >> .env.local
    echo NEXT_PUBLIC_SUPABASE_URL= >> .env.local
    echo NEXT_PUBLIC_SUPABASE_ANON_KEY= >> .env.local
    echo.
    echo [INFO] .env.local file created (you can add Supabase credentials later)
    echo.
)

REM Start the development server
echo ========================================
echo   Starting Cypher Hero App...
echo ========================================
echo.
echo The app will open at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npm run dev

pause


