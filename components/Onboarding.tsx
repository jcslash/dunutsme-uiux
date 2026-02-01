import React, { useState, useCallback, memo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { DonutLogoIcon } from './visuals/Icons';
import * as apiClient from '../lib/apiClient';
import type { UserProfile } from '../lib/apiClient';

interface OnboardingProps {
  onFinish: (profile: UserProfile) => void;
  onLogout: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = memo(({ onFinish, onLogout }) => {
  const { user: privyUser, getAccessToken } = usePrivy();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Check username availability
  const checkUsername = useCallback(async (value: string) => {
    if (!value || value.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    setIsCheckingUsername(true);
    try {
      const { available } = await apiClient.checkUsername(value);
      setUsernameAvailable(available);
    } catch (err) {
      console.error('Error checking username:', err);
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  }, []);

  // Handle username change with debounce
  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(value);
    
    // Debounce username check
    const timeoutId = setTimeout(() => {
      checkUsername(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [checkUsername]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || isSubmitting || usernameAvailable === false) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get access token
      const token = await getAccessToken();
      
      // Get email from Privy user
      const email = privyUser?.email?.address || '';
      
      // Register user
      const { user } = await apiClient.registerUser(token, {
        username,
        displayName: displayName || username,
        bio: bio || undefined,
        email: email || undefined,
      });
      
      // Notify parent component
      onFinish(user);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  }, [username, displayName, bio, isSubmitting, usernameAvailable, privyUser, getAccessToken, onFinish]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
            <DonutLogoIcon className="w-10 h-10" />
          </div>
          <h1 className="font-fredoka text-3xl font-bold text-chocolate-dark mb-2">
            Create your page
          </h1>
          <p className="text-chocolate/60">
            Choose a unique username for your Donuts page
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-chocolate/5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-chocolate-dark mb-2">
                Username *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40">
                  donutsme.app/
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="yourname"
                  className={`w-full pl-[140px] pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                    usernameAvailable === true
                      ? 'border-green-badge focus:ring-green-badge/20'
                      : usernameAvailable === false
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-chocolate/10 focus:ring-glaze-pink/20'
                  }`}
                  required
                  minLength={3}
                  maxLength={30}
                  pattern="[a-z0-9_-]+"
                  disabled={isSubmitting}
                />
                {isCheckingUsername && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-chocolate/20 border-t-chocolate rounded-full animate-spin" />
                  </div>
                )}
                {!isCheckingUsername && usernameAvailable === true && (
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-badge" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {!isCheckingUsername && usernameAvailable === false && (
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              {usernameAvailable === false && (
                <p className="text-xs text-red-500 mt-1">This username is already taken</p>
              )}
              <p className="text-xs text-chocolate/50 mt-1">
                3-30 characters, letters, numbers, underscores and hyphens only
              </p>
            </div>

            {/* Display Name (Optional) */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-chocolate-dark mb-2">
                Display Name (Optional)
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-chocolate/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-glaze-pink/20 transition-colors"
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            {/* Bio (Optional) */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-chocolate-dark mb-2">
                Bio (Optional)
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your supporters about yourself..."
                className="w-full px-4 py-3 border border-chocolate/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-glaze-pink/20 transition-colors resize-none"
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
              />
              <p className="text-xs text-chocolate/50 mt-1">
                {bio.length}/500 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !username || usernameAvailable === false || isCheckingUsername}
              className="w-full bg-chocolate-dark text-white py-3 rounded-full font-medium hover:bg-chocolate transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating your page...' : 'Create my page'}
            </button>
          </form>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full mt-4 text-sm text-chocolate/50 hover:text-chocolate transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
});

Onboarding.displayName = 'Onboarding';
