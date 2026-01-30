import React, { memo } from 'react';
import { HeartIcon } from '../visuals/Icons';
import type { UserProfile } from '../../lib/userService';

interface DashboardSupportersProps {
  userProfile: UserProfile | null;
}

// Mock supporters data (empty for now)
const mockSupporters: Array<{
  id: string;
  name: string;
  amount: number;
  currency: string;
  message: string;
  date: string;
  avatar?: string;
}> = [];

export const DashboardSupporters: React.FC<DashboardSupportersProps> = memo(({ userProfile }) => {
  const totalSupporters = mockSupporters.length;
  const totalReceived = mockSupporters.reduce((sum, s) => sum + s.amount, 0);
  const thisMonth = mockSupporters
    .filter(s => {
      const date = new Date(s.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-chocolate-dark">Supporters</h1>
        <p className="text-chocolate-dark/60 mt-1">People who have supported you with donuts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
          <p className="text-xs text-chocolate-dark/50 uppercase tracking-wide">Total Supporters</p>
          <p className="text-3xl font-bold text-chocolate-dark mt-1">{totalSupporters}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
          <p className="text-xs text-chocolate-dark/50 uppercase tracking-wide">Total Received</p>
          <p className="text-3xl font-bold text-chocolate-dark mt-1">${totalReceived.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
          <p className="text-xs text-chocolate-dark/50 uppercase tracking-wide">This Month</p>
          <p className="text-3xl font-bold text-chocolate-dark mt-1">${thisMonth.toFixed(2)}</p>
        </div>
      </div>

      {/* Supporters List */}
      <div className="bg-white rounded-2xl border border-chocolate/5">
        {mockSupporters.length > 0 ? (
          <div className="divide-y divide-espresso/5">
            {mockSupporters.map((supporter) => (
              <div key={supporter.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-glaze-pink/20 flex items-center justify-center text-glaze-pink font-semibold">
                  {supporter.avatar ? (
                    <img src={supporter.avatar} alt={supporter.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    supporter.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-chocolate-dark">{supporter.name}</p>
                  {supporter.message && (
                    <p className="text-sm text-chocolate-dark/60 truncate">{supporter.message}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-chocolate-dark">${supporter.amount.toFixed(2)}</p>
                  <p className="text-xs text-chocolate-dark/50">{supporter.currency}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glaze-pink/10 flex items-center justify-center">
              <HeartIcon className="w-8 h-8 text-glaze-pink" />
            </div>
            <h3 className="text-lg font-semibold text-chocolate-dark mb-2">No supporters yet</h3>
            <p className="text-chocolate-dark/60 max-w-sm mx-auto">
              When someone sends you a donut, they'll appear here. Share your page to start receiving support!
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

DashboardSupporters.displayName = 'DashboardSupporters';
