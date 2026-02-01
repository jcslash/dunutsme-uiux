import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { 
  ShareIcon, ChevronDownIcon, HeartIcon, CopyIcon
} from '../visuals/Icons';
import { BitcoinIcon } from '../visuals/CryptoLogos';
import { ShareModal } from './ShareModal';
import type { UserProfile } from '../../lib/userService';
import * as apiClient from '../../lib/apiClient';

interface DashboardHomeProps {
  userProfile?: UserProfile | null;
}

// Time range options
const TIME_RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time', value: 'all' },
] as const;

// Static JSX
const CheckIconSmall = (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CheckIconMedium = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const NewBadge = (
  <span className="bg-gradient-to-r from-glaze-pink to-glaze-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
);

const EmptyProgressBar = (
  <div className="h-2 bg-cream rounded-full w-full overflow-hidden" />
);

// Memoized components
const LegendItem = memo<{ color: string; label: string; value: string }>(({ color, label, value }) => (
  <div className="flex items-center gap-3">
    <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
    <div className="flex items-baseline gap-2">
      <span className="text-sm text-chocolate/50">{label}</span>
      <span className="text-sm font-semibold text-chocolate-dark">{value}</span>
    </div>
  </div>
));
LegendItem.displayName = 'LegendItem';

const TimeRangeDropdown = memo<{
  isOpen: boolean;
  selectedValue: string;
  onToggle: () => void;
  onSelect: (value: string) => void;
}>(({ isOpen, selectedValue, onToggle, onSelect }) => {
  const selectedLabel = TIME_RANGES.find(t => t.value === selectedValue)?.label || 'Last 30 days';
  
  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="flex items-center gap-1.5 text-xs font-medium text-chocolate/50 bg-cream/50 px-3 py-1.5 rounded-full hover:bg-cream transition-colors"
      >
        {selectedLabel}
        <ChevronDownIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen ? (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-chocolate/10 py-1 z-50">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => onSelect(range.value)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                selectedValue === range.value
                  ? 'bg-glaze-pink/10 text-glaze-pink font-medium'
                  : 'text-chocolate/70 hover:bg-cream'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
});
TimeRangeDropdown.displayName = 'TimeRangeDropdown';

export const DashboardHome: React.FC<DashboardHomeProps> = memo(({ userProfile }) => {
  const { getAccessToken } = usePrivy();
  const { wallets } = useWallets();
  
  const [autoConvertBTC, setAutoConvertBTC] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTimeRange, setShowTimeRange] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [totalBalance, setTotalBalance] = useState<string>('0.00');
  const [walletsList, setWalletsList] = useState<any[]>([]);
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(false);
  const [showWallets, setShowWallets] = useState(false);
  
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load user settings
  useEffect(() => {
    if (!userProfile) return;
    
    const loadSettings = async () => {
      try {
        const token = await getAccessToken();
        const { settings } = await apiClient.getUserSettings(token);
        setAutoConvertBTC(settings.autoConvertBtc);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadSettings();
  }, [userProfile, getAccessToken]);

  // Load wallets and balance
  useEffect(() => {
    if (!userProfile) return;
    
    const loadWallets = async () => {
      setLoadingBalance(true);
      try {
        const token = await getAccessToken();
        const { wallets: apiWallets } = await apiClient.getWallets(token);
        setWalletsList(apiWallets);
        
        // Try to get total balance
        try {
          const { totalUsd } = await apiClient.getTotalBalance(token);
          setTotalBalance(totalUsd);
        } catch (error) {
          console.log('Balance API not available yet');
        }
      } catch (error) {
        console.error('Failed to load wallets:', error);
      } finally {
        setLoadingBalance(false);
      }
    };
    
    loadWallets();
  }, [userProfile, getAccessToken]);

  // Load Stripe account
  useEffect(() => {
    if (!userProfile) return;
    
    const loadStripe = async () => {
      setLoadingStripe(true);
      try {
        const token = await getAccessToken();
        const { account } = await apiClient.getStripeAccount(token);
        setStripeAccount(account);
      } catch (error) {
        // No Stripe account yet
        console.log('No Stripe account');
      } finally {
        setLoadingStripe(false);
      }
    };
    
    loadStripe();
  }, [userProfile, getAccessToken]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Toggle BTC auto-convert
  const handleToggleBTC = useCallback(async () => {
    const newValue = !autoConvertBTC;
    setAutoConvertBTC(newValue);
    
    try {
      const token = await getAccessToken();
      await apiClient.updateUserSettings(token, { autoConvertBtc: newValue });
    } catch (error) {
      console.error('Failed to update settings:', error);
      // Revert on error
      setAutoConvertBTC(!newValue);
    }
  }, [autoConvertBTC, getAccessToken]);

  // Stripe Connect handler
  const handleConnectStripe = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const email = userProfile?.email || '';
      const { url } = await apiClient.startStripeOnboarding(token, email);
      window.location.href = url;
    } catch (error) {
      console.error('Failed to start Stripe onboarding:', error);
      alert('Failed to connect Stripe. Please try again.');
    }
  }, [getAccessToken, userProfile]);

  // Refresh balance
  const handleRefreshBalance = useCallback(async () => {
    setLoadingBalance(true);
    try {
      const token = await getAccessToken();
      await apiClient.syncWallets(token);
      const { totalUsd } = await apiClient.getTotalBalance(token);
      setTotalBalance(totalUsd);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    } finally {
      setLoadingBalance(false);
    }
  }, [getAccessToken]);

  const displayName = userProfile?.displayName || userProfile?.username || 'User';
  const username = userProfile?.username || 'yourname';
  const pageUrl = `donutsme.app/${username}`;
  
  const initials = useMemo(() => 
    displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
    [displayName]
  );

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`https://${pageUrl}`);
      setCopied(true);
      
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copyTimeoutRef.current = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [pageUrl]);

  const handleOpenShareModal = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  const handleTimeRangeClick = useCallback(() => {
    setShowTimeRange(prev => !prev);
  }, []);

  const handleSelectTimeRange = useCallback((value: string) => {
    setSelectedTimeRange(value);
    setShowTimeRange(false);
  }, []);

  const toggleWallets = useCallback(() => {
    setShowWallets(prev => !prev);
  }, []);

  return (
    <div className="space-y-6">
      <ShareModal 
        isOpen={showShareModal} 
        onClose={handleCloseShareModal} 
        username={username}
      />

      {/* User Card */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-glaze-pink to-glaze-orange flex items-center justify-center text-white text-xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="font-fredoka text-xl font-bold text-chocolate-dark">
                Hi, {displayName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-chocolate/50">{pageUrl}</span>
                <button 
                  onClick={handleCopyLink}
                  className={`p-1 rounded transition-all ${
                    copied 
                      ? 'text-green-badge' 
                      : 'text-chocolate/30 hover:text-chocolate/60'
                  }`}
                  title="Copy link"
                >
                  {copied ? CheckIconSmall : <CopyIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={handleOpenShareModal}
            className="bg-chocolate-dark text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-chocolate transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
            Share page
          </button>
        </div>
      </div>

      {/* Wallets Card */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-fredoka text-lg font-bold text-chocolate-dark">Your Wallets</h2>
          <button
            onClick={handleRefreshBalance}
            disabled={loadingBalance}
            className="text-xs font-medium text-chocolate/50 hover:text-chocolate transition-colors disabled:opacity-50"
          >
            {loadingBalance ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="mb-4">
          <span className="font-fredoka text-3xl font-bold text-chocolate-dark">${totalBalance}</span>
          <span className="text-chocolate/40 ml-2 text-sm">USD</span>
        </div>

        {walletsList.length > 0 ? (
          <div className="space-y-3">
            <button
              onClick={toggleWallets}
              className="w-full flex items-center justify-between text-sm text-chocolate/70 hover:text-chocolate transition-colors"
            >
              <span>{walletsList.length} wallet{walletsList.length > 1 ? 's' : ''} connected</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${showWallets ? 'rotate-180' : ''}`} />
            </button>

            {showWallets && (
              <div className="space-y-2 pt-2 border-t border-chocolate/5">
                {walletsList.map((wallet) => (
                  <div key={wallet.id} className="flex items-center justify-between p-3 bg-cream/30 rounded-lg">
                    <div>
                      <div className="text-xs font-medium text-chocolate/50 uppercase">{wallet.chainType}</div>
                      <div className="text-sm font-mono text-chocolate-dark mt-1">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </div>
                    </div>
                    {wallet.isPrimary && (
                      <span className="text-[9px] font-bold px-2 py-1 rounded bg-green-badge/10 text-green-badge uppercase">Primary</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-chocolate/50">No wallets found. Please refresh or contact support.</p>
        )}
      </div>

      {/* Earnings Card */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-fredoka text-lg font-bold text-chocolate-dark">Earnings</h2>
          <TimeRangeDropdown
            isOpen={showTimeRange}
            selectedValue={selectedTimeRange}
            onToggle={handleTimeRangeClick}
            onSelect={handleSelectTimeRange}
          />
        </div>
        
        <div className="mb-6">
          <span className="font-fredoka text-4xl font-bold text-chocolate-dark">$0</span>
          <span className="text-chocolate/40 ml-2 text-sm">.00</span>
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          <LegendItem color="bg-glaze-orange" label="Supporters" value="$0" />
          <LegendItem color="bg-glaze-pink" label="Membership" value="$0" />
        </div>

        {EmptyProgressBar}

        {/* BTC Auto-Convert */}
        <div className="mt-6 pt-6 border-t border-chocolate/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F7931A]/10 flex items-center justify-center flex-shrink-0">
                <BitcoinIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-chocolate-dark text-sm">Auto-convert to Bitcoin</h3>
                  {NewBadge}
                </div>
                <p className="text-xs text-chocolate/50 mt-0.5">Swap all incoming earnings to BTC automatically.</p>
              </div>
            </div>
            
            <button 
              onClick={handleToggleBTC}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glaze-pink ${
                autoConvertBTC ? 'bg-green-badge' : 'bg-chocolate/10'
              }`}
              role="switch"
              aria-checked={autoConvertBTC}
            >
              <span 
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  autoConvertBTC ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stripe Connect Card */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <h2 className="font-fredoka text-lg font-bold text-chocolate-dark mb-4">Payouts</h2>
        
        {loadingStripe ? (
          <p className="text-sm text-chocolate/50">Loading...</p>
        ) : stripeAccount ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stripeAccount.payoutsEnabled ? 'bg-green-badge' : 'bg-yellow-500'}`} />
              <div>
                <div className="text-sm font-medium text-chocolate-dark">
                  {stripeAccount.payoutsEnabled ? 'Payouts Enabled' : 'Setup Incomplete'}
                </div>
                <div className="text-xs text-chocolate/50">
                  {stripeAccount.onboardingCompleted ? 'Your account is ready' : 'Please complete onboarding'}
                </div>
              </div>
            </div>
            
            {!stripeAccount.onboardingCompleted && (
              <button
                onClick={handleConnectStripe}
                className="w-full bg-chocolate-dark text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-chocolate transition-colors"
              >
                Complete Setup
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-chocolate/50">
              Connect your Stripe account to receive payouts to your bank account.
            </p>
            <button
              onClick={handleConnectStripe}
              className="w-full bg-chocolate-dark text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-chocolate transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
              </svg>
              Connect Stripe
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-2xl p-10 border border-chocolate/5 text-center">
        <div className="w-14 h-14 bg-glaze-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <HeartIcon className="w-7 h-7 text-glaze-pink" />
        </div>
        <h3 className="font-fredoka text-lg font-bold text-chocolate-dark mb-2">
          Ready to receive support
        </h3>
        <p className="text-chocolate/50 text-sm max-w-sm mx-auto mb-5">
          Share your link with your community to start receiving donuts.
        </p>
        <button 
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 bg-chocolate-dark text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-chocolate transition-colors"
        >
          {copied ? (
            <>
              {CheckIconMedium}
              Link copied!
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4" />
              Copy your link
            </>
          )}
        </button>
      </div>
    </div>
  );
});

DashboardHome.displayName = 'DashboardHome';
