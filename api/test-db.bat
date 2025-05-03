@echo off
echo Testing database connection...

set NODE_PATH=C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\node-v20.11.1-win-x64
set PATH=%NODE_PATH%;%PATH%

cd /d "C:\Users\Perdorues\OneDrive - Seico inc\Desktop\hackaton1_one.al\api"

echo.
echo Checking MySQL connection...
call "%NODE_PATH%\node.exe" -e "const mysql = require('mysql2/promise'); const dotenv = require('dotenv'); dotenv.config(); async function testConnection() { try { console.log('Connecting to MySQL...'); const conn = await mysql.createConnection({ host: process.env.DB_HOST, port: process.env.DB_PORT, user: process.env.DB_USER, password: process.env.DB_PASSWORD }); console.log('Connected to MySQL successfully!'); console.log('Checking for database:', process.env.DB_NAME); const [rows] = await conn.execute('SHOW DATABASES LIKE ?', [process.env.DB_NAME]); if (rows.length === 0) { console.log('Database does not exist. Please create it in phpMyAdmin.'); } else { console.log('Database exists. Checking tables...'); await conn.changeUser({ database: process.env.DB_NAME }); const [tables] = await conn.execute('SHOW TABLES'); if (tables.length === 0) { console.log('No tables found. Please run init-db.bat to create tables.'); } else { console.log('Tables found:', tables.length); tables.forEach(table => { const tableName = Object.values(table)[0]; console.log('- ' + tableName); }); } } await conn.end(); } catch (err) { console.error('Error testing connection:', err.message); } } testConnection();"

echo.
echo Test complete.
echo.

pause
