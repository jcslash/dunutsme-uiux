import React, { useState, useCallback, memo } from 'react';
import { 
  ShareIcon, ChevronDownIcon, HeartIcon, CopyIcon
} from '../visuals/Icons';
import { BitcoinIcon } from '../visuals/CryptoLogos';
import { ShareModal } from './ShareModal';
import type { UserProfile } from '../../lib/userService';

interface DashboardHomeProps {
  userProfile?: UserProfile | null;
}

// Time range options
const TIME_RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'All time', value: 'all' },
];

// Memoized LegendItem component - cleaner design
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

export const DashboardHome: React.FC<DashboardHomeProps> = memo(({ userProfile }) => {
  const [autoConvertBTC, setAutoConvertBTC] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTimeRange, setShowTimeRange] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  const handleToggleBTC = useCallback(() => {
    setAutoConvertBTC(prev => !prev);
  }, []);

  // Get display info from user profile
  const displayName = userProfile?.displayName || userProfile?.username || 'User';
  const username = userProfile?.username || 'yourname';
  const pageUrl = `donutsme.app/${username}`;
  
  // Generate initials for avatar
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Copy link handler
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`https://${pageUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [pageUrl]);

  // Share modal handlers
  const handleOpenShareModal = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setShowShareModal(false);
  }, []);

  // Time range handlers
  const handleTimeRangeClick = useCallback(() => {
    setShowTimeRange(prev => !prev);
  }, []);

  const handleSelectTimeRange = useCallback((value: string) => {
    setSelectedTimeRange(value);
    setShowTimeRange(false);
  }, []);

  const selectedTimeRangeLabel = TIME_RANGES.find(t => t.value === selectedTimeRange)?.label || 'Last 30 days';

  return (
    <div className="space-y-6">
      {/* Share Modal */}
      <ShareModal 
        isOpen={showShareModal} 
        onClose={handleCloseShareModal} 
        username={username}
      />

      {/* User Card - Simplified */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-5">
          {/* Profile Info */}
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
                  {copied ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <CopyIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Share Button */}
          <button 
            onClick={handleOpenShareModal}
            className="bg-chocolate-dark text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-chocolate transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
            Share page
          </button>
        </div>
      </div>

      {/* Earnings Card - Cleaner */}
      <div className="bg-white rounded-2xl p-6 border border-chocolate/5">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-fredoka text-lg font-bold text-chocolate-dark">Earnings</h2>
          <div className="relative">
            <button 
              onClick={handleTimeRangeClick}
              className="flex items-center gap-1.5 text-xs font-medium text-chocolate/50 bg-cream/50 px-3 py-1.5 rounded-full hover:bg-cream transition-colors"
            >
              {selectedTimeRangeLabel}
              <ChevronDownIcon className={`w-3 h-3 transition-transform ${showTimeRange ? 'rotate-180' : ''}`} />
            </button>
            
            {showTimeRange && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-lg border border-chocolate/10 py-1 z-50">
                {TIME_RANGES.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => handleSelectTimeRange(range.value)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      selectedTimeRange === range.value
                        ? 'bg-glaze-pink/10 text-glaze-pink font-medium'
                        : 'text-chocolate/70 hover:bg-cream'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Amount */}
        <div className="mb-6">
          <span className="font-fredoka text-4xl font-bold text-chocolate-dark">$0</span>
          <span className="text-chocolate/40 ml-2 text-sm">.00</span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 mb-6">
          <LegendItem color="bg-glaze-orange" label="Supporters" value="$0" />
          <LegendItem color="bg-glaze-pink" label="Membership" value="$0" />
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-cream rounded-full w-full overflow-hidden" />

        {/* BTC Auto-Convert - Preserved */}
        <div className="mt-6 pt-6 border-t border-chocolate/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F7931A]/10 flex items-center justify-center flex-shrink-0">
                <BitcoinIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-chocolate-dark text-sm">Auto-convert to Bitcoin</h3>
                  <span className="bg-gradient-to-r from-glaze-pink to-glaze-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">New</span>
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

      {/* Empty State - Simplified */}
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
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
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
