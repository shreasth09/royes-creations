@echo off
title Royes Creations Server - http://localhost:3000
echo ========================================================
echo       Starting Royes Creations E-Commerce Server
echo ========================================================
echo.
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"

echo [1/2] Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo [2/2] Launching server on http://localhost:3000 ...
echo.
echo Website URL: http://localhost:3000
echo Admin Portal: http://localhost:3000/admin
echo.
call npm run start
if errorlevel 1 (
    echo Production build not found or failed, starting in dev mode...
    call npm run dev
)
pause
