import { eq } from 'drizzle-orm';
import db from '../config/database.js';
import { users, wallets, userSettings } from '../models/schema.js';
import * as privyService from './privyService.js';

/**
 * 檢查用戶是否已註冊
 */
export async function isUserRegistered(privyId) {
  try {
    const result = await db.select().from(users).where(eq(users.id, privyId)).limit(1);
    return result.length > 0;
  } catch (error) {
    console.error('Error checking user registration:', error);
    throw error;
  }
}

/**
 * 根據 Privy ID 獲取用戶
 */
export async function getUserByPrivyId(privyId) {
  try {
    const result = await db.select().from(users).where(eq(users.id, privyId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user by Privy ID:', error);
    throw error;
  }
}

/**
 * 根據用戶名獲取用戶
 */
export async function getUserByUsername(username) {
  try {
    const result = await db.select().from(users).where(eq(users.username, username.toLowerCase())).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw error;
  }
}

/**
 * 檢查用戶名是否已被使用
 */
export async function isUsernameTaken(username) {
  try {
    const user = await getUserByUsername(username);
    return user !== null;
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw error;
  }
}

/**
 * 創建新用戶並同步 Privy 錢包
 */
export async function createUser(privyId, username, additionalData = {}) {
  try {
    // 檢查用戶名是否已被使用
    const usernameTaken = await isUsernameTaken(username);
    if (usernameTaken) {
      throw new Error('Username already taken');
    }
    
    // 創建用戶記錄
    const newUser = {
      id: privyId,
      username: username.toLowerCase(),
      displayName: additionalData.displayName || username,
      bio: additionalData.bio || null,
      email: additionalData.email || null,
    };
    
    await db.insert(users).values(newUser);
    
    // 創建用戶設置
    await db.insert(userSettings).values({
      userId: privyId,
      autoConvertBtc: false,
      payoutSchedule: 'manual',
    });
    
    // 同步 Privy 錢包
    await syncUserWallets(privyId);
    
    // 返回完整的用戶數據
    return await getUserByPrivyId(privyId);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * 更新用戶資料
 */
export async function updateUser(privyId, updates) {
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    
    await db.update(users).set(updateData).where(eq(users.id, privyId));
    
    return await getUserByPrivyId(privyId);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * 同步用戶的 Privy 錢包到數據庫
 */
export async function syncUserWallets(privyId) {
  try {
    // 從 Privy 獲取用戶錢包
    const privyWallets = await privyService.getUserWallets(privyId);
    
    // 處理每個錢包
    for (const privyWallet of privyWallets.all) {
      const walletData = privyService.formatWalletData(privyWallet);
      
      // 檢查錢包是否已存在
      const existingWallet = await db.select()
        .from(wallets)
        .where(eq(wallets.address, walletData.address))
        .limit(1);
      
      if (existingWallet.length === 0) {
        // 創建新錢包記錄
        await db.insert(wallets).values({
          id: walletData.id,
          userId: privyId,
          address: walletData.address,
          chainType: walletData.chainType,
          walletType: walletData.walletType,
          isPrimary: walletData.walletType === 'embedded', // embedded wallet 設為主錢包
        });
      }
    }
    
    return await getUserWallets(privyId);
  } catch (error) {
    console.error('Error syncing user wallets:', error);
    throw error;
  }
}

/**
 * 獲取用戶的所有錢包
 */
export async function getUserWallets(privyId) {
  try {
    const result = await db.select().from(wallets).where(eq(wallets.userId, privyId));
    return result;
  } catch (error) {
    console.error('Error fetching user wallets:', error);
    throw error;
  }
}

/**
 * 獲取用戶的主錢包
 */
export async function getUserPrimaryWallet(privyId) {
  try {
    const result = await db.select()
      .from(wallets)
      .where(eq(wallets.userId, privyId))
      .where(eq(wallets.isPrimary, true))
      .limit(1);
    
    if (result.length > 0) {
      return result[0];
    }
    
    // 如果沒有主錢包，返回第一個錢包
    const allWallets = await getUserWallets(privyId);
    return allWallets[0] || null;
  } catch (error) {
    console.error('Error fetching user primary wallet:', error);
    throw error;
  }
}

/**
 * 獲取用戶設置
 */
export async function getUserSettings(privyId) {
  try {
    const result = await db.select().from(userSettings).where(eq(userSettings.userId, privyId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching user settings:', error);
    throw error;
  }
}

/**
 * 更新用戶設置
 */
export async function updateUserSettings(privyId, updates) {
  try {
    await db.update(userSettings).set(updates).where(eq(userSettings.userId, privyId));
    return await getUserSettings(privyId);
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
}

/**
 * 獲取完整的用戶資料（包含錢包和設置）
 */
export async function getCompleteUserProfile(privyId) {
  try {
    const user = await getUserByPrivyId(privyId);
    if (!user) {
      return null;
    }
    
    const userWallets = await getUserWallets(privyId);
    const settings = await getUserSettings(privyId);
    
    return {
      ...user,
      wallets: userWallets,
      settings,
    };
  } catch (error) {
    console.error('Error fetching complete user profile:', error);
    throw error;
  }
}

export default {
  isUserRegistered,
  getUserByPrivyId,
  getUserByUsername,
  isUsernameTaken,
  createUser,
  updateUser,
  syncUserWallets,
  getUserWallets,
  getUserPrimaryWallet,
  getUserSettings,
  updateUserSettings,
  getCompleteUserProfile,
};
