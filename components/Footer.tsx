import React, { memo, useMemo } from 'react';
import { DonutLogoIcon } from './visuals/Icons';
import { BitcoinIcon, EthereumIcon, SolanaIcon, BnbIcon } from './visuals/CryptoLogos';

// Static data hoisted outside component
const SOCIAL_LINKS = ['Twitter', 'Discord', 'Github', 'Email'] as const;
const PRODUCT_LINKS = ['How It Works', 'Features', 'Pricing', 'Integrations', 'API Docs'] as const;
const COMPANY_LINKS = ['About Us', 'Blog', 'Careers', 'Press Kit', 'Contact'] as const;
const FOOTER_LINKS = ['Privacy Policy', 'Terms of Service', 'Cookie Settings'] as const;

// Memoized SocialIcon component
const SocialIcon = memo<{ type: string }>(({ type }) => {
  switch(type) {
    case 'Twitter': 
      return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
    case 'Discord': 
      return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>;
    case 'Github': 
      return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>;
    default: 
      return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>;
  }
});
SocialIcon.displayName = 'SocialIcon';

// Memoized link components
const FooterLink = memo<{ item: string }>(({ item }) => (
  <li>
    <a href="#" className="group inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[0.95rem]">
      {item}
      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">→</span>
    </a>
  </li>
));
FooterLink.displayName = 'FooterLink';

// Static SVG wave (hoisted outside)
const WaveSvg = (
  <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full block fill-cream">
    <path d="M0,60 L0,20 Q120,0 240,20 T480,20 T720,20 T960,20 T1200,20 T1440,20 L1440,60 Z" />
  </svg>
);

// Static decorative donut (hoisted outside)
const DecorativeDonut = (
  <div className="absolute -bottom-20 -right-20 w-[200px] h-[200px] opacity-[0.03] pointer-events-none">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="white"/>
      <circle cx="50" cy="50" r="18" fill="#3E2723"/>
    </svg>
  </div>
);

// Static sprinkles (hoisted outside)
const Sprinkles = (
  <div className="absolute inset-0 pointer-events-none opacity-[0.15] overflow-hidden select-none">
    <div className="absolute w-1 h-3 rounded-full bg-glaze-pink top-[15%] left-[5%] -rotate-[30deg]" />
    <div className="absolute w-1 h-3 rounded-full bg-sprinkle-blue top-[25%] left-[15%] rotate-45" />
    <div className="absolute w-1 h-3 rounded-full bg-sprinkle-green top-[40%] left-[8%] rotate-[15deg]" />
    <div className="absolute w-1 h-3 rounded-full bg-glaze-yellow top-[60%] left-[12%] -rotate-[60deg]" />
    <div className="absolute w-1 h-3 rounded-full bg-sprinkle-purple top-[20%] right-[10%] rotate-[30deg]" />
    <div className="absolute w-1 h-3 rounded-full bg-glaze-orange top-[35%] right-[5%] -rotate-[45deg]" />
    <div className="absolute w-1 h-3 rounded-full bg-glaze-pink top-[55%] right-[15%] rotate-[60deg]" />
  </div>
);

export const Footer: React.FC = memo(() => {
  // Memoize social buttons
  const socialButtons = useMemo(() => (
    SOCIAL_LINKS.map((social) => (
      <a 
        key={social} 
        href="#" 
        className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-glaze-pink hover:border-glaze-pink hover:text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
      >
        <span className="sr-only">{social}</span>
        <SocialIcon type={social} />
      </a>
    ))
  ), []);

  // Memoize product links
  const productLinks = useMemo(() => (
    PRODUCT_LINKS.map(item => <FooterLink key={item} item={item} />)
  ), []);

  // Memoize company links
  const companyLinks = useMemo(() => (
    COMPANY_LINKS.map(item => <FooterLink key={item} item={item} />)
  ), []);

  return (
    <footer className="relative bg-chocolate-dark overflow-hidden pt-20 pb-8 px-8 text-white/90">
      {/* Wave SVG */}
      <div className="absolute top-0 left-0 right-0 h-[60px] overflow-hidden leading-none">
        {WaveSvg}
      </div>

      {Sprinkles}
      {DecorativeDonut}

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="flex flex-col items-start">
            <a href="#" className="flex items-center gap-2.5 font-fredoka font-bold text-[1.4rem] text-white hover:scale-[1.02] transition-transform mb-5">
              <div className="w-8 h-8">
                <DonutLogoIcon />
              </div>
              Donuts&nbsp;Me
            </a>
            <p className="text-[0.95rem] text-white/60 leading-relaxed mb-6">
              The sweetest way to support creators. One link, any chain, zero fees. Built for the long-form web.
            </p>
            <div className="flex gap-3 mb-6">
              {socialButtons}
            </div>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-xs text-white/50">Supported:</span>
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full overflow-hidden border border-chocolate-dark"><BitcoinIcon /></div>
                <div className="w-5 h-5 rounded-full overflow-hidden border border-chocolate-dark"><EthereumIcon /></div>
                <div className="w-5 h-5 rounded-full overflow-hidden border border-chocolate-dark"><SolanaIcon /></div>
                <div className="w-5 h-5 rounded-full overflow-hidden border border-chocolate-dark"><BnbIcon /></div>
              </div>
              <span className="text-xs text-white/50">+46 more</span>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-fredoka font-semibold text-sm text-white/40 uppercase tracking-widest mb-5">Product</h4>
            <ul className="space-y-3">
              {productLinks}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-fredoka font-semibold text-sm text-white/40 uppercase tracking-widest mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-fredoka font-semibold text-sm text-white/40 uppercase tracking-widest mb-5">Stay Sweet</h4>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
              <div className="font-fredoka font-semibold text-base text-white mb-2 flex items-center gap-2">
                <span>🍩</span> Get the Newsletter
              </div>
              <p className="text-sm text-white/50 mb-4">
                Creator tips, product updates, & the occasional donut pun.
              </p>
              <form className="flex flex-col gap-2">
                <input 
                  type="email" 
                  placeholder="you@email.com" 
                  className="w-full px-4 py-3 rounded-full border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-glaze-pink focus:bg-white/10 transition-colors"
                />
                <button 
                  type="submit"
                  className="w-full px-5 py-3 rounded-full bg-gradient-to-br from-glaze-pink to-glaze-orange text-white font-fredoka font-semibold text-sm hover:scale-[1.02] hover:shadow-glow-pink transition-all"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© 2025 Donuts Me. Made with 🍩 for creators worldwide.</p>
          <div className="flex gap-6">
            {FOOTER_LINKS.map(link => (
              <a key={link} href="#" className="hover:text-white/70 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
