import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "127.0.0.1",   // IMPORTANT: Use this, NOT localhost
  user: "root",        // Default XAMPP MySQL user
  password: "",        // Leave blank unless you set one
  database: "coffeebara_spa_db"
});

export default db;
