import '../loadEnv.js';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './connection.js';
import { seedInitialData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const splitSqlStatements = (sql) =>
  sql
    .replace(/^\s*--.*$/gm, '')
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);

export const initPostgresDB = async () => {
  console.log('🐘 Initializing PostgreSQL database tables and connections...');

  if (process.env.NODE_ENV !== 'production') {
    const dbName = process.env.PGDATABASE || 'college_app';
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(dbName)) {
      throw new Error(`Invalid PostgreSQL database name: ${dbName}`);
    }

    const adminPool = new pg.Pool({
      user: process.env.PGUSER || 'postgres',
      host: process.env.PGHOST || 'localhost',
      database: 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      port: parseInt(process.env.PGPORT || '5432', 10),
      ssl: false
    });

    try {
      const dbCheck = await adminPool.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [dbName]
      );

      if (dbCheck.rows.length === 0) {
        console.log(`📦 Database not found. Creating ${dbName} database...`);
        await adminPool.query(`CREATE DATABASE ${dbName}`);
        console.log(`✅ Database ${dbName} created successfully!`);
      }
    } catch (err) {
      console.log('ℹ️ Database might already exist or creation skipped:', err.message);
    } finally {
      await adminPool.end();
    }
  }

  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  const statements = splitSqlStatements(schemaSql);
  for (const statement of statements) {
    await pool.query(statement);
  }
  console.log(`✅ PostgreSQL Schema verified (${statements.length} statements).`);

  await seedInitialData();
};