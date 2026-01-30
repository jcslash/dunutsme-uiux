/**
 * User Service - 用戶資料管理
 * 暫時使用 localStorage 儲存用戶資料
 * 未來可替換為後端 API
 * 
 * Optimized with Vercel React Best Practices:
 * - Rule 4.4: Version and Minimize localStorage Data
 * - Rule 7.5: Cache Storage API Calls
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

// Versioned storage key (Rule 4.4: Version and Minimize localStorage Data)
const STORAGE_VERSION = 'v1';
const STORAGE_KEY = `donutsme_users:${STORAGE_VERSION}`;

// In-memory cache for localStorage data (Rule 7.5: Cache Storage API Calls)
let usersCache: Record<string, UserProfile> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 5 seconds cache TTL

/**
 * 獲取所有用戶資料（帶快取）
 */
const getAllUsers = (): Record<string, UserProfile> => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (usersCache !== null && (now - cacheTimestamp) < CACHE_TTL) {
    return usersCache;
  }
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    usersCache = data ? JSON.parse(data) : {};
    cacheTimestamp = now;
    return usersCache;
  } catch {
    // Handle incognito mode, quota exceeded, or disabled localStorage
    usersCache = {};
    cacheTimestamp = now;
    return usersCache;
  }
};

/**
 * 儲存所有用戶資料
 */
const saveAllUsers = (users: Record<string, UserProfile>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    // Update cache
    usersCache = users;
    cacheTimestamp = Date.now();
  } catch {
    // Handle incognito mode, quota exceeded, or disabled localStorage
    console.warn('Failed to save to localStorage');
  }
};

/**
 * 清除快取（用於測試或強制刷新）
 */
export const clearCache = (): void => {
  usersCache = null;
  cacheTimestamp = 0;
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
 * Optimized with early return (Rule 7.8)
 */
export const isUsernameTaken = (username: string): boolean => {
  const users = getAllUsers();
  const normalizedUsername = username.toLowerCase();
  const userList = Object.values(users);
  
  // Early return for empty list (Rule 7.7: Early Length Check)
  if (userList.length === 0) {
    return false;
  }
  
  return userList.some(
    user => user.username.toLowerCase() === normalizedUsername
  );
};

/**
 * 創建新用戶
 * Only stores minimal required fields (Rule 4.4)
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
  // Only store fields that are actually used (Rule 4.4)
  const newUser: UserProfile = {
    privyId,
    username: username.toLowerCase(),
    createdAt: now,
    updatedAt: now,
  };
  
  // Only add optional fields if they have values
  if (additionalData?.displayName) {
    newUser.displayName = additionalData.displayName;
  }
  if (additionalData?.bio) {
    newUser.bio = additionalData.bio;
  }
  if (additionalData?.email) {
    newUser.email = additionalData.email;
  }
  if (additionalData?.walletAddress) {
    newUser.walletAddress = additionalData.walletAddress;
  }
  
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
  
  // Early return if user doesn't exist (Rule 7.8)
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
  
  // Early return if user doesn't exist (Rule 7.8)
  if (!users[privyId]) {
    return false;
  }
  
  delete users[privyId];
  saveAllUsers(users);
  
  return true;
};
