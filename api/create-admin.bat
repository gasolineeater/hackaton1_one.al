@echo off
echo Creating Admin User...

set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\api"

echo Creating admin user...
call "%NODE_PATH%\node.exe" scripts/createAdmin.js

echo.
echo Admin user creation complete!
echo.

pause
