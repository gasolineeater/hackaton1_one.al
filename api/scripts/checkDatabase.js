import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Create connection without database name
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    console.log('Connected to MySQL server.');
    
    // Check if database exists
    const [rows] = await connection.execute(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [process.env.DB_NAME]
    );
    
    if (rows.length === 0) {
      console.log(`Database '${process.env.DB_NAME}' does not exist. Creating it...`);
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`Database '${process.env.DB_NAME}' created successfully.`);
    } else {
      console.log(`Database '${process.env.DB_NAME}' already exists.`);
    }
    
    await connection.end();
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Could not connect to MySQL server. Is it running?');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Check your MySQL username and password in the .env file.');
    }
    return false;
  }
}

export default checkDatabase;

// If this script is run directly
if (process.argv[1].includes('checkDatabase.js')) {
  checkDatabase().then(success => {
    if (success) {
      console.log('Database check completed successfully.');
      process.exit(0);
    } else {
      console.error('Database check failed.');
      process.exit(1);
    }
  });
}
