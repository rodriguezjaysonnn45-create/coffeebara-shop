import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function checkDatabase() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "coffeebara_spa_db",
    });

    console.log("Attempting to connect to database...");
    const conn = await pool.getConnection();
    console.log("✅ Connected to MySQL database successfully");
    
    console.log("Checking if database exists...");
    const [rows] = await conn.query("SHOW DATABASES LIKE ?", [process.env.DB_NAME || "coffeebara_spa_db"]);
    
    if (rows.length === 0) {
      console.log(`❌ Database '${process.env.DB_NAME || "coffeebara_spa_db"}' does not exist`);
    } else {
      console.log(`✅ Database '${process.env.DB_NAME || "coffeebara_spa_db"}' exists`);
    }
    
    conn.release();
    process.exit(0);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}

checkDatabase();