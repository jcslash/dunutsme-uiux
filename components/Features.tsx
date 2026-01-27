import React from 'react';
import { FeatherIcon, ShieldCheckIcon, GlobeAltIcon, BoltIcon } from './visuals/Icons';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white relative scroll-mt-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1">
             <div className="inline-flex items-center gap-2 bg-dough-warm/40 px-4 py-2 rounded-full mb-6">
                <span className="text-xl">🛡️</span>
                <span className="font-fredoka text-sm font-semibold text-chocolate">Defending Deep Thought</span>
             </div>
             <h2 className="font-fredoka text-4xl sm:text-5xl font-bold text-chocolate-dark mb-6 leading-[1.2]">
                Human creativity <br/>
                <span className="bg-gradient-to-r from-glaze-pink to-sprinkle-purple bg-clip-text text-transparent">deserves better</span>
             </h2>
             <p className="font-dm-sans text-lg text-chocolate/70 mb-8 leading-relaxed">
                We are building for the writers, the thinkers, and the storytellers who refuse to surrender to AI slop and 15-second dopamine hits. 
                <br/><br/>
                Your work takes time, depth, and soul. Your support system should be just as robust, but wrapped in something sweet.
             </p>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
                <FeatureItem 
                   icon={ShieldCheckIcon}
                   title="Anti-Slop Shield"
                   desc="A community validating high-effort, human-generated content."
                />
                 <FeatureItem 
                   icon={BoltIcon}
                   title="Zero Friction"
                   desc="No sign-up required for supporters. They connect, they donate, you earn."
                />
                 <FeatureItem 
                   icon={FeatherIcon}
                   title="For Long-Form"
                   desc="Designed for blogs, newsletters, and essays where deep connection happens."
                />
                 <FeatureItem 
                   icon={GlobeAltIcon}
                   title="Censorship Resistant"
                   desc="You own your page and your funds. Powered by decentralized tech."
                />
             </div>
          </div>

          {/* Visual Side */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
             <div className="w-full max-w-[400px] rounded-[2.5rem] bg-cream border-[6px] border-white shadow-2xl overflow-hidden relative transform hover:scale-[1.01] transition-transform duration-500">
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#D4B896_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-30"></div>
                
                {/* The "Post" Card Container */}
                <div className="relative p-6">
                    <div className="bg-white rounded-2xl p-5 shadow-soft border border-chocolate/5 relative overflow-hidden">
                        
                        {/* 1. Creator Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-chocolate/10 bg-chocolate-dark">
                                {/* Using a placeholder that looks like a clean avatar */}
                                <img src="https://ui-avatars.com/api/?name=Dan+Koe&background=2D1810&color=fff&font-size=0.4" alt="Creator" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-fredoka font-bold text-chocolate-dark text-base">DAN KOE</span>
                                    <div className="w-4 h-4 rounded-full bg-green-badge flex items-center justify-center text-[10px] text-white shadow-sm">✓</div>
                                </div>
                                <span className="text-xs text-chocolate/40 font-dm-sans font-medium tracking-wide">@thedankoe</span>
                            </div>
                            <button className="ml-auto bg-chocolate-dark text-white text-[11px] font-bold px-4 py-2 rounded-full hover:bg-chocolate transition-all hover:shadow-md">
                                Subscribe
                            </button>
                        </div>

                        {/* 2. Article Content - The Nano Banana Pro Style */}
                        <div className="space-y-4">
                            {/* 
                                THE VISUAL TRICK:
                                1. bg-[#F5E6D3] sets the 'paper' color.
                                2. mix-blend-multiply drops the white from the image, keeping the black lines.
                                3. grayscale + contrast creates the 'ink' look.
                            */}
                            <div className="w-full h-44 rounded-xl overflow-hidden bg-[#F5E6D3] relative group border border-chocolate/10 shadow-inner">
                                <img 
                                    src="https://images.unsplash.com/photo-1627916607164-7b5267b5b888?q=80&w=800&auto=format&fit=crop" 
                                    alt="Falling astronaut stylized" 
                                    className="w-full h-full object-cover mix-blend-multiply grayscale contrast-125 brightness-110 group-hover:scale-105 transition-transform duration-1000" 
                                />
                                {/* Texture Overlay for extra 'paper' feel */}
                                <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none mix-blend-overlay"></div>
                            </div>

                            <div>
                                <h3 className="font-fredoka text-2xl font-bold text-chocolate-dark leading-[1.1] mb-2">
                                    How to fix your entire life in 1 day
                                </h3>

                                <div className="flex items-center gap-5 text-chocolate/30 text-xs py-2 border-b border-chocolate/5 font-bold tracking-wide">
                                    <span className="flex items-center gap-1.5 hover:text-chocolate/60 transition-colors cursor-pointer">
                                        <span className="text-sm">💬</span> 8.1K
                                    </span>
                                    <span className="flex items-center gap-1.5 hover:text-chocolate/60 transition-colors cursor-pointer">
                                        <span className="text-sm">⚡</span> 55K
                                    </span>
                                    <span className="flex items-center gap-1.5 text-glaze-pink cursor-pointer">
                                        <span className="text-sm">❤️</span> 283K
                                    </span>
                                    <span className="ml-auto flex items-center gap-1.5 text-chocolate/40">
                                        <span className="text-sm">📊</span> 173M
                                    </span>
                                </div>
                            </div>

                            <div className="font-dm-sans text-chocolate/80 text-[13px] leading-relaxed space-y-3">
                                <p>If you're anything like me, you think new years resolutions are stupid.</p>
                                <div className="h-2 w-2/3 bg-chocolate/5 rounded-full"></div>
                                <div className="h-2 w-1/2 bg-chocolate/5 rounded-full"></div>
                            </div>
                        </div>

                        {/* 3. Reward Notification Overlay */}
                        <div className="absolute bottom-6 right-6 z-20 animate-float-amount">
                             <div className="bg-white/95 backdrop-blur-md border border-glaze-pink/20 rounded-2xl p-4 shadow-glow-pink flex flex-col gap-2.5 max-w-[180px]">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-gradient-to-br from-glaze-pink to-[#FF5A8A] rounded-full flex items-center justify-center text-xl text-white shadow-lg shadow-glaze-pink/30">
                                         🍩
                                     </div>
                                     <div>
                                         <div className="font-fredoka font-bold text-glaze-pink text-xl leading-none">+50</div>
                                         <div className="text-[9px] text-chocolate/40 font-bold uppercase tracking-widest mt-0.5">Donuts</div>
                                     </div>
                                 </div>
                                 <div className="bg-cream-light p-2.5 rounded-xl border border-chocolate/5">
                                     <p className="text-[11px] text-chocolate leading-snug">
                                        <span className="font-bold">@alex:</span> "This article hit hard. Exactly what I needed."
                                     </p>
                                 </div>
                             </div>
                        </div>

                    </div>
                </div>

                {/* Decor Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-sprinkle-purple/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-8 -left-8 w-32 h-32 bg-glaze-orange/15 rounded-full blur-2xl"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem: React.FC<{icon: any, title: string, desc: string}> = ({ icon: Icon, title, desc }) => (
    <div className="flex gap-4 group">
        <div className="w-12 h-12 rounded-2xl bg-cream flex-shrink-0 flex items-center justify-center text-chocolate border border-chocolate/5 group-hover:scale-110 group-hover:bg-white group-hover:shadow-soft transition-all duration-300">
            <Icon className="w-6 h-6 group-hover:text-glaze-pink transition-colors" />
        </div>
        <div>
            <h4 className="font-fredoka font-bold text-chocolate-dark text-xl mb-1.5">{title}</h4>
            <p className="font-dm-sans text-[15px] text-chocolate/60 leading-relaxed">{desc}</p>
        </div>
    </div>
);