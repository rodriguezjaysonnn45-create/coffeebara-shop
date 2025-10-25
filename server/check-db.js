import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

async function checkDatabase() {
  try {
    const connString = process.env.DATABASE_URL ||
      `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || ''}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'coffeebara_spa_db'}`;

    const client = new Client({ connectionString: connString });
    await client.connect();
    console.log("✅ Connected to Postgres database successfully");

    const dbName = process.env.DB_NAME || 'coffeebara_spa_db';
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (res.rowCount === 0) {
      console.log(`❌ Database '${dbName}' does not exist`);
    } else {
      console.log(`✅ Database '${dbName}' exists`);
    }

    await client.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
}

checkDatabase();