const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create MySQL connection
const conn = mysql.createConnection({
  host: process.env.DB_HOST,       // e.g., localhost
  user: process.env.DB_USER,       // e.g., root
  password: process.env.DB_PASSWORD, // e.g., (blank or your password)
  database: process.env.DB_NAME    // e.g., expensetracker
});

// Connect to the database
conn.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

// Export the connection for use in other files
module.exports = conn;
