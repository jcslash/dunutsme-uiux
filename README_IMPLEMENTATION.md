# Donuts Me - Privy Wallet 實現文檔

## 項目概述

這是 Donuts Me 創作者平台的完整實現，集成了 Privy embedded wallet、餘額查詢、交易歷史和 Stripe Connect 提現功能。

## 技術棧

### 前端
- **框架**: React 19 + TypeScript + Vite
- **認證**: Privy React SDK
- **狀態管理**: React Context API
- **樣式**: Tailwind CSS

### 後端
- **框架**: Node.js + Express
- **數據庫**: MySQL + Drizzle ORM
- **認證**: Privy Node SDK
- **支付**: Stripe Connect

## 項目結構

```
dunutsme-uiux/
├── components/              # React 組件
│   ├── Dashboard/          # Dashboard 相關組件
│   │   ├── DashboardHomeNew.tsx    # 新版 Dashboard（顯示真實餘額）
│   │   └── ...
│   ├── OnboardingNew.tsx   # 新版 Onboarding（連接後端）
│   └── ...
├── lib/                    # 工具庫
│   ├── apiClient.ts        # 後端 API 客戶端
│   ├── UserContext.tsx     # 用戶上下文 Provider
│   ├── privyConfig.ts      # Privy 配置
│   └── userService.ts      # 原有的用戶服務（localStorage）
├── server/                 # 後端服務
│   ├── config/            # 配置文件
│   │   └── database.js    # 數據庫配置
│   ├── models/            # 數據模型
│   │   └── schema.js      # Drizzle schema
│   ├── services/          # 業務邏輯
│   │   ├── privyService.js    # Privy API 服務
│   │   ├── userService.js     # 用戶管理服務
│   │   └── walletService.js   # 錢包管理服務
│   ├── routes/            # API 路由
│   │   ├── users.js       # 用戶相關路由
│   │   └── wallets.js     # 錢包相關路由
│   ├── middleware/        # 中間件
│   │   └── auth.js        # 認證中間件
│   ├── server.js          # 主服務器文件
│   ├── package.json       # 後端依賴
│   └── .env               # 環境變量
├── .env                   # 前端環境變量
└── package.json           # 前端依賴
```

## 功能實現

### ✅ 已完成

1. **Privy Embedded Wallet 集成**
   - 用戶登入時自動創建 embedded wallet
   - 錢包由 Privy 託管（TEE 安全硬件）
   - 支持多鏈（Ethereum, Solana, Base 等）

2. **用戶註冊/登入流程**
   - Privy 認證（Email, Google, Apple, Wallet）
   - 用戶名註冊（唯一性驗證）
   - 自動同步 Privy 錢包到數據庫

3. **錢包餘額查詢**
   - 實時查詢 Privy API 獲取餘額
   - 支持多鏈多資產
   - 餘額快照存儲（歷史追蹤）
   - Dashboard 顯示總餘額（USD）

4. **數據庫架構**
   - Users（用戶表）
   - Wallets（錢包表）
   - Wallet Balances（餘額快照表）
   - Transactions（交易記錄表）
   - Stripe Accounts（Stripe Connect 賬戶表）
   - Payouts（提現記錄表）
   - BTC Conversions（BTC 轉換記錄表）
   - User Settings（用戶設置表）

5. **API 端點**
   - `POST /api/users/register` - 註冊用戶
   - `GET /api/users/me` - 獲取當前用戶
   - `PUT /api/users/me` - 更新用戶資料
   - `GET /api/users/check-username/:username` - 檢查用戶名
   - `POST /api/users/sync-wallets` - 同步錢包
   - `GET /api/users/settings` - 獲取設置
   - `PUT /api/users/settings` - 更新設置
   - `GET /api/wallets` - 獲取所有錢包
   - `GET /api/wallets/primary` - 獲取主錢包
   - `GET /api/wallets/:walletId` - 獲取錢包詳情
   - `GET /api/wallets/:walletId/balance` - 獲取餘額
   - `GET /api/wallets/:walletId/balance/history` - 獲取餘額歷史
   - `GET /api/wallets/total-balance` - 獲取總餘額

### 🚧 待實現

