import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

// Prefer DATABASE_URL (Render / managed DB). Fallback to individual PG_* env vars for local dev.
const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || ''}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'coffeebara_spa_db'}`;

const pool = new Pool({
  connectionString,
  // When running in production on some hosts, SSL is required.
  // If you use Render's managed Postgres, DATABASE_URL already includes sslmode=require.
  ssl: process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export default pool;
