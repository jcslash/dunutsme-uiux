import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../models/schema.js';

// 創建數據庫連接池
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'donutsme',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 創建 Drizzle 實例
export const db = drizzle(poolConnection, { schema, mode: 'default' });

// 測試數據庫連接
export async function testConnection() {
  try {
    const connection = await poolConnection.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// 初始化數據庫（創建表）
export async function initDatabase() {
  try {
    const connection = await poolConnection.getConnection();
    
    // 創建數據庫（如果不存在）
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'donutsme'}`);
    await connection.query(`USE ${process.env.DB_NAME || 'donutsme'}`);
    
    console.log('✅ Database initialized');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
}

export default db;
