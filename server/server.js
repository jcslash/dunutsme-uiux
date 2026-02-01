// 加載環境變量（必須在最前面）
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { testConnection, initDatabase } from './config/database.js';
import usersRouter from './routes/users.js';
import walletsRouter from './routes/wallets.js';
import stripeRouter from './routes/stripe.js';
import payoutsRouter from './routes/payouts.js';
import testRouter from './routes/test.js';

const app = express();
const PORT = process.env.PORT || 3001;

// 中間件
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 日誌中間件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 根路徑端點
app.get('/', (req, res) => {
  res.json({
    name: 'Donuts Me API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      api: '/api',
      users: '/api/users',
      wallets: '/api/wallets',
      stripe: '/api/stripe',
      payouts: '/api/payouts',
    },
  });
});

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API 路由
app.use('/api/users', usersRouter);
app.use('/api/wallets', walletsRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/payouts', payoutsRouter);
app.use('/api/test', testRouter);

// 404 處理
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
  });
});

// 啟動服務器
async function startServer() {
  try {
    // 測試數據庫連接
    console.log('🔌 Connecting to database...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }
    
    // 初始化數據庫
    await initDatabase();
    
    // 啟動服務器
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API base URL: http://localhost:${PORT}/api`);
      console.log(`\n✨ Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// 優雅關閉
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// 啟動
startServer();
