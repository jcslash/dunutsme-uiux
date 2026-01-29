import React, { useCallback, memo, useMemo } from 'react';
import { DonutVisual } from './visuals/DonutVisual';
import { BitcoinIcon, EthereumIcon, SolanaIcon, TetherIcon, BnbIcon, DogeIcon } from './visuals/CryptoLogos';

interface HeroProps {
  onOpenLogin: () => void;
}

// Memoized crypto icon component
const CryptoIconWrapper = memo<{ Icon: React.FC<{ className?: string }>; index: number }>(
  ({ Icon, index }) => (
    <div 
      className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-soft hover:-translate-y-1 hover:shadow-md transition-all duration-200 overflow-hidden flex-shrink-0 p-2"
      role="listitem"
    >
      <Icon className="w-full h-full" />
    </div>
  )
);
CryptoIconWrapper.displayName = 'CryptoIconWrapper';

// Static crypto icons array (hoisted outside component)
const CRYPTO_ICONS = [BitcoinIcon, EthereumIcon, SolanaIcon, TetherIcon, BnbIcon, DogeIcon] as const;

export const Hero: React.FC<HeroProps> = memo(({ onOpenLogin }) => {
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleHowItWorksClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    scrollToSection(e, 'how-it-works');
  }, [scrollToSection]);

  // Memoize crypto icons list
  const cryptoIconsList = useMemo(() => (
    CRYPTO_ICONS.map((Icon, idx) => (
      <CryptoIconWrapper key={idx} Icon={Icon} index={idx} />
    ))
  ), []);

  return (
    <section 
      className="min-h-screen flex items-center pt-28 pb-16 px-6 relative overflow-hidden bg-gradient-to-b from-cream-light to-cream"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left Content */}
        <div className="animate-fade-in-up order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-glaze-pink/10 border border-glaze-pink/20 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-badge rounded-full animate-pulse-dot flex-shrink-0" />
            <span className="font-fredoka text-sm font-semibold text-glaze-pink">Crypto-Native Creator Support</span>
          </div>
          
          <h1 id="hero-heading" className="font-fredoka text-4xl sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.1] text-chocolate-dark mb-6 tracking-tight">
            Turn any crypto into<br />
            <span className="bg-gradient-to-br from-glaze-orange to-glaze-pink bg-clip-text text-transparent">sweet support</span>
          </h1>
          
          <p className="font-dm-sans text-lg text-chocolate/75 mb-8 max-w-[480px] leading-relaxed">
            One link. Any chain. Zero fees. Let your audience tip you in BTC, ETH, SOL, or 50+ tokens—as easy as buying someone a donut.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12 justify-center lg:justify-start">
            <button 
              onClick={onOpenLogin}
              className="inline-flex items-center justify-center font-fredoka font-semibold text-base text-white bg-gradient-to-br from-glaze-pink to-glaze-orange px-7 py-3.5 rounded-full shadow-glow-pink hover:-translate-y-0.5 hover:shadow-lg transition-all active:translate-y-0 min-w-[160px]"
            >
              Create Your Page
            </button>
            <a 
              href="#how-it-works" 
              onClick={handleHowItWorksClick}
              className="inline-flex items-center justify-center font-fredoka font-semibold text-base text-chocolate-dark bg-white border-[1.5px] border-chocolate/15 px-7 py-3.5 rounded-full hover:border-chocolate hover:shadow-soft transition-all min-w-[160px]"
            >
              See How It Works
            </a>
          </div>
          
          <div className="flex gap-3 items-center" role="list" aria-label="Supported cryptocurrencies">
            {cryptoIconsList}
          </div>
        </div>

        {/* Right Visual */}
        <div className="order-1 lg:order-2 flex justify-center items-center min-h-[400px] lg:min-h-[500px] animate-fade-in-up delay-200">
          <DonutVisual />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
