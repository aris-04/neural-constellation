@echo off
title Neural Constellation
cd /d %~dp0

echo ========================================
echo     Neural Constellation - Starting
echo ========================================
echo.

REM Check for admin rights
net session >nul 2>&1
if errorlevel 1 (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

REM Start Memurai/Redis
echo [1/4] Starting Redis...
net start Memurai >nul 2>&1
if errorlevel 1 (
    net start Redis >nul 2>&1
)
echo       Redis OK

REM Start PostgreSQL
echo [2/4] Starting PostgreSQL...
net start postgresql-x64-18 >nul 2>&1
echo       PostgreSQL OK

REM Start Backend
echo [3/4] Starting Backend...
start "NC - Backend" cmd /k "cd /d %~dp0backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000 --host 0.0.0.0"

REM Wait for backend to boot
echo       Waiting for backend...
timeout /t 6 /nobreak >nul

REM Start Frontend  
echo [4/4] Starting Frontend...
start "NC - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

REM Wait for frontend to boot
echo       Waiting for frontend...
timeout /t 8 /nobreak >nul

REM Open browser
echo.
echo Opening browser...
start http://localhost:3000

echo.
echo ========================================
echo   Neural Constellation is running!
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo ========================================
echo.
echo Close the Backend and Frontend windows to stop.
pause