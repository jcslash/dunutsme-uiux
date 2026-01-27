import React, { useState } from 'react';
import { 
    ShareIcon, ChevronDownIcon, HeartIcon, StarIcon, 
    GiftIcon, FileTextIcon
} from '../visuals/Icons';
import { BitcoinIcon } from '../visuals/CryptoLogos';

export const DashboardHome: React.FC = () => {
  const [autoConvertBTC, setAutoConvertBTC] = useState(false);

  return (
    <div className="space-y-8">
      {/* 1. User Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-chocolate/5 flex flex-col sm:flex-row items-center sm:justify-between gap-6 text-center sm:text-left relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-glaze-pink to-glaze-orange"></div>
        <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] p-1 shadow-md">
                <img src="https://ui-avatars.com/api/?name=CJ+Chiu&background=random&size=128" alt="Profile" className="w-full h-full rounded-full border-4 border-white" />
            </div>
            <div>
                <h1 className="font-fredoka text-2xl font-bold text-chocolate-dark mb-1">Hi, CJ 邱垂金</h1>
                <a href="#" className="text-chocolate/50 hover:text-glaze-pink transition-colors font-medium text-sm flex items-center justify-center sm:justify-start gap-1">
                    donutsme.app/cjchiu
                </a>
            </div>
        </div>
        <button className="bg-chocolate-dark text-white px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-chocolate hover:shadow-lg transition-all active:scale-95">
            <ShareIcon className="w-4 h-4" />
            Share page
        </button>
      </div>

      {/* 2. Earnings Section */}
      <div className="flex flex-col gap-6">
        
        {/* Earnings Card (Full Width) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-chocolate/5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-fredoka text-xl font-bold text-chocolate-dark">Earnings</h2>
                <button className="flex items-center gap-1.5 text-xs font-bold text-chocolate/50 bg-cream px-3 py-1.5 rounded-full hover:bg-chocolate/5 transition-colors">
                    Last 30 days
                    <ChevronDownIcon className="w-3 h-3" />
                </button>
            </div>
            
            <div className="mb-8">
                <span className="font-fredoka text-5xl font-bold text-chocolate-dark tracking-tight">$0</span>
            </div>

            <div className="flex flex-wrap gap-6 mb-6">
                 <LegendItem color="bg-[#FFD700]" label="Supporters" value="$0" />
                 <LegendItem color="bg-glaze-pink" label="Membership" value="$0" />
            </div>

            {/* Visual Bar - Empty State */}
            <div className="h-4 bg-cream-light rounded-full w-full overflow-hidden border border-chocolate/5 mb-auto"></div>

            {/* Auto-Convert to BTC Toggle */}
            <div className="mt-8 pt-6 border-t border-chocolate/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F7931A]/10 flex items-center justify-center flex-shrink-0">
                        <BitcoinIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                             <h3 className="font-fredoka font-bold text-chocolate-dark text-sm">Auto-convert to Bitcoin</h3>
                             <span className="bg-gradient-to-r from-glaze-pink to-glaze-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">New</span>
                        </div>
                        <p className="text-xs text-chocolate/50 font-medium mt-0.5">Automatically swap all incoming earnings to BTC.</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => setAutoConvertBTC(!autoConvertBTC)}
                    className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-glaze-orange ${
                        autoConvertBTC ? 'bg-green-badge' : 'bg-chocolate/10'
                    }`}
                    role="switch"
                    aria-checked={autoConvertBTC}
                >
                    <span 
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                            autoConvertBTC ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
        </div>
      </div>

      {/* 3. More ways to earn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={StarIcon} 
            iconColor="text-glaze-pink"
            title="Membership" 
            desc="Build recurring income by offering exclusive perks."
            action="View"
          />
          <FeatureCard 
            icon={GiftIcon} 
            iconColor="text-sprinkle-blue"
            title="Gift" 
            desc="Gift digital goods directly to fans."
            action="Enable"
          />
          <FeatureCard 
            icon={FileTextIcon} 
            iconColor="text-glaze-orange"
            title="Exclusive posts" 
            desc="Publish content only for your supporters."
            action="Write a post"
          />
      </div>

      {/* 4. Supporters Empty State - Improved PR */}
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-chocolate/5 text-center flex flex-col items-center">
         <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-chocolate/20 mb-4 animate-float-donut">
             <HeartIcon className="w-8 h-8 fill-current text-glaze-pink" />
         </div>
         <h3 className="font-fredoka text-xl font-bold text-chocolate-dark mb-2">Your page is ready for the world</h3>
         <p className="text-chocolate/50 max-w-sm mb-6">
             You're all set to start accepting support. Share your link with your community to kick things off.
         </p>
         <button className="bg-chocolate-dark text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-lg shadow-chocolate/20 hover:scale-105 transition-transform">
             Share your page
         </button>
      </div>
    </div>
  );
};

const LegendItem: React.FC<{color: string, label: string, value: string}> = ({ color, label, value }) => (
    <div className="flex items-center gap-2">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <div className="flex flex-col">
             <span className="text-xs text-chocolate/40 font-bold uppercase tracking-wide">{label}</span>
             <span className="text-sm font-bold text-chocolate-dark">{value}</span>
        </div>
    </div>
);

const FeatureCard: React.FC<{icon: any, iconColor: string, title: string, desc: string, action: string}> = ({ icon: Icon, iconColor, title, desc, action }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-chocolate/5 hover:border-glaze-pink/30 transition-colors group">
        <div className={`w-10 h-10 rounded-xl bg-cream flex items-center justify-center mb-4 ${iconColor} group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-fredoka text-lg font-bold text-chocolate-dark mb-2">{title}</h3>
        <p className="text-sm text-chocolate/60 leading-relaxed mb-6 min-h-[40px]">{desc}</p>
        <button className="text-sm font-bold text-chocolate-dark group-hover:text-glaze-pink transition-colors flex items-center gap-1">
            {action} →
        </button>
    </div>
);