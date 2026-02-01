import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import * as api from './apiClient';
import type { UserProfile } from './apiClient';

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  syncWallets: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, authenticated, getAccessToken } = usePrivy();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 從後端獲取用戶資料
   */
  const fetchUserProfile = useCallback(async () => {
    if (!authenticated || !user) {
      setUserProfile(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Failed to get access token');
      }

      const { user: profile } = await api.getCurrentUser(accessToken);
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
      
      // 如果用戶未註冊，userProfile 保持為 null
      // 這將觸發 Onboarding 流程
      if (err.message.includes('not found')) {
        setUserProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, user, getAccessToken]);

  /**
   * 刷新用戶資料
   */
  const refreshProfile = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  /**
   * 更新用戶資料
   */
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!authenticated) {
      throw new Error('Not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Failed to get access token');
      }

      const { user: updatedProfile } = await api.updateUser(accessToken, updates);
      setUserProfile(updatedProfile);
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, getAccessToken]);

  /**
   * 同步 Privy 錢包
   */
  const syncWallets = useCallback(async () => {
    if (!authenticated) {
      throw new Error('Not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Failed to get access token');
      }

      await api.syncWallets(accessToken);
      await fetchUserProfile(); // 刷新資料以獲取最新的錢包信息
    } catch (err: any) {
      console.error('Error syncing wallets:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, getAccessToken, fetchUserProfile]);

  // 當認證狀態改變時，自動獲取用戶資料
  useEffect(() => {
    if (authenticated && user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [authenticated, user, fetchUserProfile]);

  const value: UserContextType = {
    userProfile,
    isLoading,
    error,
    refreshProfile,
    updateProfile,
    syncWallets,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/**
 * Hook to use user context
 */
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;
