import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

let pool;

if (process.env.DATABASE_URL) {
  // Limpiar la URL removiendo channel_binding si existe
  const cleanUrl = process.env.DATABASE_URL
    .replace('&channel_binding=require', '')
    .replace('?channel_binding=require', '');

  pool = new Pool({
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: false }
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

export default pool;
