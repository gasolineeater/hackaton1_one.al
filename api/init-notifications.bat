@echo off
echo Initializing Notification Templates...

set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\api"

echo Initializing notification templates...
call "%NODE_PATH%\node.exe" scripts/initNotificationTemplates.js

echo.
echo Notification templates initialization complete!
echo.

pause
