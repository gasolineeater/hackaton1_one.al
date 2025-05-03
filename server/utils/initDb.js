const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Initialize database
 */
async function initializeDatabase() {
  let connection;
  
  try {
    // Create connection without database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    console.log('Connected to MySQL server.');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, '../config/database.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL script into individual statements
    const statements = sqlScript.split(';').filter(statement => statement.trim() !== '');
    
    // Execute each statement
    for (const statement of statements) {
      await connection.execute(statement + ';');
    }
    
    console.log('Database initialized successfully!');
    
    return true;
  } catch (error) {
    console.error('Error initializing database:', error.message);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      if (success) {
        console.log('Database setup completed.');
      } else {
        console.error('Database setup failed.');
      }
      process.exit(success ? 0 : 1);
    });
}

module.exports = { initializeDatabase };
