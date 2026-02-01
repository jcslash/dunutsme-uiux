import { PrivyClient } from '@privy-io/node';
import dotenv from 'dotenv';

// 確保環境變量已加載
dotenv.config();

// 初始化 Privy 客戶端
const privyClient = new PrivyClient({
  appId: process.env.PRIVY_APP_ID,
  appSecret: process.env.PRIVY_APP_SECRET,
});

/**
 * 獲取用戶信息
 */
export async function getPrivyUser(privyUserId) {
  try {
    const user = await privyClient.getUser(privyUserId);
    return user;
  } catch (error) {
    console.error('Error fetching Privy user:', error);
    throw error;
  }
}

/**
 * 獲取用戶的所有錢包
 */
export async function getUserWallets(privyUserId) {
  try {
    const user = await privyClient.getUser(privyUserId);
    
    // 提取 embedded wallets 和 linked wallets
    const embeddedWallets = user.linked_accounts?.filter(
      account => account.type === 'wallet' && account.wallet_client_type === 'privy'
    ) || [];
    
    const externalWallets = user.linked_accounts?.filter(
      account => account.type === 'wallet' && account.wallet_client_type !== 'privy'
    ) || [];
    
    return {
      embedded: embeddedWallets,
      external: externalWallets,
      all: [...embeddedWallets, ...externalWallets],
    };
  } catch (error) {
    console.error('Error fetching user wallets:', error);
    throw error;
  }
}

/**
 * 獲取錢包餘額
 * 注意：這需要使用 Privy Wallets API，需要額外配置
 */
export async function getWalletBalance(walletId) {
  try {
    // 使用 Privy Wallets API
    const response = await fetch(
      `https://api.privy.io/v1/wallets/${walletId}/balance`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.PRIVY_APP_ID}:${process.env.PRIVY_APP_SECRET}`).toString('base64')}`,
          'privy-app-id': process.env.PRIVY_APP_ID,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Privy API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
}

/**
 * 獲取錢包地址的餘額（使用公開的 RPC）
 * 這是一個備用方案，當 Privy Wallets API 不可用時使用
 */
export async function getWalletBalanceByAddress(address, chainType = 'ethereum') {
  try {
    // 這裡需要根據不同的鏈類型使用不同的 RPC
    // 暫時返回模擬數據
    console.warn('Using mock balance data. Implement RPC calls for production.');
    
    return {
      balances: [
        {
          chain: 'base',
          asset: 'eth',
          raw_value: '0',
          raw_value_decimals: 18,
          display_values: {
            eth: '0.000',
            usd: '0.00',
          },
        },
      ],
    };
  } catch (error) {
    console.error('Error fetching wallet balance by address:', error);
    throw error;
  }
}

/**
 * 驗證 Privy 訪問令牌
 */
export async function verifyPrivyToken(accessToken) {
  try {
    console.log('Verifying Privy token...');
    console.log('Token length:', accessToken?.length);
    console.log('App ID:', process.env.PRIVY_APP_ID);
    console.log('App Secret exists:', !!process.env.PRIVY_APP_SECRET);
    
    const verifiedClaims = await privyClient.utils().auth().verifyAccessToken({
      access_token: accessToken
    });
    console.log('Token verified successfully:', verifiedClaims.userId);
    return verifiedClaims;
  } catch (error) {
    console.error('Error verifying Privy token:', error.message);
    console.error('Error details:', error);
    throw error;
  }
}

/**
 * 獲取用戶的主錢包（embedded wallet）
 */
export async function getPrimaryWallet(privyUserId) {
  try {
    const wallets = await getUserWallets(privyUserId);
    
    // 優先返回 embedded wallet
    if (wallets.embedded.length > 0) {
      return wallets.embedded[0];
    }
    
    // 如果沒有 embedded wallet，返回第一個錢包
    if (wallets.all.length > 0) {
      return wallets.all[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting primary wallet:', error);
    throw error;
  }
}

/**
 * 格式化錢包數據
 */
export function formatWalletData(privyWallet) {
  return {
    id: privyWallet.wallet_id || privyWallet.address, // Privy 可能沒有 wallet_id
    address: privyWallet.address,
    chainType: privyWallet.chain_type || 'ethereum',
    walletType: privyWallet.wallet_client_type === 'privy' ? 'embedded' : 'external',
    walletClient: privyWallet.wallet_client_type,
    verifiedAt: privyWallet.verified_at,
    firstVerifiedAt: privyWallet.first_verified_at,
  };
}

export default {
  getPrivyUser,
  getUserWallets,
  getWalletBalance,
  getWalletBalanceByAddress,
  verifyPrivyToken,
  getPrimaryWallet,
  formatWalletData,
};
