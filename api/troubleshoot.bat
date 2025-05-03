@echo off
echo ONE Albania API - Troubleshooting

set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\api"

echo.
echo ===== Checking MySQL Connection =====
echo.

echo Checking if MySQL is running...
netstat -ano | findstr :3306
if %ERRORLEVEL% EQU 0 (
  echo MySQL appears to be running (port 3306 is in use).
) else (
  echo MySQL does not appear to be running. Please start MySQL in XAMPP.
  goto :end
)

echo.
echo ===== Checking Database =====
echo.

echo Checking if database exists...
call "%NODE_PATH%\node.exe" -e "const mysql = require('mysql2/promise'); const dotenv = require('dotenv'); dotenv.config(); async function checkDb() { try { const conn = await mysql.createConnection({ host: process.env.DB_HOST, port: process.env.DB_PORT, user: process.env.DB_USER, password: process.env.DB_PASSWORD }); const [rows] = await conn.execute('SHOW DATABASES LIKE ?', [process.env.DB_NAME]); if (rows.length === 0) { console.log('Database does not exist. Please create it in phpMyAdmin.'); } else { console.log('Database exists.'); } await conn.end(); } catch (err) { console.error('Error checking database:', err.message); } } checkDb();"

echo.
echo ===== Checking Port Availability =====
echo.

echo Checking if port 3001 is available...
netstat -ano | findstr :3001
if %ERRORLEVEL% EQU 0 (
  echo Port 3001 is already in use by another application.
  echo Please close that application or change the PORT in the .env file.
) else (
  echo Port 3001 is available.
)

echo.
echo ===== Checking Dependencies =====
echo.

if not exist node_modules (
  echo node_modules directory not found. Dependencies are not installed.
  echo Please run: init-db.bat
) else (
  echo Dependencies appear to be installed.
)

echo.
echo ===== Checking .env File =====
echo.

if not exist .env (
  echo .env file not found. Please create it.
) else (
  echo .env file exists.
  echo Checking database configuration...
  findstr /C:"DB_" .env
)

echo.
echo ===== Troubleshooting Complete =====
echo.
echo If all checks passed, try running start-api.bat again.
echo If you still have issues, please check the error messages.
echo.

:end
pause
