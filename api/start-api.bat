@echo off
echo Starting ONE Albania API Server...

set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

echo Using Node.js from: %NODE_PATH%

cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\api"

rem Check if .env file exists
if not exist .env (
  echo .env file not found. Creating from example...
  copy .env.example .env
  echo Please edit the .env file and add your Gemini API key.
  notepad .env
)

rem Install dependencies if node_modules doesn't exist
if not exist node_modules (
  echo Installing dependencies...
  call "%NODE_PATH%\npm.cmd" install
)

rem Start the server
echo Starting server...
echo This may take a moment...
echo.
echo If the server doesn't start, please check:
echo 1. Is MySQL running in XAMPP?
echo 2. Have you created the "one_albania_db" database in phpMyAdmin?
echo 3. Have you run init-db.bat to initialize the database?
echo 4. Is port 3001 available (not used by another application)?
echo.
echo Starting API server on port 3001...
call "%NODE_PATH%\node.exe" server.js

pause
