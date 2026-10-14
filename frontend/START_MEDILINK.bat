@echo off
title MEDILINK Online Pharmacy
echo.
echo ========================================
echo   Starting MEDILINK Online Pharmacy
echo ========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 22 LTS from https://nodejs.org/
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing project packages for the first time...
  call npm.cmd install
  if errorlevel 1 (
    echo Package installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo Opening the development server...
call npm.cmd run dev
pause
