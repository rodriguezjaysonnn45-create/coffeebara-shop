#!/usr/bin/env node
/**
 * Simple migration runner that executes migrations/init_postgres.sql
 * Usage: NODE_ENV=production DATABASE_URL=... node scripts/migrate.js
 */
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const sqlPath = path.resolve(process.cwd(), 'migrations', 'init_postgres.sql');
if (!fs.existsSync(sqlPath)) {
  console.error('Migration file not found:', sqlPath);
  process.exit(1);
}

const sql = fs.readFileSync(sqlPath, 'utf8');

const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || ''}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'coffeebara_spa_db'}`;

async function run() {
  const client = new Client({ connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
  try {
    await client.connect();
    console.log('Connected to database, running migration...');
    await client.query(sql);
    console.log('Migration executed successfully');
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    try { await client.end(); } catch(e) {}
    process.exit(1);
  }
}

run();
