import React, { useState, useCallback, memo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { DonutLogoIcon } from './visuals/Icons';
import * as api from '../lib/apiClient';
import type { UserProfile } from '../lib/apiClient';

interface OnboardingProps {
  onFinish: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = memo(({ onFinish }) => {
  const { user: privyUser, logout, getAccessToken } = usePrivy();
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  /**
   * 檢查用戶名是否可用（防抖）
   */
  const checkUsernameAvailability = useCallback(async (usernameToCheck: string) => {
    if (usernameToCheck.length < 3) return;
    
    setIsCheckingUsername(true);
    try {
      const { available } = await api.checkUsername(usernameToCheck);
      if (!available) {
        setError('This username is already taken. Please choose another one.');
      }
    } catch (err) {
      console.error('Error checking username:', err);
    } finally {
      setIsCheckingUsername(false);
    }
  }, []);

  /**
   * 處理提交
   */
  const handleSubmit = useCallback(async () => {
    if (!username || isSubmitting || !privyUser) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 獲取訪問令牌
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Failed to get access token');
      }
      
      // 獲取用戶信息
      const email = privyUser.email?.address;
      
      // 註冊用戶
      const { user: profile } = await api.registerUser(accessToken, {
        username,
        displayName: username,
        email,
      });
      
      // 同步錢包
      await api.syncWallets(accessToken);
      
      // 通知父組件
      onFinish(profile);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }, [username, isSubmitting, privyUser, getAccessToken, onFinish]);

  /**
   * 處理輸入變化
   */
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // 只允許字母、數字、下劃線和連字符
    const value = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    setUsername(value);
    setError(null);
    
    // 檢查用戶名可用性
    if (value.length >= 3) {
      checkUsernameAvailability(value);
    }
  }, [checkUsernameAvailability]);

  /**
   * 處理鍵盤事件
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  const isUsernameValid = username.length >= 3 && username.length <= 30 && !error && !isCheckingUsername;
  const usernameHint = username.length > 0 && username.length < 3 
    ? 'Username must be at least 3 characters'
    : username.length > 30 
    ? 'Username must be 30 characters or less'
    : null;

  return (
    <div className="min-h-screen bg-cream flex flex-col font-dm-sans">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center">
        <a href="#" className="w-10 h-10 hover:scale-105 transition-transform">
          <DonutLogoIcon />
        </a>
        <button 
          onClick={logout}
          className="text-sm font-medium text-chocolate/60 hover:text-chocolate transition-colors"
        >
          Log out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-16 px-4 sm:px-6">
        <div className="w-full max-w-[520px]">
          
          {/* Welcome Message */}
          {privyUser?.email?.address && (
            <div className="mb-6 p-4 bg-white rounded-xl border border-chocolate/5 shadow-sm">
              <p className="text-sm text-chocolate/60">
                Welcome! You're signing up with{' '}
                <span className="font-semibold text-chocolate-dark">
                  {privyUser.email.address}
                </span>
              </p>
            </div>
          )}
          
          {/* Headings */}
          <h1 className="font-fredoka text-3xl sm:text-4xl font-bold text-chocolate-dark mb-3">
            Create your page
          </h1>
          <p className="text-lg text-chocolate/60 mb-8 font-medium">
            Choose a unique username for your Donuts Me page.
          </p>

          {/* Input Field Container */}
          <div className="relative group mb-2">
            <div className={`w-full bg-white rounded-2xl border-2 px-5 py-4 flex items-center shadow-sm transition-all focus-within:shadow-glow-pink focus-within:ring-4 focus-within:ring-glaze-pink/10 ${
              error 
                ? 'border-red-400 focus-within:border-red-400' 
                : 'border-chocolate/5 focus-within:border-glaze-pink'
            }`}>
              <span className="font-fredoka text-lg sm:text-xl text-chocolate/40 select-none mr-1">
                donutsme.app/
              </span>
              <input 
                type="text" 
                value={username}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="yourname"
                className="flex-grow font-fredoka text-lg sm:text-xl text-chocolate-dark placeholder:text-chocolate/20 bg-transparent outline-none min-w-0"
                autoFocus
                disabled={isSubmitting}
                maxLength={30}
              />
            </div>
            {/* Validation/Status Hint */}
            {isCheckingUsername && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-glaze-pink border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {isUsernameValid && !isCheckingUsername && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full bg-green-badge flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              </div>
            )}
          </div>

          {/* Error or Hint Message */}
          {(error || usernameHint) && (
            <p className={`text-sm mb-6 ${error ? 'text-red-500' : 'text-chocolate/50'}`}>
              {error || usernameHint}
            </p>
          )}
          {!error && !usernameHint && <div className="mb-6" />}

          {/* Submit Button */}
          <button 
            className="w-full py-4 rounded-full bg-gradient-to-br from-glaze-pink to-glaze-orange text-white font-fredoka font-bold text-lg shadow-glow-pink hover:-translate-y-1 hover:shadow-lg transition-all active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            disabled={!isUsernameValid || isSubmitting || isCheckingUsername}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating your page...
              </>
            ) : (
              'Create my page'
            )}
          </button>

          {/* Footer Terms */}
          <p className="mt-8 text-center text-sm text-chocolate/40">
            By continuing, you agree to the{' '}
            <a href="#" className="underline decoration-chocolate/20 hover:text-chocolate transition-colors">
              terms of service
            </a>{' '}
            and{' '}
            <a href="#" className="underline decoration-chocolate/20 hover:text-chocolate transition-colors">
              privacy policy
            </a>.
          </p>
        </div>
      </main>
    </div>
  );
});

Onboarding.displayName = 'Onboarding';
