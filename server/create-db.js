import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function createDatabase() {
  try {
    // First connect without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
    });

    console.log("✅ Connected to MySQL server");
    
    // Create the database if it doesn't exist
    const dbName = process.env.DB_NAME || "coffeebara_spa_db";
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' created or already exists`);
    
    // Close the connection
    await connection.end();
    console.log("✅ Database setup complete");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Database setup failed:", err.message);
    process.exit(1);
  }
}

createDatabase();