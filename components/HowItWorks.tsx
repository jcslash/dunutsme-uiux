import React, { memo, useMemo } from 'react';
import { WalletIcon, LinkIcon, DonutIcon } from './visuals/Icons';

// Step data hoisted outside component for referential stability
interface StepData {
  number: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  title: string;
  desc: string;
}

const STEPS_DATA: readonly StepData[] = [
  {
    number: '1',
    icon: WalletIcon,
    color: 'bg-sprinkle-blue',
    title: 'Set up your Stand',
    desc: 'Connect your wallet or create a new one instantly with email. Customize your page to match your vibe.',
  },
  {
    number: '2',
    icon: LinkIcon,
    color: 'bg-glaze-pink',
    title: 'Share the Sweetness',
    desc: 'Add your unique Donuts Me link to your bio, newsletter footer, or the end of your long-form articles.',
  },
  {
    number: '3',
    icon: DonutIcon,
    color: 'bg-sprinkle-green',
    title: 'Collect Dough',
    desc: 'Fans treat you to donuts (crypto). You get paid instantly, directly to your wallet. No platform hold periods.',
  },
] as const;

// Memoized StepCard component
const StepCard = memo<StepData>(({ number, icon: Icon, color, title, desc }) => (
  <div className="flex flex-col items-center text-center group">
    <div className="relative mb-8">
      <div className={`w-20 h-20 rounded-3xl rotate-3 ${color} flex items-center justify-center text-white shadow-soft group-hover:-rotate-3 group-hover:scale-105 transition-all duration-300`}>
        <Icon className="w-9 h-9" />
      </div>
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-chocolate/5 flex items-center justify-center font-fredoka font-bold text-chocolate-dark shadow-sm">
        {number}
      </div>
    </div>
    <h3 className="font-fredoka text-2xl font-bold text-chocolate-dark mb-4">{title}</h3>
    <p className="font-dm-sans text-chocolate/70 leading-relaxed">{desc}</p>
  </div>
));
StepCard.displayName = 'StepCard';

// Static SVG wave path (hoisted outside component)
const WaveSvg = (
  <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full block fill-cream-light">
    <path d="M0,60 L0,20 Q120,0 240,20 T480,20 T720,20 T960,20 T1200,20 T1440,20 L1440,60 Z" />
  </svg>
);

export const HowItWorks: React.FC = memo(() => {
  // Memoize step cards
  const stepCards = useMemo(() => (
    STEPS_DATA.map((step) => (
      <StepCard key={step.number} {...step} />
    ))
  ), []);

  return (
    <section id="how-it-works" className="relative py-24 bg-cream overflow-hidden scroll-mt-32">
      {/* Wave Separator Top */}
      <div className="absolute top-0 left-0 right-0 h-[60px] overflow-hidden leading-none rotate-180">
        {WaveSvg}
      </div>

      <div className="max-w-[1100px] mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="font-fredoka font-semibold text-glaze-pink tracking-widest uppercase text-sm mb-3 block">Simple & Sweet</span>
          <h2 className="font-fredoka text-4xl sm:text-5xl font-bold text-chocolate-dark mb-6">
            Start accepting <span className="text-glaze-orange">Donuts</span> in minutes
          </h2>
          <p className="font-dm-sans text-lg text-chocolate/60 max-w-2xl mx-auto">
            No complex exchanges or tech wizardry needed. If you can copy a link, you can earn crypto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {stepCards}
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = 'HowItWorks';
