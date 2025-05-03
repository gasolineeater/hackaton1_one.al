@echo off
echo Creating Sample Data...

set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\api"

echo Creating sample data...
call "%NODE_PATH%\node.exe" scripts/createSampleData.js

echo.
echo Sample data creation complete!
echo.

pause
