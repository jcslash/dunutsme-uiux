# Donuts Me - 部署和測試指南

## 目錄

1. [環境準備](#環境準備)
2. [本地開發設置](#本地開發設置)
3. [數據庫設置](#數據庫設置)
4. [Privy 配置](#privy-配置)
5. [Stripe 配置](#stripe-配置)
6. [測試流程](#測試流程)
7. [生產環境部署](#生產環境部署)
8. [故障排除](#故障排除)

---

## 環境準備

### 必需軟件

- **Node.js**: v22.0.0 或更高
- **MySQL**: v8.0 或更高
- **Git**: 最新版本
- **pnpm** 或 **npm**: 包管理器

### 賬戶準備

1. **Privy 賬戶**
   - 訪問 [https://privy.io](https://privy.io)
   - 創建應用並獲取 App ID 和 App Secret
   - 配置 embedded wallet 設置

2. **Stripe 賬戶**
   - 訪問 [https://stripe.com](https://stripe.com)
   - 創建賬戶並獲取 API 密鑰
   - 啟用 Stripe Connect

---

## 本地開發設置

### 1. 克隆項目

```bash
git clone https://github.com/jcslash/dunutsme-uiux.git
cd dunutsme-uiux
```

### 2. 安裝依賴

```bash
# 前端依賴
npm install

# 後端依賴
cd server
npm install
cd ..
```

### 3. 配置環境變量

#### 前端 `.env`

創建 `.env` 文件：

```env
VITE_API_URL=http://localhost:3001/api
```

#### 後端 `server/.env`

創建 `server/.env` 文件：

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=donutsme

# Privy Configuration
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Optional: Crypto Exchange (for BTC conversion)
COINBASE_API_KEY=your_coinbase_api_key
COINBASE_API_SECRET=your_coinbase_api_secret
```

---

## 數據庫設置

### 1. 創建數據庫

```bash
mysql -u root -p
```

在 MySQL 控制台中：

```sql
CREATE DATABASE donutsme CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 2. 運行數據庫遷移

```bash
cd server

# 生成遷移文件
npm run db:generate

# 執行遷移
npm run db:migrate

cd ..
```

### 3. 驗證數據庫

```bash
mysql -u root -p donutsme
```

檢查表是否創建成功：

```sql
SHOW TABLES;
DESCRIBE users;
DESCRIBE wallets;
DESCRIBE stripe_accounts;
DESCRIBE payouts;
```

---

## Privy 配置

### 1. 登入 Privy Dashboard

訪問 [https://dashboard.privy.io](https://dashboard.privy.io)

### 2. 配置應用

1. **基本設置**
   - App Name: Donuts Me
   - App URL: http://localhost:5173 (開發) / https://donutsme.app (生產)

2. **Embedded Wallet 設置**
   - 啟用 "Create on Login"
   - 選擇 "Users without wallets"
   - 啟用支持的鏈（Ethereum, Base, Solana 等）

3. **登入方式**
   - 啟用 Email
   - 啟用 Google OAuth
   - 啟用 Apple OAuth
   - 啟用 Wallet Connect

4. **獲取密鑰**
   - 複製 App ID
   - 生成並複製 App Secret（僅顯示一次，請妥善保管）

### 3. 配置 Webhook（可選）

1. 在 Privy Dashboard 中設置 Webhook URL
2. URL: `https://your-domain.com/api/transactions/webhook`
3. 選擇要接收的事件：
   - `wallet.created`
   - `wallet.linked`
   - `transaction.confirmed`

---

## Stripe 配置

### 1. 登入 Stripe Dashboard

訪問 [https://dashboard.stripe.com](https://dashboard.stripe.com)

### 2. 啟用 Stripe Connect

1. 進入 **Connect** → **Settings**
2. 選擇 **Express** 賬戶類型
3. 配置品牌信息和政策鏈接

### 3. 獲取 API 密鑰

1. 進入 **Developers** → **API keys**
2. 複製 **Secret key**（測試模式）
3. 保存到 `server/.env` 的 `STRIPE_SECRET_KEY`

### 4. 配置 Webhook

1. 進入 **Developers** → **Webhooks**
2. 點擊 **Add endpoint**
3. URL: `https://your-domain.com/api/stripe/webhook`
4. 選擇事件：
   - `account.updated`
   - `payout.created`
   - `payout.updated`
   - `payout.paid`
   - `payout.failed`
   - `payout.canceled`
5. 複製 **Signing secret** 到 `STRIPE_WEBHOOK_SECRET`

### 5. 測試 Webhook（本地開發）

使用 Stripe CLI 轉發 webhook：

```bash
# 安裝 Stripe CLI
brew install stripe/stripe-cli/stripe

# 登入
stripe login

# 轉發 webhook 到本地
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

---

## 測試流程

### 1. 啟動服務

#### 終端 1: 啟動後端

```bash
cd server
npm run dev
```

預期輸出：
```
✅ Database connected successfully
✅ Database initialized
🚀 Server is running on port 3001
📍 Health check: http://localhost:3001/health
📍 API base URL: http://localhost:3001/api
```

#### 終端 2: 啟動前端

```bash
npm run dev
```

預期輸出：
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2. 測試用戶註冊流程

1. **訪問應用**
   - 打開 http://localhost:5173

2. **登入/註冊**
   - 點擊 "Get Started" 或 "Log in"
   - 選擇登入方式（Email、Google、Wallet 等）
   - 完成 Privy 認證

3. **創建用戶名**
   - 輸入唯一的用戶名（3-30 字符）
   - 點擊 "Create my page"
   - 系統會自動：
     - 創建用戶記錄
     - 生成 Privy embedded wallet
     - 同步錢包到數據庫
     - 創建用戶設置

4. **驗證 Dashboard**
   - 應該看到 Dashboard 主頁
   - 顯示用戶名和頁面 URL
   - 顯示餘額（初始為 $0.00）

### 3. 測試錢包功能

#### 查看錢包地址

在瀏覽器控制台中：

```javascript
// 獲取訪問令牌
const token = await window.privy.getAccessToken();

// 獲取錢包列表
const response = await fetch('http://localhost:3001/api/wallets', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log('Wallets:', data.wallets);
```

#### 查看餘額

```javascript
const token = await window.privy.getAccessToken();
const walletId = 'your_wallet_id'; // 從上一步獲取

const response = await fetch(`http://localhost:3001/api/wallets/${walletId}/balance`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log('Balance:', data.balance);
```

### 4. 測試 Stripe Connect 入駐

1. **開始入駐**
   - 在 Dashboard 中找到提現設置
   - 點擊 "Connect Stripe" 或類似按鈕
   - 系統會調用 `POST /api/stripe/onboard`

2. **完成入駐流程**
   - 跳轉到 Stripe 入駐頁面
   - 填寫個人/企業信息
   - 添加銀行賬戶信息
   - 完成驗證

3. **驗證賬戶狀態**

```javascript
const token = await window.privy.getAccessToken();

const response = await fetch('http://localhost:3001/api/stripe/account', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log('Stripe Account:', data.account);
```

### 5. 測試提現功能

#### 創建測試提現

```javascript
const token = await window.privy.getAccessToken();

const response = await fetch('http://localhost:3001/api/payouts/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: '10.00',
    currency: 'usd'
  })
});
const data = await response.json();
console.log('Payout:', data.payout);
```

#### 查看提現歷史

```javascript
const token = await window.privy.getAccessToken();

const response = await fetch('http://localhost:3001/api/payouts', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log('Payouts:', data.payouts);
```

### 6. 測試 BTC 自動轉換設置

1. **切換 BTC 自動轉換**
   - 在 Dashboard 中找到 "Auto-convert to Bitcoin" 開關
   - 點擊切換
   - 系統會調用 `PUT /api/users/settings`

2. **驗證設置**

```javascript
const token = await window.privy.getAccessToken();

const response = await fetch('http://localhost:3001/api/users/settings', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log('Settings:', data.settings);
```

---

## 生產環境部署

### 1. 準備生產環境

#### 更新環境變量

```env
# Server
NODE_ENV=production
CLIENT_URL=https://donutsme.app

# Database
DB_HOST=your-production-db-host
DB_PASSWORD=strong-production-password

# Privy
PRIVY_APP_ID=your-production-app-id
PRIVY_APP_SECRET=your-production-app-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_your-live-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-live-webhook-secret
```

### 2. 構建前端

```bash
npm run build
```

生成的文件在 `dist/` 目錄中。

### 3. 部署選項

#### 選項 A: Vercel（推薦用於前端）

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### 選項 B: Railway（推薦用於後端）

1. 訪問 [https://railway.app](https://railway.app)
2. 連接 GitHub 倉庫
3. 添加 MySQL 數據庫
4. 配置環境變量
5. 部署

#### 選項 C: 自託管（VPS）

```bash
# 使用 PM2 管理進程
npm install -g pm2

# 啟動後端
cd server
pm2 start server.js --name donutsme-api

# 使用 Nginx 作為反向代理
# 配置 Nginx 將請求轉發到 localhost:3001
```

### 4. 配置域名和 SSL

1. **設置 DNS 記錄**
   - A 記錄指向服務器 IP
   - CNAME 記錄用於子域名

2. **配置 SSL 證書**
   - 使用 Let's Encrypt（免費）
   - 或使用 Cloudflare（自動 SSL）

3. **更新 Privy 和 Stripe 配置**
   - 在 Privy Dashboard 中更新 App URL
   - 在 Stripe Dashboard 中更新 Webhook URL

---

## 故障排除

### 問題 1: 無法連接數據庫

**症狀**:
```
❌ Database connection failed: connect ECONNREFUSED
```

**解決方案**:
1. 確認 MySQL 服務正在運行：
   ```bash
   # macOS
   brew services start mysql
   
   # Linux
   sudo systemctl start mysql
   ```

2. 檢查 `.env` 中的數據庫配置
3. 測試連接：
   ```bash
   mysql -u root -p -h localhost
   ```

### 問題 2: Privy 認證失敗

**症狀**:
```
Error: Invalid or expired token
```

**解決方案**:
1. 檢查 `PRIVY_APP_SECRET` 是否正確
2. 確認 Privy Dashboard 中的 App URL 配置
3. 清除瀏覽器緩存和 localStorage
4. 重新登入

### 問題 3: Stripe webhook 未收到

**症狀**:
- 提現狀態未更新
- 賬戶狀態未同步

**解決方案**:
1. 檢查 webhook URL 是否可訪問
2. 驗證 `STRIPE_WEBHOOK_SECRET` 是否正確
3. 查看 Stripe Dashboard 中的 webhook 日誌
4. 本地開發使用 Stripe CLI 轉發

### 問題 4: 前端無法連接後端

**症狀**:
```
Failed to fetch
```

**解決方案**:
1. 確認後端服務正在運行
2. 檢查 `VITE_API_URL` 配置
3. 檢查 CORS 設置（`server/server.js`）
4. 檢查防火牆規則

### 問題 5: 錢包餘額顯示為 0

**症狀**:
- Dashboard 顯示 $0.00
- 但錢包實際有資金

**解決方案**:
1. 檢查 Privy Wallets API 是否啟用
2. 確認錢包地址正確
3. 手動同步錢包：
   ```javascript
   const token = await window.privy.getAccessToken();
   await fetch('http://localhost:3001/api/users/sync-wallets', {
     method: 'POST',
     headers: { 'Authorization': `Bearer ${token}` }
   });
   ```

---

## 監控和日誌

### 後端日誌

```bash
# 查看實時日誌
cd server
npm run dev

# 使用 PM2 查看日誌
pm2 logs donutsme-api
```

### 數據庫查詢

```sql
-- 查看用戶數量
SELECT COUNT(*) FROM users;

-- 查看錢包數量
SELECT COUNT(*) FROM wallets;

-- 查看提現記錄
SELECT * FROM payouts ORDER BY created_at DESC LIMIT 10;

-- 查看 Stripe 賬戶狀態
SELECT 
  user_id,
  onboarding_completed,
  payouts_enabled,
  created_at
FROM stripe_accounts;
```

### 性能監控

使用工具如：
- **Sentry**: 錯誤追蹤
- **LogRocket**: 用戶會話重放
- **DataDog**: 應用性能監控

---

## 安全檢查清單

- [ ] 所有環境變量已設置且不在 Git 中
- [ ] 數據庫使用強密碼
- [ ] Privy App Secret 僅在後端使用
- [ ] Stripe Secret Key 僅在後端使用
- [ ] HTTPS 已啟用（生產環境）
- [ ] CORS 配置正確
- [ ] Webhook 簽名驗證已啟用
- [ ] 數據庫定期備份
- [ ] 日誌不包含敏感信息

---

## 支持和反饋

如有問題或建議，請：
1. 查看 [README_IMPLEMENTATION.md](./README_IMPLEMENTATION.md)
2. 提交 GitHub Issue
3. 聯繫開發團隊

---

## 許可證

MIT License
