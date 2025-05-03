@echo off
echo Checking if port 3001 is available...

netstat -ano | findstr :3001

if %ERRORLEVEL% EQU 0 (
  echo Port 3001 is already in use by another application.
  echo Please close that application or change the PORT in the .env file.
) else (
  echo Port 3001 is available.
)

pause
