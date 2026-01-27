import React from 'react';

export const DonutVisual: React.FC = () => {
  return (
    <div className="relative w-[350px] h-[350px] sm:w-[420px] sm:h-[420px]" aria-hidden="true">
        {/* Orbits */}
        <div className="absolute inset-0 border border-chocolate/10 rounded-full w-full h-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-chocolate/10 rounded-full w-[75%] h-[75%]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-chocolate/10 rounded-full w-[50%] h-[50%]"></div>
        
        {/* Orbit Dots */}
        <div className="absolute top-[15%] left-[10%] w-2 h-2 bg-sprinkle-blue rounded-full opacity-60"></div>
        <div className="absolute top-[8%] right-[25%] w-2.5 h-2.5 bg-chocolate/15 rounded-full opacity-60"></div>
        <div className="absolute bottom-[20%] left-[5%] w-1.5 h-1.5 bg-chocolate/10 rounded-full opacity-60"></div>
        <div className="absolute bottom-[35%] right-0 w-2 h-2 bg-sprinkle-green rounded-full opacity-60"></div>
        <div className="absolute top-[45%] -right-[5%] w-1.5 h-1.5 bg-sprinkle-purple rounded-full opacity-40"></div>

        {/* The Floating Donut */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] animate-float-donut">
             {/* Donut Body */}
            <div className="w-full h-full rounded-full absolute bg-gradient-to-br from-[#D4B896] via-[#C4A882] to-[#B89B72]" 
                 style={{
                     boxShadow: 'inset 0 -15px 30px rgba(139, 90, 43, 0.25), 0 20px 50px rgba(93, 64, 55, 0.2)'
                 }}
            ></div>
            
            {/* Glaze */}
            <div className="w-[88%] h-[88%] rounded-full absolute top-[6%] left-[6%] bg-gradient-to-br from-[#FF8FB1] via-glaze-pink to-[#FF5A8A]"
                 style={{
                     boxShadow: 'inset 0 -8px 20px rgba(200, 50, 100, 0.2)'
                 }}
            >
                {/* Sprinkles */}
                <div className="absolute w-1.5 h-3.5 rounded-sm bg-sprinkle-blue top-[25%] left-[25%] -rotate-[30deg]"></div>
                <div className="absolute w-1.5 h-3.5 rounded-sm bg-sprinkle-green top-[20%] right-[30%] rotate-45"></div>
                <div className="absolute w-1.5 h-3.5 rounded-sm bg-glaze-yellow bottom-[35%] left-[20%] rotate-[15deg]"></div>
                <div className="absolute w-1.5 h-3.5 rounded-sm bg-sprinkle-purple bottom-[25%] right-[25%] -rotate-[60deg]"></div>
                <div className="absolute w-1.5 h-3.5 rounded-sm bg-glaze-orange top-[40%] left-[15%] rotate-[75deg]"></div>
                <div className="absolute w-1.5 h-3.5 rounded-sm bg-sprinkle-blue bottom-[40%] right-[18%] -rotate-[15deg]"></div>
            </div>

            {/* Donut Hole */}
            <div className="w-[32%] h-[32%] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-cream to-[#F5EDE5]"
                 style={{
                    boxShadow: 'inset 0 4px 15px rgba(93, 64, 55, 0.15)'
                 }}
            ></div>
        </div>

        {/* Notification Card */}
        <div className="absolute top-[5%] -right-[5%] sm:-right-[5%] bg-white rounded-xl p-3 sm:p-4 shadow-soft flex items-center gap-3 animate-float-notification">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5DEB3] to-glaze-pink flex items-center justify-center text-sm flex-shrink-0">
                🍩
            </div>
            <div className="flex flex-col">
                <span className="font-fredoka font-semibold text-xs sm:text-sm text-chocolate-dark">New Donut!</span>
                <span className="text-[10px] sm:text-xs text-chocolate/70">0xab3…f29 sent 0.01&nbsp;ETH</span>
            </div>
        </div>

        {/* Amount Badge */}
        <div className="absolute bottom-[25%] -left-[10%] bg-gradient-to-br from-sprinkle-green to-[#2DD4A5] text-white px-5 py-2.5 rounded-full font-fredoka font-semibold text-sm shadow-glow-green animate-float-amount">
            +$24.50 today
        </div>
    </div>
  );
};