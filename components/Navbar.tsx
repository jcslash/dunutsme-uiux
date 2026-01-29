import React, { useState, useEffect, useCallback, memo } from 'react';
import { DonutLogoIcon } from './visuals/Icons';

interface NavbarProps {
  onOpenLogin: () => void;
}

// Memoized navigation link component
const NavLink = memo<{ href: string; onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void; children: React.ReactNode }>(
  ({ href, onClick, children }) => (
    <a 
      href={href} 
      onClick={onClick}
      className="font-dm-sans font-medium text-chocolate hover:text-glaze-pink transition-colors text-[0.95rem]"
    >
      {children}
    </a>
  )
);
NavLink.displayName = 'NavLink';

// Mobile menu icon as static JSX (hoisted outside component)
const MobileMenuIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = memo(({ onOpenLogin }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Use passive event listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized scroll handler
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

  const handleFeaturesClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    scrollToSection(e, 'features');
  }, [scrollToSection]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 px-8 py-4 flex justify-between items-center transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-cream-light/90 backdrop-blur-md border-chocolate/5 shadow-sm' 
          : 'bg-transparent border-transparent'
      }`}
      role="navigation" 
      aria-label="Main navigation"
    >
      <a href="#" className="flex items-center gap-2 font-fredoka font-bold text-2xl text-chocolate hover:scale-[1.02] transition-transform">
        <div className="w-9 h-9">
          <DonutLogoIcon />
        </div>
        Donuts&nbsp;Me
      </a>
      
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="#how-it-works" onClick={handleHowItWorksClick}>
          How It Works
        </NavLink>
        <NavLink href="#features" onClick={handleFeaturesClick}>
          Features
        </NavLink>
        <button 
          onClick={onOpenLogin}
          className="inline-flex items-center justify-center font-fredoka font-semibold text-base text-white bg-gradient-to-br from-glaze-pink to-glaze-orange px-7 py-3 rounded-full shadow-glow-pink hover:-translate-y-0.5 hover:shadow-lg transition-all active:translate-y-0"
        >
          Create Your Page
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <button className="md:hidden text-chocolate p-2" onClick={onOpenLogin}>
        {MobileMenuIcon}
      </button>
    </nav>
  );
});

Navbar.displayName = 'Navbar';
