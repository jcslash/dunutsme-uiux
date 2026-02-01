import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../models/schema.js';

// 創建 SQLite 數據庫連接
const sqlite = new Database(process.env.DB_PATH || './donutsme.db');

// 創建 Drizzle 實例
export const db = drizzle(sqlite, { schema });

// 測試數據庫連接
export async function testConnection() {
  try {
    // 測試查詢
    sqlite.prepare('SELECT 1').get();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// 初始化數據庫（創建表）
export async function initDatabase() {
  try {
    // SQLite 會自動創建文件，這裡我們創建表結構
    
    // Users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        display_name TEXT,
        bio TEXT,
        email TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);
    
    // Wallets table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS wallets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        address TEXT NOT NULL,
        chain_type TEXT NOT NULL,
        wallet_type TEXT NOT NULL,
        is_primary INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Wallet balances table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS wallet_balances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wallet_id TEXT NOT NULL,
        chain TEXT NOT NULL,
        asset TEXT NOT NULL,
        raw_value TEXT NOT NULL,
        raw_value_decimals INTEGER NOT NULL,
        display_value_native TEXT,
        display_value_usd TEXT,
        snapshot_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
      )
    `);
    
    // Transactions table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        wallet_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        chain TEXT NOT NULL,
        asset TEXT NOT NULL,
        amount TEXT NOT NULL,
        amount_decimals INTEGER NOT NULL,
        display_amount_native TEXT,
        display_amount_usd TEXT,
        from_address TEXT,
        to_address TEXT,
        tx_hash TEXT,
        metadata TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        completed_at INTEGER,
        FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Stripe accounts table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS stripe_accounts (
        id TEXT PRIMARY KEY,
        user_id TEXT UNIQUE NOT NULL,
        account_type TEXT NOT NULL,
        onboarding_completed INTEGER DEFAULT 0,
        charges_enabled INTEGER DEFAULT 0,
        payouts_enabled INTEGER DEFAULT 0,
        country TEXT,
        currency TEXT,
        metadata TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Payouts table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS payouts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        stripe_account_id TEXT NOT NULL,
        amount TEXT NOT NULL,
        currency TEXT NOT NULL,
        status TEXT NOT NULL,
        arrival_date INTEGER,
        method TEXT,
        destination_type TEXT,
        destination_id TEXT,
        failure_code TEXT,
        failure_message TEXT,
        metadata TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (stripe_account_id) REFERENCES stripe_accounts(id) ON DELETE CASCADE
      )
    `);
    
    // BTC conversions table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS btc_conversions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        wallet_id TEXT NOT NULL,
        transaction_id TEXT,
        from_asset TEXT NOT NULL,
        to_asset TEXT NOT NULL,
        from_amount TEXT NOT NULL,
        to_amount TEXT NOT NULL,
        exchange_rate TEXT,
        exchange_provider TEXT,
        status TEXT NOT NULL,
        error_message TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        completed_at INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
      )
    `);
    
    // User settings table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY,
        auto_convert_btc INTEGER DEFAULT 0,
        payout_schedule TEXT DEFAULT 'manual',
        notification_email INTEGER DEFAULT 1,
        notification_transaction INTEGER DEFAULT 1,
        notification_payout INTEGER DEFAULT 1,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    // Create indexes
    sqlite.exec(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
      CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
      CREATE INDEX IF NOT EXISTS idx_wallet_balances_wallet_id ON wallet_balances(wallet_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_stripe_accounts_user_id ON stripe_accounts(user_id);
      CREATE INDEX IF NOT EXISTS idx_payouts_user_id ON payouts(user_id);
    `);
    
    console.log('✅ Database initialized');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
}

export default db;
