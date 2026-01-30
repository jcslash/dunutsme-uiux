import React, { memo, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CreditCardIcon } from '../visuals/Icons';
import type { UserProfile } from '../../lib/userService';

interface DashboardPayoutsProps {
  userProfile: UserProfile | null;
}

type NetworkType = 'ethereum' | 'bitcoin' | 'solana';

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  txHash?: string;
}

// Network config - hoisted as constant (Rule 5.4)
const NETWORK_CONFIG: Readonly<Record<NetworkType, { name: string; icon: string; placeholder: string }>> = {
  ethereum: { name: 'Ethereum', icon: '◆', placeholder: 'Enter your ethereum wallet address (0x...)' },
  bitcoin: { name: 'Bitcoin', icon: '₿', placeholder: 'Enter your bitcoin wallet address' },
  solana: { name: 'Solana', icon: '◎', placeholder: 'Enter your solana wallet address' },
} as const;

// Network keys - hoisted to avoid recreating on each render (Rule 7.9: Hoist RegExp Creation - same principle)
const NETWORK_KEYS: ReadonlyArray<NetworkType> = ['ethereum', 'bitcoin', 'solana'] as const;

// Mock payout history (empty for now) - hoisted as constant
const MOCK_PAYOUTS: ReadonlyArray<Payout> = [];

// Constants - hoisted (Rule 5.4)
const AVAILABLE_BALANCE = 0;
const MINIMUM_WITHDRAWAL = 10;

// Static JSX hoisted outside component (Rule 6.3)
const EmptyPayoutHistory = (
  <div className="p-12 text-center">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-chocolate/5 flex items-center justify-center">
      <CreditCardIcon className="w-8 h-8 text-chocolate-dark/30" />
    </div>
    <h3 className="text-lg font-semibold text-chocolate-dark mb-2">No payouts yet</h3>
    <p className="text-chocolate-dark/60 max-w-sm mx-auto">
      When you withdraw your earnings, the transactions will appear here.
    </p>
  </div>
);

// Memoized NetworkButton component (Rule 5.5)
const NetworkButton = memo<{
  network: NetworkType;
  isSelected: boolean;
  onClick: () => void;
}>(({ network, isSelected, onClick }) => {
  const config = NETWORK_CONFIG[network];
  
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
        isSelected
          ? 'bg-glaze-pink text-white'
          : 'bg-cream text-chocolate-dark hover:bg-chocolate/5'
      }`}
    >
      <span>{config.icon}</span>
      {config.name}
    </button>
  );
});
NetworkButton.displayName = 'NetworkButton';

// Memoized PayoutRow component (Rule 5.5)
const PayoutRow = memo<{ payout: Payout }>(({ payout }) => {
  // Derive status color during render (Rule 5.1)
  const statusDotColor = payout.status === 'completed' ? 'bg-green-500' :
                         payout.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500';
  const statusTextColor = payout.status === 'completed' ? 'text-green-600' :
                          payout.status === 'pending' ? 'text-yellow-600' : 'text-red-600';
  
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${statusDotColor}`} />
        <div>
          <p className="font-medium text-chocolate-dark">${payout.amount.toFixed(2)}</p>
          <p className="text-xs text-chocolate-dark/50">{payout.date}</p>
        </div>
      </div>
      <span className={`text-sm capitalize ${statusTextColor}`}>
        {payout.status}
      </span>
    </div>
  );
});
PayoutRow.displayName = 'PayoutRow';

