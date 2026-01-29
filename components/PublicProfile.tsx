import React, { useState, useCallback, memo, useMemo } from 'react';
import { 
  DonutLogoIcon, TwitterIcon, InstagramIcon, GlobeIcon, 
  MenuIcon, HeartIcon 
} from './visuals/Icons';
import type { UserProfile } from '../lib/userService';

interface PublicProfileProps {
  onLogoClick?: () => void;
  userProfile?: UserProfile | null;
}

// Memoized SocialButton component
const SocialButton = memo<{ icon: React.FC<{ className?: string }> }>(({ icon: Icon }) => (
  <a 
    href="#" 
    className="w-10 h-10 rounded-full bg-chocolate/5 flex items-center justify-center text-chocolate hover:bg-glaze-pink hover:text-white transition-all hover:-translate-y-1"
  >
    <Icon className="w-5 h-5" />
  </a>
));
SocialButton.displayName = 'SocialButton';

// Memoized SupporterItem component
const SupporterItem = memo<{
  name: string;
  action: string;
  message?: string;
  amount: number;
}>(({ name, action, message }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-full bg-cream flex-shrink-0 flex items-center justify-center border border-chocolate/5">
      <HeartIcon className="w-5 h-5 text-glaze-pink fill-current" />
    </div>
    <div className="flex-1">
      <div className="flex flex-wrap items-baseline gap-x-2 mb-1">
        <span className="font-fredoka font-bold text-chocolate-dark">{name}</span>
        <span className="text-chocolate/60 text-sm">{action}</span>
      </div>
      {message && (
        <div className="bg-cream-light p-3 rounded-xl border border-chocolate/5 text-chocolate-dark text-sm mb-2">
          {message}
        </div>
      )}
    </div>
  </div>
));
SupporterItem.displayName = 'SupporterItem';

// Memoized DonationPanel component
interface DonationPanelProps {
  amount: number;
  toggleAmount: (val: number) => void;
  customAmount: string;
  setCustomAmount: (val: string) => void;
  name: string;
  setName: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  creatorName: string;
}

