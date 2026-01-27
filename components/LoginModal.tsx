import React, { useState, useEffect } from 'react';
import { GoogleIcon, AppleIcon, MailIcon, UserCircleIcon, CloseIcon, PrivyLogoIcon } from './visuals/Icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation logic
    onClose();
    // Simulate a small delay for API check then success
    setTimeout(() => {
        onLoginSuccess();
    }, 500);
  };

  const handleSocialLogin = () => {
      onClose();
      setTimeout(() => {
          onLoginSuccess();
      }, 500);
  }

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-[380px] bg-white rounded-[28px] shadow-2xl p-6 transition-all duration-300 transform ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-[#6B7280] font-dm-sans text-sm font-medium">Login or sign up</span>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB] transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Brand */}
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
                {/* Simulated Privy Logo */}
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-[30%] w-[60%] h-[30%] bg-white/20 rounded-full"></div>
                </div>
                <span className="font-fredoka text-4xl font-semibold tracking-tight">privy</span>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Email Input */}
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <MailIcon className="w-5 h-5" />
                </div>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full h-[52px] pl-12 pr-20 rounded-[16px] border border-[#E5E7EB] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#74B9FF] focus:ring-2 focus:ring-[#74B9FF]/20 transition-all font-dm-sans"
                    required
                />
                <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm font-medium text-[#4F46E5] hover:bg-[#4F46E5]/5 rounded-lg transition-colors"
                >
                    Submit
                </button>
            </div>

            {/* Google Button */}
            <button type="button" onClick={handleSocialLogin} className="flex items-center justify-between w-full h-[52px] px-4 rounded-[16px] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all group">
                <div className="flex items-center gap-3">
                    <GoogleIcon className="w-5 h-5" />
                    <span className="font-dm-sans font-medium text-gray-700">Google</span>
                </div>
                <span className="text-[10px] font-bold text-[#4B5563] bg-[#F3F4F6] px-1.5 py-0.5 rounded text-center uppercase tracking-wider">Recent</span>
            </button>

            {/* Apple Button */}
            <button type="button" onClick={handleSocialLogin} className="flex items-center gap-3 w-full h-[52px] px-4 rounded-[16px] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all">
                <AppleIcon className="w-5 h-5" />
                <span className="font-dm-sans font-medium text-gray-700">Apple</span>
            </button>

            {/* More Options */}
            <button type="button" onClick={handleSocialLogin} className="flex items-center justify-between w-full h-[52px] px-4 rounded-[16px] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all group">
                 <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-5 h-5 text-gray-700" />
                    <span className="font-dm-sans font-medium text-gray-700">More options</span>
                 </div>
                 <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                 </span>
            </button>
        </form>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium">
            <span>Protected by</span>
            <div className="flex items-center gap-0.5">
                <div className="w-2 h-2 rounded-full bg-black"></div>
                <span className="font-bold text-gray-900 tracking-tight">privy</span>
            </div>
        </div>
      </div>
    </div>
  );
};