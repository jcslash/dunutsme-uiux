import React from 'react';
import { FeatherIcon, ShieldCheckIcon, GlobeAltIcon, BoltIcon } from './visuals/Icons';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white relative scroll-mt-32">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div>
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
          <div className="relative">
             <div className="aspect-[4/5] rounded-[3rem] bg-cream border-4 border-white shadow-2xl overflow-hidden relative">
                {/* Decorative Elements mimicking a 'content defender' vibe but cute */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#D4B896_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
                
                <div className="absolute top-10 left-10 right-10 bottom-10 bg-white rounded-3xl p-6 shadow-soft flex flex-col">
                    {/* Simulated Blog Post UI */}
                    <div className="w-16 h-16 rounded-full bg-gray-100 mb-4 animate-pulse"></div>
                    <div className="h-6 w-3/4 bg-gray-100 rounded-full mb-4"></div>
                    <div className="h-4 w-full bg-gray-50 rounded-full mb-2"></div>
                    <div className="h-4 w-full bg-gray-50 rounded-full mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-50 rounded-full mb-8"></div>

                    {/* The "Donation" Pop up */}
                    <div className="mt-auto bg-cream-light border border-glaze-pink/20 rounded-xl p-4 flex items-center gap-4 animate-float-amount">
                        <div className="w-12 h-12 rounded-full bg-glaze-pink flex items-center justify-center text-2xl shadow-glow-pink">🍩</div>
                        <div>
                            <div className="font-fredoka font-bold text-chocolate-dark">Great read!</div>
                            <div className="text-xs text-chocolate/60">One supporter sent 5 Donuts</div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-sprinkle-blue/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-glaze-orange/20 rounded-full blur-xl"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem: React.FC<{icon: any, title: string, desc: string}> = ({ icon: Icon, title, desc }) => (
    <div className="flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-cream flex-shrink-0 flex items-center justify-center text-chocolate">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <h4 className="font-fredoka font-bold text-chocolate-dark text-lg mb-1">{title}</h4>
            <p className="font-dm-sans text-sm text-chocolate/60 leading-relaxed">{desc}</p>
        </div>
    </div>
);