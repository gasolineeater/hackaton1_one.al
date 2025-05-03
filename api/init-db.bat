@echo off
echo Initializing ONE Albania Database...

set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\api"

echo Installing dependencies...
call "%NODE_PATH%\npm.cmd" install

echo Initializing database...
echo This may take a moment...
echo.
echo If you see any errors, please check:
echo 1. Is MySQL running in XAMPP?
echo 2. Have you created the "one_albania_db" database in phpMyAdmin?
echo 3. Are the database credentials correct in the .env file?
echo.
call "%NODE_PATH%\node.exe" scripts/initDb.js

echo.
echo Database initialization complete!
echo.

pause
