import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export const db = drizzle(pool);
