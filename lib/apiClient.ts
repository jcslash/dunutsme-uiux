/**
 * API Client for backend communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 獲取 Privy 訪問令牌
 */
function getAccessToken(): string | null {
  // 從 Privy 獲取訪問令牌
  // 這需要在組件中使用 usePrivy hook 獲取
  return null;
}

/**
 * 通用 API 請求函數
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // 添加認證令牌
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }
  
  return data;
}

// ============ User APIs ============

export interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  email?: string;
  createdAt: string;
  updatedAt?: string;
  wallets?: Wallet[];
  settings?: UserSettings;
}

export interface Wallet {
  id: string;
  userId: string;
  address: string;
  chainType: string;
  walletType: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserSettings {
  userId: string;
  autoConvertBtc: boolean;
  payoutSchedule: string;
  notificationEmail: boolean;
  notificationTransaction: boolean;
  notificationPayout: boolean;
}

/**
 * 註冊新用戶
 */
export async function registerUser(
  accessToken: string,
  data: {
    username: string;
    displayName?: string;
    bio?: string;
    email?: string;
  }
): Promise<{ user: UserProfile }> {
  return apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }, accessToken);
}

/**
 * 獲取當前用戶資料
 */
export async function getCurrentUser(accessToken: string): Promise<{ user: UserProfile }> {
  return apiRequest('/users/me', {
    method: 'GET',
  }, accessToken);
}

/**
 * 更新用戶資料
 */
export async function updateUser(
  accessToken: string,
  data: {
    displayName?: string;
    bio?: string;
    email?: string;
  }
): Promise<{ user: UserProfile }> {
  return apiRequest('/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  }, accessToken);
}

/**
 * 檢查用戶名是否可用
 */
export async function checkUsername(username: string): Promise<{ available: boolean }> {
  return apiRequest(`/users/check-username/${username}`, {
    method: 'GET',
  });
}

/**
 * 同步 Privy 錢包
 */
export async function syncWallets(accessToken: string): Promise<{ wallets: Wallet[] }> {
  return apiRequest('/users/sync-wallets', {
    method: 'POST',
  }, accessToken);
}

/**
 * 獲取用戶設置
 */
export async function getUserSettings(accessToken: string): Promise<{ settings: UserSettings }> {
  return apiRequest('/users/settings', {
    method: 'GET',
  }, accessToken);
}

/**
 * 更新用戶設置
 */
export async function updateUserSettings(
  accessToken: string,
  settings: Partial<UserSettings>
): Promise<{ settings: UserSettings }> {
  return apiRequest('/users/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }, accessToken);
}

// ============ Wallet APIs ============

export interface WalletBalance {
  balances: Array<{
    chain: string;
    asset: string;
    raw_value: string;
    raw_value_decimals: number;
    display_values: {
      eth?: string;
      btc?: string;
      sol?: string;
      usd?: string;
    };
  }>;
}

/**
 * 獲取所有錢包
 */
export async function getWallets(accessToken: string): Promise<{ wallets: Wallet[] }> {
  return apiRequest('/wallets', {
    method: 'GET',
  }, accessToken);
}

/**
 * 獲取主錢包
 */
export async function getPrimaryWallet(accessToken: string): Promise<{ wallet: Wallet }> {
  return apiRequest('/wallets/primary', {
    method: 'GET',
  }, accessToken);
}

/**
 * 獲取錢包詳情
 */
export async function getWallet(accessToken: string, walletId: string): Promise<{ wallet: Wallet }> {
  return apiRequest(`/wallets/${walletId}`, {
    method: 'GET',
  }, accessToken);
}

/**
 * 獲取錢包餘額
 */
export async function getWalletBalance(
  accessToken: string,
  walletId: string
): Promise<{ balance: WalletBalance }> {
  return apiRequest(`/wallets/${walletId}/balance`, {
    method: 'GET',
  }, accessToken);
}

/**
 * 獲取錢包餘額歷史
 */
export async function getWalletBalanceHistory(
  accessToken: string,
  walletId: string,
  limit?: number
): Promise<{ history: any[] }> {
  const query = limit ? `?limit=${limit}` : '';
  return apiRequest(`/wallets/${walletId}/balance/history${query}`, {
    method: 'GET',
  }, accessToken);
}

/**
 * 獲取總餘額
 */
export async function getTotalBalance(
  accessToken: string
): Promise<{ totalUsd: string; wallets: any[] }> {
  return apiRequest('/wallets/total-balance', {
    method: 'GET',
  }, accessToken);
}

export default {
  registerUser,
  getCurrentUser,
  updateUser,
  checkUsername,
  syncWallets,
  getUserSettings,
  updateUserSettings,
  getWallets,
  getPrimaryWallet,
  getWallet,
  getWalletBalance,
  getWalletBalanceHistory,
  getTotalBalance,
};
