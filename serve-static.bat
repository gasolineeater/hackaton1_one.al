@echo off
set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%
cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al"
echo Starting a simple HTTP server...
"%NODE_PATH%\node.exe" -e "const http = require('http'); const fs = require('fs'); const server = http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'text/html'}); fs.readFile('test.html', (err, data) => { if (err) { res.writeHead(404); res.end('File not found'); } else { res.end(data); } }); }); server.listen(8080, '0.0.0.0', () => { console.log('Server running at http://localhost:8080/'); });"
