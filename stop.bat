@echo off
title Neural Constellation - Stopping
cd /d %~dp0

echo Stopping Neural Constellation...

taskkill /f /im uvicorn.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo Done. All services stopped.
pause