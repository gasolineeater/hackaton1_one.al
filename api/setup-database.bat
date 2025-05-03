@echo off
echo ONE Albania API - Database Setup

echo This script will help you set up the MySQL database for the ONE Albania API.
echo.

set /p DB_USER=Enter MySQL username (default: root):
if "%DB_USER%"=="" set DB_USER=root

set /p DB_PASSWORD=Enter MySQL password:

echo.
echo Creating database (one_albania_db)...
echo.

mysql -u %DB_USER% -p%DB_PASSWORD% < scripts/create_database.sql

if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Failed to create database. Please check your MySQL credentials and try again.
  echo.
  pause
  exit /b 1
)

echo.
echo Database created successfully!
echo.

echo Updating .env file with database credentials...
echo.

powershell -Command "(Get-Content .env) -replace 'DB_USER=root', 'DB_USER=%DB_USER%' | Set-Content .env"
powershell -Command "(Get-Content .env) -replace 'DB_PASSWORD=', 'DB_PASSWORD=%DB_PASSWORD%' | Set-Content .env"

echo .env file updated with your database credentials.
echo.

echo Running database initialization...
echo.

call npm run db:init

echo.
echo Database setup complete!
echo.
echo You can now start the API server with: npm run dev
echo.

pause
