import { eq, desc } from 'drizzle-orm';
import db from '../config/database.js';
import { wallets, walletBalances } from '../models/schema.js';
import * as privyService from './privyService.js';

/**
 * 獲取錢包詳情
 */
export async function getWalletById(walletId) {
  try {
    const result = await db.select().from(wallets).where(eq(wallets.id, walletId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching wallet by ID:', error);
    throw error;
  }
}

/**
 * 根據地址獲取錢包
 */
export async function getWalletByAddress(address) {
  try {
    const result = await db.select().from(wallets).where(eq(wallets.address, address)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching wallet by address:', error);
    throw error;
  }
}

/**
 * 獲取錢包餘額（實時查詢 + 緩存）
 */
export async function getWalletBalance(walletId) {
  try {
    const wallet = await getWalletById(walletId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }
    
    let balanceData;
    
    // 嘗試從 Privy API 獲取餘額
    try {
      balanceData = await privyService.getWalletBalance(walletId);
    } catch (privyError) {
      console.warn('Privy API failed, using fallback:', privyError.message);
      // 使用備用方案：通過地址查詢
      balanceData = await privyService.getWalletBalanceByAddress(wallet.address, wallet.chainType);
    }
    
    // 保存餘額快照
    if (balanceData && balanceData.balances) {
      for (const balance of balanceData.balances) {
        await db.insert(walletBalances).values({
          walletId: walletId,
          chain: balance.chain,
          asset: balance.asset,
          rawValue: balance.raw_value,
          rawValueDecimals: balance.raw_value_decimals,
          displayValueNative: balance.display_values?.eth || balance.display_values?.btc || balance.display_values?.sol || '0',
          displayValueUsd: balance.display_values?.usd || '0',
        });
      }
    }
    
    return balanceData;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
}

/**
 * 獲取錢包餘額歷史
 */
export async function getWalletBalanceHistory(walletId, limit = 30) {
  try {
    const result = await db.select()
      .from(walletBalances)
      .where(eq(walletBalances.walletId, walletId))
      .orderBy(desc(walletBalances.snapshotAt))
      .limit(limit);
    
    return result;
  } catch (error) {
    console.error('Error fetching wallet balance history:', error);
    throw error;
  }
}

/**
 * 獲取錢包的最新餘額快照
 */
export async function getLatestWalletBalance(walletId) {
  try {
    const result = await db.select()
      .from(walletBalances)
      .where(eq(walletBalances.walletId, walletId))
      .orderBy(desc(walletBalances.snapshotAt))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching latest wallet balance:', error);
    throw error;
  }
}

/**
 * 計算總餘額（USD）
 */
export async function calculateTotalBalance(userId) {
  try {
    // 獲取用戶所有錢包
    const userWallets = await db.select().from(wallets).where(eq(wallets.userId, userId));
    
    let totalUsd = 0;
    const balancesByWallet = [];
    
    for (const wallet of userWallets) {
      try {
        const balance = await getWalletBalance(wallet.id);
        
        if (balance && balance.balances) {
          for (const b of balance.balances) {
            const usdValue = parseFloat(b.display_values?.usd || '0');
            totalUsd += usdValue;
          }
          
          balancesByWallet.push({
            walletId: wallet.id,
            address: wallet.address,
            balances: balance.balances,
          });
        }
      } catch (error) {
        console.warn(`Failed to fetch balance for wallet ${wallet.id}:`, error.message);
      }
    }
    
    return {
      totalUsd: totalUsd.toFixed(2),
      wallets: balancesByWallet,
    };
  } catch (error) {
    console.error('Error calculating total balance:', error);
    throw error;
  }
}

/**
 * 格式化餘額顯示
 */
export function formatBalance(rawValue, decimals) {
  try {
    const value = BigInt(rawValue);
    const divisor = BigInt(10 ** decimals);
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const displayDecimals = 6; // 顯示 6 位小數
    const truncatedFractional = fractionalStr.substring(0, displayDecimals);
    
    return `${integerPart}.${truncatedFractional}`;
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0.000000';
  }
}

export default {
  getWalletById,
  getWalletByAddress,
  getWalletBalance,
  getWalletBalanceHistory,
  getLatestWalletBalance,
  calculateTotalBalance,
  formatBalance,
};
