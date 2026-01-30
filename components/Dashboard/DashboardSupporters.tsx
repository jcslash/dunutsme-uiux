import React, { memo, useMemo } from 'react';
import { HeartIcon } from '../visuals/Icons';
import type { UserProfile } from '../../lib/userService';

interface DashboardSupportersProps {
  userProfile: UserProfile | null;
}

interface Supporter {
  id: string;
  name: string;
  amount: number;
  currency: string;
  message: string;
  date: string;
  avatar?: string;
}

// Mock supporters data (empty for now) - hoisted as constant (Rule 5.4)
const MOCK_SUPPORTERS: ReadonlyArray<Supporter> = [];

// Static JSX hoisted outside component (Rule 6.3: Hoist Static JSX Elements)
const EmptyStateContent = (
  <div className="p-12 text-center">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glaze-pink/10 flex items-center justify-center">
      <HeartIcon className="w-8 h-8 text-glaze-pink" />
    </div>
    <h3 className="text-lg font-semibold text-chocolate-dark mb-2">No supporters yet</h3>
    <p className="text-chocolate-dark/60 max-w-sm mx-auto">
      When someone sends you a donut, they'll appear here. Share your page to start receiving support!
    </p>
  </div>
);

// Memoized StatCard component (Rule 5.5: Extract to Memoized Components)
const StatCard = memo<{ label: string; value: string }>(({ label, value }) => (
  <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
    <p className="text-xs text-chocolate-dark/50 uppercase tracking-wide">{label}</p>
    <p className="text-3xl font-bold text-chocolate-dark mt-1">{value}</p>
  </div>
));
StatCard.displayName = 'StatCard';

// Memoized SupporterRow component (Rule 5.5)
const SupporterRow = memo<{ supporter: Supporter }>(({ supporter }) => {
  // Derive initial during render (Rule 5.1)
  const initial = supporter.name.charAt(0).toUpperCase();
  
  return (
    <div className="p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-glaze-pink/20 flex items-center justify-center text-glaze-pink font-semibold">
        {supporter.avatar ? (
          <img src={supporter.avatar} alt={supporter.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          initial
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-chocolate-dark">{supporter.name}</p>
        {supporter.message ? (
          <p className="text-sm text-chocolate-dark/60 truncate">{supporter.message}</p>
        ) : null}
      </div>
      <div className="text-right">
        <p className="font-semibold text-chocolate-dark">${supporter.amount.toFixed(2)}</p>
        <p className="text-xs text-chocolate-dark/50">{supporter.currency}</p>
      </div>
    </div>
  );
});
SupporterRow.displayName = 'SupporterRow';

export const DashboardSupporters: React.FC<DashboardSupportersProps> = memo(({ userProfile }) => {
  // Combine multiple array iterations into single pass (Rule 7.6: Combine Multiple Array Iterations)
  const stats = useMemo(() => {
    // Early return for empty array (Rule 7.7: Early Length Check for Array Comparisons)
    if (MOCK_SUPPORTERS.length === 0) {
      return {
        totalSupporters: 0,
        totalReceived: 0,
        thisMonth: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Single pass through array (Rule 7.6)
    let totalReceived = 0;
    let thisMonth = 0;

    for (let i = 0; i < MOCK_SUPPORTERS.length; i++) {
      const supporter = MOCK_SUPPORTERS[i];
      totalReceived += supporter.amount;
      
      const date = new Date(supporter.date);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        thisMonth += supporter.amount;
      }
    }

    return {
      totalSupporters: MOCK_SUPPORTERS.length,
      totalReceived,
      thisMonth,
    };
  }, []);

  // Derive formatted values during render (Rule 5.1)
  const totalReceivedFormatted = `$${stats.totalReceived.toFixed(2)}`;
  const thisMonthFormatted = `$${stats.thisMonth.toFixed(2)}`;
  const hasSupporters = MOCK_SUPPORTERS.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-chocolate-dark">Supporters</h1>
        <p className="text-chocolate-dark/60 mt-1">People who have supported you with donuts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Supporters" value={String(stats.totalSupporters)} />
        <StatCard label="Total Received" value={totalReceivedFormatted} />
        <StatCard label="This Month" value={thisMonthFormatted} />
      </div>

      {/* Supporters List - explicit conditional rendering (Rule 6.8) */}
      <div className="bg-white rounded-2xl border border-chocolate/5">
        {hasSupporters ? (
          <div className="divide-y divide-espresso/5">
            {MOCK_SUPPORTERS.map((supporter) => (
              <SupporterRow key={supporter.id} supporter={supporter} />
            ))}
          </div>
        ) : (
          EmptyStateContent
        )}
      </div>
    </div>
  );
});

DashboardSupporters.displayName = 'DashboardSupporters';
