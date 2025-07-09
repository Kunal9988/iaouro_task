import { createConnection } from 'mysql2';
import { config } from 'dotenv';


config();

//  MySQL connection
const conn = createConnection({
  host: process.env.DB_HOST,       
  user: process.env.DB_USER,       
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME    
});

// Connection
conn.connect((err) => {
  if (err) {
    console.error(" Database connection failed:", err.stack);
    return;
  }
  console.log(" Connected to MySQL database!");
});

// Export the connection for use in other files
export default conn;
