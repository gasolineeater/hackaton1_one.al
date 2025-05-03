@echo off
echo ONE Albania API - Complete Setup

set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\api"

echo.
echo ===== Step 1: Checking MySQL =====
echo.
echo Please make sure MySQL is running in XAMPP.
echo.
pause

echo.
echo ===== Step 2: Installing Dependencies =====
echo.
call "%NODE_PATH%\npm.cmd" install
echo.

echo.
echo ===== Step 3: Initializing Database =====
echo.
call "%NODE_PATH%\node.exe" scripts/initDb.js
echo.

echo.
echo ===== Step 4: Creating Admin User =====
echo.
call "%NODE_PATH%\node.exe" scripts/createAdmin.js
echo.

echo.
echo ===== Step 5: Creating Sample Data =====
echo.
call "%NODE_PATH%\node.exe" scripts/createSampleData.js
echo.

echo.
echo ===== Step 6: Initializing Notification Templates =====
echo.
call "%NODE_PATH%\node.exe" scripts/initNotificationTemplates.js
echo.

echo.
echo ===== Step 7: Starting API Server =====
echo.
echo The API server will now start.
echo You can access the API tester at: http://localhost:3001/test.html
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.
pause

call "%NODE_PATH%\node.exe" server.js
