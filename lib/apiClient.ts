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

export async function getCurrentUser(accessToken: string): Promise<{ user: UserProfile }> {
  return apiRequest('/users/me', {
    method: 'GET',
  }, accessToken);
}

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

export async function checkUsername(username: string): Promise<{ available: boolean }> {
  return apiRequest(`/users/check-username/${username}`, {
    method: 'GET',
  });
}

export async function syncWallets(accessToken: string): Promise<{ wallets: Wallet[] }> {
  return apiRequest('/users/sync-wallets', {
    method: 'POST',
  }, accessToken);
}

export async function getUserSettings(accessToken: string): Promise<{ settings: UserSettings }> {
  return apiRequest('/users/settings', {
    method: 'GET',
  }, accessToken);
}

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

export async function getWallets(accessToken: string): Promise<{ wallets: Wallet[] }> {
  return apiRequest('/wallets', {
    method: 'GET',
  }, accessToken);
}

export async function getPrimaryWallet(accessToken: string): Promise<{ wallet: Wallet }> {
  return apiRequest('/wallets/primary', {
    method: 'GET',
  }, accessToken);
}

export async function getWallet(accessToken: string, walletId: string): Promise<{ wallet: Wallet }> {
  return apiRequest(`/wallets/${walletId}`, {
    method: 'GET',
  }, accessToken);
}

export async function getWalletBalance(
  accessToken: string,
  walletId: string
): Promise<{ balance: WalletBalance }> {
  return apiRequest(`/wallets/${walletId}/balance`, {
    method: 'GET',
  }, accessToken);
}

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

export async function getTotalBalance(
  accessToken: string
): Promise<{ totalUsd: string; wallets: any[] }> {
  return apiRequest('/wallets/total-balance', {
    method: 'GET',
  }, accessToken);
}

// ============ Stripe APIs ============

export interface StripeAccount {
  id: string;
  onboardingCompleted: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  country: string;
  currency: string;
}

export interface StripeBalance {
  available: Array<{
    amount: string;
    currency: string;
  }>;
  pending: Array<{
    amount: string;
    currency: string;
  }>;
}

export async function startStripeOnboarding(
  accessToken: string,
  email: string,
  country?: string
): Promise<{ url: string; accountId: string }> {
  return apiRequest('/stripe/onboard', {
    method: 'POST',
    body: JSON.stringify({ email, country }),
  }, accessToken);
}

export async function getStripeAccount(accessToken: string): Promise<{ account: StripeAccount }> {
  return apiRequest('/stripe/account', {
    method: 'GET',
  }, accessToken);
}

export async function refreshStripeOnboardingUrl(accessToken: string): Promise<{ url: string }> {
  return apiRequest('/stripe/refresh-url', {
    method: 'POST',
  }, accessToken);
}

export async function getStripeDashboardUrl(accessToken: string): Promise<{ url: string }> {
  return apiRequest('/stripe/dashboard-url', {
    method: 'GET',
  }, accessToken);
}

export async function getStripeBalance(accessToken: string): Promise<{ balance: StripeBalance }> {
  return apiRequest('/stripe/balance', {
    method: 'GET',
  }, accessToken);
}

// ============ Payout APIs ============

export interface Payout {
  id: string;
  amount: string;
  currency: string;
  status: string;
  arrivalDate?: string;
  method?: string;
  failureCode?: string;
  failureMessage?: string;
  createdAt: string;
  updatedAt?: string;
}

export async function createPayout(
  accessToken: string,
  amount: string,
  currency?: string
): Promise<{ payout: Payout }> {
  return apiRequest('/payouts/create', {
    method: 'POST',
    body: JSON.stringify({ amount, currency }),
  }, accessToken);
}

export async function getPayouts(
  accessToken: string,
  limit?: number
): Promise<{ payouts: Payout[] }> {
  const query = limit ? `?limit=${limit}` : '';
  return apiRequest(`/payouts${query}`, {
    method: 'GET',
  }, accessToken);
}

export async function getPayout(
  accessToken: string,
  payoutId: string
): Promise<{ payout: Payout }> {
  return apiRequest(`/payouts/${payoutId}`, {
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
  startStripeOnboarding,
  getStripeAccount,
  refreshStripeOnboardingUrl,
  getStripeDashboardUrl,
  getStripeBalance,
  createPayout,
  getPayouts,
  getPayout,
};
