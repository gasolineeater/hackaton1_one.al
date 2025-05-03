@echo off
set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%
cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al"
echo Running Vite directly...
"%NODE_PATH%\node.exe" "%NODE_PATH%\node_modules\vite\bin\vite.js" --debug
