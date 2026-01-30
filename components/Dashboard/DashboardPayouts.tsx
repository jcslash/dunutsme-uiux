import React, { memo, useState, useCallback } from 'react';
import { CreditCardIcon } from '../visuals/Icons';
import type { UserProfile } from '../../lib/userService';

interface DashboardPayoutsProps {
  userProfile: UserProfile | null;
}

type NetworkType = 'ethereum' | 'bitcoin' | 'solana';

const networkConfig: Record<NetworkType, { name: string; icon: string; placeholder: string }> = {
  ethereum: { name: 'Ethereum', icon: '◆', placeholder: 'Enter your ethereum wallet address (0x...)' },
  bitcoin: { name: 'Bitcoin', icon: '₿', placeholder: 'Enter your bitcoin wallet address' },
  solana: { name: 'Solana', icon: '◎', placeholder: 'Enter your solana wallet address' },
};

// Mock payout history (empty for now)
const mockPayouts: Array<{
  id: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  txHash?: string;
}> = [];

export const DashboardPayouts: React.FC<DashboardPayoutsProps> = memo(({ userProfile }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('ethereum');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const availableBalance = 0; // Mock balance
  const minimumWithdrawal = 10;

  const handleNetworkChange = useCallback((network: NetworkType) => {
    setSelectedNetwork(network);
    setWalletAddress('');
    setSaveSuccess(false);
  }, []);

  const handleSaveWallet = useCallback(async () => {
    if (!walletAddress.trim()) return;
    
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Reset success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000);
  }, [walletAddress]);

  const handleWithdraw = useCallback(() => {
    // TODO: Implement withdrawal logic
    alert('Withdrawal feature coming soon!');
  }, []);

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
            <p className="text-4xl font-bold text-chocolate-dark mt-1">${availableBalance.toFixed(2)}</p>
            <p className="text-sm text-chocolate-dark/50 mt-1">Minimum withdrawal: ${minimumWithdrawal.toFixed(2)}</p>
          </div>
          <button
            onClick={handleWithdraw}
            disabled={availableBalance < minimumWithdrawal}
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
            {(Object.keys(networkConfig) as NetworkType[]).map((network) => (
              <button
                key={network}
                onClick={() => handleNetworkChange(network)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  selectedNetwork === network
                    ? 'bg-glaze-pink text-white'
                    : 'bg-cream text-chocolate-dark hover:bg-chocolate/5'
                }`}
              >
                <span>{networkConfig[network].icon}</span>
                {networkConfig[network].name}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Address Input */}
        <div className="mb-4">
          <label className="block text-sm text-chocolate-dark/70 mb-2">Wallet Address</label>
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder={networkConfig[selectedNetwork].placeholder}
            className="w-full px-4 py-3 rounded-xl border border-chocolate/10 focus:border-glaze-pink focus:ring-2 focus:ring-glaze-pink/20 outline-none transition-all"
          />
          <p className="text-xs text-chocolate-dark/50 mt-2">
            Make sure this is the correct address. Transactions cannot be reversed.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveWallet}
          disabled={!walletAddress.trim() || isSaving}
          className="px-6 py-3 bg-chocolate text-white font-semibold rounded-full hover:bg-chocolate/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : saveSuccess ? '✓ Saved!' : 'Save Wallet'}
        </button>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl border border-chocolate/5">
        <div className="p-6 border-b border-chocolate/5">
          <h2 className="text-lg font-semibold text-chocolate-dark">Payout History</h2>
        </div>
        
        {mockPayouts.length > 0 ? (
          <div className="divide-y divide-espresso/5">
            {mockPayouts.map((payout) => (
              <div key={payout.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    payout.status === 'completed' ? 'bg-green-500' :
                    payout.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-chocolate-dark">${payout.amount.toFixed(2)}</p>
                    <p className="text-xs text-chocolate-dark/50">{payout.date}</p>
                  </div>
                </div>
                <span className={`text-sm capitalize ${
                  payout.status === 'completed' ? 'text-green-600' :
                  payout.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {payout.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-chocolate/5 flex items-center justify-center">
              <CreditCardIcon className="w-8 h-8 text-chocolate-dark/30" />
            </div>
            <h3 className="text-lg font-semibold text-chocolate-dark mb-2">No payouts yet</h3>
            <p className="text-chocolate-dark/60 max-w-sm mx-auto">
              When you withdraw your earnings, the transactions will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

DashboardPayouts.displayName = 'DashboardPayouts';
