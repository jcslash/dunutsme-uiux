import React, { useState, useCallback, memo } from 'react';
import { DonutLogoIcon } from './visuals/Icons';

interface OnboardingProps {
  onFinish: () => void;
  onLogout: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = memo(({ onFinish, onLogout }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = useCallback(() => {
    if (username) {
      onFinish();
    }
  }, [username, onFinish]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow alphanumeric, underscore, and hyphen
    setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  const isUsernameValid = username.length > 0;

  return (
    <div className="min-h-screen bg-cream flex flex-col font-dm-sans">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center">
        <a href="#" className="w-10 h-10 hover:scale-105 transition-transform">
          <DonutLogoIcon />
        </a>
        <button 
          onClick={onLogout}
          className="text-sm font-medium text-chocolate/60 hover:text-chocolate transition-colors"
        >
          Log out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-16 px-4 sm:px-6">
        <div className="w-full max-w-[520px]">
          
          {/* Headings */}
          <h1 className="font-fredoka text-3xl sm:text-4xl font-bold text-chocolate-dark mb-3">
            Create your account
          </h1>
          <p className="text-lg text-chocolate/60 mb-8 font-medium">
            Choose a username for your page.
          </p>

          {/* Input Field Container */}
          <div className="relative group mb-8">
            <div className="w-full bg-white rounded-2xl border-2 border-chocolate/5 px-5 py-4 flex items-center shadow-sm transition-all focus-within:border-glaze-pink focus-within:shadow-glow-pink focus-within:ring-4 focus-within:ring-glaze-pink/10">
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
              />
            </div>
            {/* Validation/Status Hint */}
            {isUsernameValid && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-6 h-6 rounded-full bg-green-badge flex items-center justify-center text-white text-xs">
                  ✓
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            className="w-full py-4 rounded-full bg-gradient-to-br from-glaze-pink to-glaze-orange text-white font-fredoka font-bold text-lg shadow-glow-pink hover:-translate-y-1 hover:shadow-lg transition-all active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            disabled={!isUsernameValid}
            onClick={handleSubmit}
          >
            Sign up
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
