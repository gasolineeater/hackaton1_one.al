@echo off
set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

echo Creating a temporary directory...
mkdir temp-vite-project
cd temp-vite-project

echo Creating a simple HTML file...
echo ^<!DOCTYPE html^> > index.html
echo ^<html^> >> index.html
echo ^<head^> >> index.html
echo     ^<title^>Simple Vite Project^</title^> >> index.html
echo ^</head^> >> index.html
echo ^<body^> >> index.html
echo     ^<h1^>Simple Vite Project^</h1^> >> index.html
echo     ^<p^>If you can see this, Vite is working!^</p^> >> index.html
echo     ^<script type="module" src="/main.js"^>^</script^> >> index.html
echo ^</body^> >> index.html
echo ^</html^> >> index.html

echo Creating a simple JavaScript file...
echo console.log('Vite is working!'); > main.js
echo document.body.style.backgroundColor = '#f0f0f0'; >> main.js

echo Creating a simple vite.config.js file...
echo import { defineConfig } from 'vite'; > vite.config.js
echo export default defineConfig({ >> vite.config.js
echo   server: { >> vite.config.js
echo     port: 3000, >> vite.config.js
echo     open: true >> vite.config.js
echo   } >> vite.config.js
echo }); >> vite.config.js

echo Creating a simple package.json file...
echo { > package.json
echo   "name": "simple-vite-project", >> package.json
echo   "private": true, >> package.json
echo   "version": "0.0.0", >> package.json
echo   "type": "module", >> package.json
echo   "scripts": { >> package.json
echo     "dev": "vite", >> package.json
echo     "build": "vite build", >> package.json
echo     "preview": "vite preview" >> package.json
echo   }, >> package.json
echo   "devDependencies": { >> package.json
echo     "vite": "^6.3.1" >> package.json
echo   } >> package.json
echo } >> package.json

echo Installing Vite...
"%NODE_PATH%\npm.cmd" install

echo Starting Vite development server...
"%NODE_PATH%\npm.cmd" run dev

pause
