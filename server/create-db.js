import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

// This script will attempt to create the PostgreSQL database if it does not exist.
// Note: On managed DB services (Render), the DB is usually created for you and
// you should not run this script against production DBs.

async function createDatabase() {
  const dbName = process.env.DB_NAME || "coffeebara_spa_db";
  // Connect to default 'postgres' database to create the target DB
  const adminConnString = process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || ''}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5432}/postgres`;

  const client = new Client({ connectionString: adminConnString });
  try {
    await client.connect();
    console.log("✅ Connected to Postgres server");

    const check = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (check.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database '${dbName}' created`);
    } else {
      console.log(`✅ Database '${dbName}' already exists`);
    }

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Database setup failed:", err.message);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
}

createDatabase();