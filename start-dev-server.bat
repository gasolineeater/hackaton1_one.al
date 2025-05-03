@echo off
echo Setting up environment...
set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%
cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al"

echo Checking Node.js version...
"%NODE_PATH%\node.exe" --version

echo Checking if node_modules exists...
if not exist node_modules (
    echo Installing dependencies...
    "%NODE_PATH%\npm.cmd" install
) else (
    echo node_modules already exists.
)

echo Starting development server...
"%NODE_PATH%\node.exe" "%NODE_PATH%\node_modules\vite\bin\vite.js"

echo If the server doesn't start, try accessing http://localhost:5173 in your browser.
pause
