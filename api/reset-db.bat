@echo off
echo Resetting ONE Albania Database...
echo WARNING: This will delete all existing data!
echo.

set /p CONFIRM=Are you sure you want to reset the database? (y/n): 
if /i "%CONFIRM%" neq "y" (
  echo Database reset cancelled.
  pause
  exit /b 0
)

set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\api"

echo Resetting database (dropping and recreating all tables)...
call "%NODE_PATH%\node.exe" scripts/initDb.js --force

echo.
echo Database reset complete!
echo.

pause
