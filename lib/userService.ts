/**
 * User Service - 用戶資料管理
 * 暫時使用 localStorage 儲存用戶資料
 * 未來可替換為後端 API
 */

export interface UserProfile {
  privyId: string;
  username: string;
  displayName?: string;
  bio?: string;
  email?: string;
  walletAddress?: string;
  createdAt: number;
  updatedAt?: number;
}

const STORAGE_KEY = 'donutsme_users';

/**
 * 獲取所有用戶資料
 */
const getAllUsers = (): Record<string, UserProfile> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

/**
 * 儲存所有用戶資料
 */
const saveAllUsers = (users: Record<string, UserProfile>): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

/**
 * 根據 Privy ID 檢查用戶是否已註冊
 */
export const isUserRegistered = (privyId: string): boolean => {
  const users = getAllUsers();
  return !!users[privyId];
};

/**
 * 根據 Privy ID 獲取用戶資料
 */
export const getUserByPrivyId = (privyId: string): UserProfile | null => {
  const users = getAllUsers();
  return users[privyId] || null;
};

/**
 * 檢查用戶名是否已被使用
 */
export const isUsernameTaken = (username: string): boolean => {
  const users = getAllUsers();
  const normalizedUsername = username.toLowerCase();
  return Object.values(users).some(
    user => user.username.toLowerCase() === normalizedUsername
  );
};

/**
 * 創建新用戶
 */
export const createUser = (
  privyId: string,
  username: string,
  additionalData?: {
    displayName?: string;
    bio?: string;
    email?: string;
    walletAddress?: string;
  }
): UserProfile => {
  const users = getAllUsers();
  
  const now = Date.now();
  const newUser: UserProfile = {
    privyId,
    username: username.toLowerCase(),
    displayName: additionalData?.displayName,
    bio: additionalData?.bio,
    email: additionalData?.email,
    walletAddress: additionalData?.walletAddress,
    createdAt: now,
    updatedAt: now,
  };
  
  users[privyId] = newUser;
  saveAllUsers(users);
  
  return newUser;
};

/**
 * 更新用戶資料
 */
export const updateUser = (
  privyId: string,
  updates: Partial<Omit<UserProfile, 'privyId' | 'createdAt'>>
): UserProfile | null => {
  const users = getAllUsers();
  const existingUser = users[privyId];
  
  if (!existingUser) {
    return null;
  }
  
  const updatedUser: UserProfile = {
    ...existingUser,
    ...updates,
    updatedAt: Date.now(),
  };
  
  users[privyId] = updatedUser;
  saveAllUsers(users);
  
  return updatedUser;
};

/**
 * 更新用戶個人資料（別名函數，方便使用）
 */
export const updateUserProfile = (
  privyId: string,
  updates: {
    displayName?: string;
    bio?: string;
    email?: string;
    walletAddress?: string;
  }
): UserProfile | null => {
  return updateUser(privyId, updates);
};

/**
 * 刪除用戶
 */
export const deleteUser = (privyId: string): boolean => {
  const users = getAllUsers();
  
  if (!users[privyId]) {
    return false;
  }
  
  delete users[privyId];
  saveAllUsers(users);
  
  return true;
};
