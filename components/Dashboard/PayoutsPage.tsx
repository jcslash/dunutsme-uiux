import React, { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import * as apiClient from '../../lib/apiClient';

export const PayoutsPage: React.FC = () => {
  const { getAccessToken } = usePrivy();
  
  const [stripeAccount, setStripeAccount] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Load Stripe account and payouts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = await getAccessToken();
        
        // Load Stripe account
        try {
          const { account } = await apiClient.getStripeAccount(token);
          setStripeAccount(account);
        } catch (err) {
          console.log('No Stripe account');
        }
        
        // Load payouts
        try {
          const { payouts: payoutsList } = await apiClient.getPayouts(token, 20);
          setPayouts(payoutsList);
        } catch (err) {
          console.log('No payouts yet');
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [getAccessToken]);

  // Connect Stripe
  const handleConnectStripe = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const { url } = await apiClient.startStripeOnboarding(token, '');
      window.location.href = url;
    } catch (error) {
      console.error('Failed to connect Stripe:', error);
      setError('Failed to connect Stripe. Please try again.');
    }
  }, [getAccessToken]);

  // Create payout
  const handleCreatePayout = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    setCreating(true);
    setError('');
    
    try {
      const token = await getAccessToken();
      await apiClient.createPayout(token, amount);
      
      // Reload payouts
      const { payouts: payoutsList } = await apiClient.getPayouts(token, 20);
      setPayouts(payoutsList);
      setAmount('');
      alert('Payout created successfully!');
    } catch (error: any) {
      console.error('Failed to create payout:', error);
      setError(error.message || 'Failed to create payout');
    } finally {
      setCreating(false);
    }
  }, [amount, getAccessToken]);

  // Open Stripe Dashboard
  const handleOpenDashboard = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const { url } = await apiClient.getStripeDashboardUrl(token);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to open dashboard:', error);
    }
  }, [getAccessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-chocolate/50">Loading...</div>
      </div>
    );
  }

  // No Stripe account
  if (!stripeAccount) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-chocolate/5">
          <h1 className="font-fredoka text-2xl font-bold text-chocolate-dark mb-4">
            Connect Stripe
          </h1>
          <p className="text-chocolate/70 mb-6">
            Connect your Stripe account to receive payouts directly to your bank account. 
            Stripe handles all the payment processing and compliance for you.
          </p>
          
          <div className="bg-cream/50 rounded-xl p-6 mb-6">
            <h3 className="font-medium text-chocolate-dark mb-3">What you'll need:</h3>
            <ul className="space-y-2 text-sm text-chocolate/70">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-badge flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Personal or business information
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-badge flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Bank account details
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-badge flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Tax identification number
              </li>
            </ul>
          </div>
          
          <button
            onClick={handleConnectStripe}
            className="w-full bg-chocolate-dark text-white px-6 py-3 rounded-full font-medium hover:bg-chocolate transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
            </svg>
            Connect with Stripe
          </button>
        </div>
      </div>
    );
  }

  // Stripe account exists but onboarding incomplete
  if (!stripeAccount.onboardingCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-chocolate/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <h1 className="font-fredoka text-2xl font-bold text-chocolate-dark">
              Complete Your Setup
            </h1>
          </div>
          
          <p className="text-chocolate/70 mb-6">
            You're almost there! Please complete your Stripe onboarding to start receiving payouts.
          </p>
          
          <button
            onClick={handleConnectStripe}
            className="w-full bg-chocolate-dark text-white px-6 py-3 rounded-full font-medium hover:bg-chocolate transition-colors"
          >
            Continue Setup
          </button>
        </div>
      </div>
    );
  }

  // Full payout interface
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Account Status */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-badge" />
            <div>
              <h2 className="font-fredoka text-lg font-bold text-chocolate-dark">
                Stripe Connected
              </h2>
              <p className="text-sm text-chocolate/50">
                Payouts enabled • {stripeAccount.country.toUpperCase()} • {stripeAccount.currency.toUpperCase()}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleOpenDashboard}
            className="text-sm font-medium text-chocolate/70 hover:text-chocolate transition-colors"
          >
            Open Dashboard →
          </button>
        </div>
      </div>

      {/* Create Payout */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <h2 className="font-fredoka text-lg font-bold text-chocolate-dark mb-4">
          Request Payout
        </h2>
        
        <form onSubmit={handleCreatePayout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-chocolate-dark mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/50">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-chocolate/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-glaze-pink focus:border-transparent"
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={creating || !amount}
            className="w-full bg-chocolate-dark text-white px-6 py-3 rounded-full font-medium hover:bg-chocolate transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? 'Creating...' : 'Create Payout'}
          </button>
        </form>
        
        <p className="text-xs text-chocolate/50 mt-4">
          Payouts typically arrive in 2-3 business days. Stripe fees apply.
        </p>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <h2 className="font-fredoka text-lg font-bold text-chocolate-dark mb-4">
          Payout History
        </h2>
        
        {payouts.length > 0 ? (
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-4 bg-cream/30 rounded-xl"
              >
                <div>
                  <div className="font-medium text-chocolate-dark">
                    ${payout.amount} {payout.currency.toUpperCase()}
                  </div>
                  <div className="text-xs text-chocolate/50 mt-1">
                    {new Date(payout.createdAt).toLocaleDateString()} • {payout.method || 'standard'}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    payout.status === 'paid'
                      ? 'bg-green-badge/10 text-green-badge'
                      : payout.status === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-600'
                      : payout.status === 'failed'
                      ? 'bg-red-500/10 text-red-600'
                      : 'bg-chocolate/10 text-chocolate/50'
                  }`}>
                    {payout.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-chocolate/50 text-center py-8">
            No payouts yet. Create your first payout above.
          </p>
        )}
      </div>
    </div>
  );
};