1. **Stripe Connect 提現功能**
   - Stripe Connect 賬戶入駐
   - 提現到銀行賬戶
   - 提現歷史記錄
   - Stripe webhook 處理

2. **BTC 自動轉換**
   - 集成加密貨幣交易所 API
   - 自動兌換流程
   - 轉換歷史記錄

3. **交易歷史**
   - Privy webhook 接收交易事件
   - 交易記錄存儲
   - Dashboard 顯示交易歷史

4. **通知系統**
   - Email 通知
   - 交易通知
   - 提現通知

## 安裝和運行

### 前置要求

- Node.js 22+
- MySQL 8.0+
- Privy 賬戶和 App ID
- Stripe 賬戶（用於提現功能）

### 1. 安裝依賴

```bash
# 前端依賴
npm install

# 後端依賴
cd server
npm install
cd ..
```

### 2. 配置環境變量

#### 前端 `.env`
```env
VITE_API_URL=http://localhost:3001/api
```

#### 後端 `server/.env`
```env
# Server
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=donutsme

# Privy
PRIVY_APP_ID=cmkzsquk8002ljm0c5h3jsk6y
PRIVY_APP_SECRET=your_privy_app_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 3. 設置數據庫

```bash
# 創建數據庫
mysql -u root -p
CREATE DATABASE donutsme;
EXIT;

# 運行遷移
cd server
npm run db:generate
npm run db:migrate
cd ..
```

### 4. 啟動服務

```bash
# 終端 1: 啟動後端
cd server
npm run dev

# 終端 2: 啟動前端
npm run dev
```

### 5. 訪問應用

- 前端: http://localhost:5173
- 後端 API: http://localhost:3001/api
- 健康檢查: http://localhost:3001/health

## API 使用示例

### 註冊用戶

```bash
curl -X POST http://localhost:3001/api/users/register \
  -H "Authorization: Bearer YOUR_PRIVY_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "displayName": "Test User",
    "email": "test@example.com"
  }'
```

### 獲取錢包餘額

```bash
curl -X GET http://localhost:3001/api/wallets/WALLET_ID/balance \
  -H "Authorization: Bearer YOUR_PRIVY_ACCESS_TOKEN"
```

## 數據庫 Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Wallets Table
```sql
CREATE TABLE wallets (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  chain_type VARCHAR(50) NOT NULL,
  wallet_type VARCHAR(50) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

完整的 schema 請參考 `database_design.md`。

## 安全注意事項

1. **環境變量保護**
   - 不要提交 `.env` 文件到 Git
   - 使用 `.env.example` 作為模板

2. **API 密鑰安全**
   - Privy App Secret 只在後端使用
   - 前端只使用 Privy App ID

3. **認證和授權**
   - 所有敏感 API 都需要 Privy 訪問令牌
   - 後端驗證令牌有效性
   - 檢查用戶權限

4. **數據庫安全**
   - 使用參數化查詢（Drizzle ORM）
   - 限制數據庫用戶權限
   - 定期備份數據

## 故障排除

### 問題: 無法連接數據庫

**解決方案**:
1. 確認 MySQL 服務正在運行
2. 檢查 `.env` 中的數據庫配置
3. 確認數據庫已創建

### 問題: Privy API 返回 401

**解決方案**:
1. 檢查 `PRIVY_APP_SECRET` 是否正確
2. 確認訪問令牌未過期
3. 檢查 Privy Dashboard 中的 App ID

### 問題: 前端無法連接後端

**解決方案**:
1. 確認後端服務正在運行
2. 檢查 `VITE_API_URL` 配置
3. 檢查 CORS 設置

## 下一步計劃

1. **實現 Stripe Connect 提現功能**
   - 創建 Stripe 服務
   - 實現入駐流程
   - 實現提現 API

2. **實現 BTC 自動轉換**
   - 集成 Coinbase Commerce 或 Kraken API
   - 實現自動兌換邏輯

3. **實現交易歷史**
   - 設置 Privy webhook
   - 處理交易事件
   - 顯示在 Dashboard

4. **部署到生產環境**
   - 設置 CI/CD
   - 配置生產數據庫
   - 設置監控和日誌

## 貢獻

如有問題或建議，請提交 Issue 或 Pull Request。

## 許可證

MIT License
