import express from 'express';
import dotenv from 'dotenv';
import pool from './database/db.js';
import  router from './routes/auth.js';

dotenv.config();
const app = express();
app.use(express.json());

// Automatic table initialization
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reset_token VARCHAR(255) DEFAULT NULL
      );
    `);
    console.log("🚀 PostgreSQL Database table synchronized.");
  } catch (err) {
    console.error("❌ DB Sync Error:", err.message);
  }
};
initDB();

// Mounting modular routes
app.use('/api/auth', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Clean MVC Server running on port ${PORT}`));