export const DashboardPayouts: React.FC<DashboardPayoutsProps> = memo(({ userProfile }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('ethereum');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount (prevent memory leak)
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Derive values during render (Rule 5.1)
  const canWithdraw = AVAILABLE_BALANCE >= MINIMUM_WITHDRAWAL;
  const canSave = walletAddress.trim().length > 0 && !isSaving;
  const hasPayouts = MOCK_PAYOUTS.length > 0;
  const currentNetworkConfig = NETWORK_CONFIG[selectedNetwork];

  // Memoize formatted values
  const formattedBalance = useMemo(() => `$${AVAILABLE_BALANCE.toFixed(2)}`, []);
  const formattedMinimum = useMemo(() => `$${MINIMUM_WITHDRAWAL.toFixed(2)}`, []);

  // Handle network change (Rule 5.7: Put Interaction Logic in Event Handlers)
  const handleNetworkChange = useCallback((network: NetworkType) => {
    setSelectedNetwork(network);
    setWalletAddress('');
    setSaveSuccess(false);
  }, []);

  // Handle wallet address change
  const handleWalletChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  }, []);

  // Handle save wallet with cleanup
  const handleSaveWallet = useCallback(async () => {
    // Early return (Rule 7.8)
    if (!walletAddress.trim()) return;
    
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Clear previous timeout if exists
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      setSaveSuccess(false);
      saveTimeoutRef.current = null;
    }, 3000);
  }, [walletAddress]);

  const handleWithdraw = useCallback(() => {
    alert('Withdrawal feature coming soon!');
  }, []);

  // Derive button text during render (Rule 5.1)
  const saveButtonText = isSaving ? 'Saving...' : saveSuccess ? '✓ Saved!' : 'Save Wallet';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-chocolate-dark">Payouts</h1>
        <p className="text-chocolate-dark/60 mt-1">Manage your wallet and withdrawal settings</p>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-chocolate-dark/50 uppercase tracking-wide">Available Balance</p>
            <p className="text-4xl font-bold text-chocolate-dark mt-1">{formattedBalance}</p>
            <p className="text-sm text-chocolate-dark/50 mt-1">Minimum withdrawal: {formattedMinimum}</p>
          </div>
          <button
            onClick={handleWithdraw}
            disabled={!canWithdraw}
            className="px-6 py-3 bg-glaze-pink text-white font-semibold rounded-full hover:bg-glaze-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Wallet Settings */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <h2 className="text-lg font-semibold text-chocolate-dark mb-4">Payout Wallet</h2>
        
        {/* Network Selection */}
        <div className="mb-4">
          <label className="block text-sm text-chocolate-dark/70 mb-2">Network</label>
          <div className="flex gap-2">
            {NETWORK_KEYS.map((network) => (
              <NetworkButton
                key={network}
                network={network}
                isSelected={selectedNetwork === network}
                onClick={() => handleNetworkChange(network)}
              />
            ))}
          </div>
        </div>

        {/* Wallet Address Input */}
        <div className="mb-4">
          <label className="block text-sm text-chocolate-dark/70 mb-2">Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={handleWalletChange}
            placeholder={currentNetworkConfig.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-chocolate/10 focus:border-glaze-pink focus:ring-2 focus:ring-glaze-pink/20 outline-none transition-all"
          />
          <p className="text-xs text-chocolate-dark/50 mt-2">
            Make sure this is the correct address. Transactions cannot be reversed.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveWallet}
          disabled={!canSave}
          className="px-6 py-3 bg-chocolate text-white font-semibold rounded-full hover:bg-chocolate/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveButtonText}
        </button>
      </div>

      {/* Payout History - explicit conditional rendering (Rule 6.8) */}
      <div className="bg-white rounded-2xl border border-chocolate/5">
        <div className="p-6 border-b border-chocolate/5">
          <h2 className="text-lg font-semibold text-chocolate-dark">Payout History</h2>
        </div>
        
        {hasPayouts ? (
          <div className="divide-y divide-espresso/5">
            {MOCK_PAYOUTS.map((payout) => (
              <PayoutRow key={payout.id} payout={payout} />
            ))}
          </div>
        ) : (
          EmptyPayoutHistory
        )}
      </div>
    </div>
  );
});

DashboardPayouts.displayName = 'DashboardPayouts';
