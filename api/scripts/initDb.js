import { syncDatabase } from '../models/index.js';
import { testConnection } from '../config/database.js';
import checkDatabase from './checkDatabase.js';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  try {
    console.log('Starting database initialization...');

    // First check if database exists and create it if needed
    const dbCheckSuccess = await checkDatabase();
    if (!dbCheckSuccess) {
      console.error('Database check failed. Cannot proceed with initialization.');
      process.exit(1);
    }

    // Test database connection
    console.log('Testing connection to the database...');
    await testConnection();
    console.log('Database connection successful.');

    // Sync database (set force to true to drop and recreate tables)
    const force = process.argv.includes('--force');
    console.log(`Syncing database ${force ? 'WITH' : 'WITHOUT'} dropping existing tables...`);
    await syncDatabase(force);

    console.log('Checking if tables were created...');
    // Check if tables were created
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [tables] = await connection.execute(
      `SHOW TABLES`
    );

    if (tables.length === 0) {
      console.error('No tables were created. Something went wrong.');
    } else {
      console.log('Tables created successfully:');
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`- ${tableName}`);
      });
    }

    await connection.end();

    console.log(`Database initialized ${force ? 'with' : 'without'} dropping existing tables.`);
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase();
