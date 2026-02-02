@echo off
REM EduCore OS Development Startup Script for Windows
REM This script starts both backend and frontend servers

echo.
echo Starting EduCore OS Development Servers...
echo.

REM Check if we're in the right directory
if not exist "educore-os" (
    echo Error: educore-os directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Starting Backend (NestJS) on port 3000...
start "EduCore Backend" cmd /k "cd educore-os\backend && npm run start:dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend (Vite) on port 5173...
start "EduCore Frontend" cmd /k "cd educore-os\frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
echo Access the application:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo.
echo Demo Credentials:
echo   Admin:   admin@fieldgreen.edu / password123
echo   Teacher: teacher@fieldgreen.edu / password123
echo   Parent:  parent@fieldgreen.edu / password123
echo   Student: student@fieldgreen.edu / password123
echo.
echo Close the terminal windows to stop the servers.
echo.
pause