const DonationPanel = memo<DonationPanelProps>(({ 
  amount, 
  toggleAmount, 
  customAmount, 
  setCustomAmount, 
  name, 
  setName, 
  message, 
  setMessage,
  creatorName 
}) => {
  const handleCustomAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    if (e.target.value) toggleAmount(0);
  }, [setCustomAmount, toggleAmount]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, [setName]);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }, [setMessage]);

  const totalAmount = (Number(customAmount) || amount) * 5;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-chocolate/5 p-6">
      <h2 className="font-fredoka text-xl font-bold text-chocolate-dark mb-4 flex items-center gap-2">
        Buy <span className="text-glaze-pink">{creatorName}</span> a Donut
      </h2>

      <div className="bg-[#FFF0F5] rounded-xl p-4 mb-4 border border-glaze-pink/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🍩</div>
          <span className="font-fredoka font-bold text-chocolate-dark">x</span>
          <div className="flex gap-2">
            {[1, 3, 5].map((val) => (
              <button
                key={val}
                onClick={() => toggleAmount(val)}
                className={`w-10 h-10 rounded-full font-fredoka font-bold text-sm transition-all ${
                  amount === val && !customAmount
                    ? 'bg-glaze-pink text-white shadow-glow-pink scale-110' 
                    : 'bg-white text-chocolate border border-chocolate/10 hover:border-glaze-pink'
                }`}
              >
                {val}
              </button>
            ))}
            <input 
              type="number" 
              placeholder="10"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className={`w-16 h-10 rounded-full px-3 font-fredoka font-bold text-sm text-center outline-none transition-all ${
                customAmount 
                  ? 'bg-white border-2 border-glaze-pink text-chocolate-dark'
                  : 'bg-white border border-chocolate/10 text-chocolate focus:border-glaze-pink'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <input 
          type="text" 
          placeholder="Name or @yoursocial (optional)"
          value={name}
          onChange={handleNameChange}
          className="w-full px-4 py-3 rounded-xl bg-cream-light border border-chocolate/10 focus:outline-none focus:border-glaze-pink focus:bg-white transition-all font-dm-sans placeholder:text-chocolate/30"
        />
        <textarea 
          placeholder="Say something nice..."
          value={message}
          onChange={handleMessageChange}
          className="w-full px-4 py-3 rounded-xl bg-cream-light border border-chocolate/10 focus:outline-none focus:border-glaze-pink focus:bg-white transition-all font-dm-sans placeholder:text-chocolate/30 min-h-[100px] resize-none"
        />
      </div>
      
      <button className="w-full py-4 rounded-full bg-gradient-to-br from-glaze-pink to-glaze-orange text-white font-fredoka font-bold text-lg shadow-glow-pink hover:-translate-y-0.5 hover:shadow-lg transition-all active:translate-y-0">
        Support ${totalAmount}
      </button>
    </div>
  );
});
DonationPanel.displayName = 'DonationPanel';

// Static supporters data
const SUPPORTERS_DATA = [
  { name: 'Alex Chen', action: 'bought 3 donuts', message: 'Thanks for the awesome tutorial on React! helped me a ton.', amount: 3 },
  { name: 'Sarah W.', action: 'bought 1 donut', amount: 1 },
  { name: 'Anon', action: 'bought 5 donuts', message: 'Keep building!', amount: 5 },
] as const;

export const PublicProfile: React.FC<PublicProfileProps> = memo(({ onLogoClick, userProfile }) => {
  const [amount, setAmount] = useState(3);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // Get display info from user profile
  const displayName = userProfile?.displayName || userProfile?.username || 'Creator';
  const username = userProfile?.username || 'creator';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=200`;

  const toggleAmount = useCallback((val: number) => {
    setAmount(val);
    setCustomAmount('');
  }, []);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onLogoClick?.();
  }, [onLogoClick]);

  // Memoize social buttons
  const socialButtons = useMemo(() => (
    <>
      <SocialButton icon={TwitterIcon} />
      <SocialButton icon={InstagramIcon} />
      <SocialButton icon={GlobeIcon} />
    </>
  ), []);

  // Memoize supporters list
  const supportersList = useMemo(() => (
    SUPPORTERS_DATA.map((supporter, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <div className="w-full h-px bg-chocolate/5" />}
        <SupporterItem {...supporter} />
      </React.Fragment>
    ))
  ), []);

  // Donation panel props
  const donationPanelProps = useMemo(() => ({
    amount,
    toggleAmount,
    customAmount,
    setCustomAmount,
    name,
    setName,
    message,
    setMessage,
    creatorName: displayName,
  }), [amount, toggleAmount, customAmount, name, message, displayName]);

  return (
    <div className="min-h-screen bg-cream font-dm-sans text-chocolate-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-chocolate/5 z-50 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <a 
            href="#" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 font-fredoka font-bold text-lg text-chocolate hover:scale-[1.02] transition-transform"
          >
            <div className="w-7 h-7">
              <DonutLogoIcon />
            </div>
            Donuts&nbsp;Me
          </a>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 ml-8">
            <a href="#" className="font-fredoka font-medium text-chocolate-dark border-b-2 border-glaze-pink pb-4 mt-4 text-sm">Home</a>
            <a href="#" className="font-fredoka font-medium text-chocolate/50 hover:text-chocolate hover:border-chocolate/20 border-b-2 border-transparent pb-4 mt-4 text-sm transition-all">Membership</a>
            <a href="#" className="font-fredoka font-medium text-chocolate/50 hover:text-chocolate hover:border-chocolate/20 border-b-2 border-transparent pb-4 mt-4 text-sm transition-all">Shop</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="md:hidden p-2 text-chocolate">
            <MenuIcon className="w-6 h-6" />
          </button>
          <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-cream hover:bg-chocolate/5 text-chocolate transition-colors font-bold pb-2 text-xl">
            ...
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-glaze-orange to-glaze-pink p-[2px]">
            <img 
              src="https://ui-avatars.com/api/?name=Visitor&background=random" 
              alt="User" 
              className="w-full h-full rounded-full border-2 border-white object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </header>

      {/* Hero Background */}
      <div className="pt-16">
        <div className="h-[240px] w-full bg-[#FFF0F5] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(#FF6B9D_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 -mt-12 sm:-mt-20 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
          
          {/* Left Column: Profile */}
          <div className="flex flex-col gap-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-soft border border-chocolate/5 p-6 sm:p-8 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-md bg-white -mt-20 mb-4 overflow-hidden">
                <img 
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              <div className="w-full">
                <h1 className="font-fredoka text-3xl font-bold text-chocolate-dark mb-1">{displayName}</h1>
                <p className="text-chocolate/60 text-base mb-6">donutsme.app/{username}</p>
                
                <div className="text-chocolate/80 leading-relaxed mb-8">
                  <p>Hey there! 👋 Welcome to my page. Your support helps me keep creating content for the community.</p>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-3">
                  {socialButtons}
                </div>
              </div>
            </div>

            {/* Mobile Donation Panel */}
            <div className="lg:hidden">
              <DonationPanel {...donationPanelProps} />
            </div>

            {/* Recent Supporters */}
            <div className="bg-white rounded-2xl shadow-soft border border-chocolate/5 p-6 sm:p-8">
              <h3 className="font-fredoka text-xl font-bold text-chocolate-dark mb-6">Recent supporters</h3>
              
              <div className="space-y-6">
                {supportersList}
              </div>
              
              <button className="w-full mt-6 py-3 rounded-xl border border-chocolate/10 font-fredoka font-semibold text-chocolate hover:bg-cream transition-colors">
                See more
              </button>
            </div>
          </div>

          {/* Right Column: Donation Panel (Desktop) */}
          <div className="hidden lg:block relative">
            <div className="sticky top-24">
              <DonationPanel {...donationPanelProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PublicProfile.displayName = 'PublicProfile';
