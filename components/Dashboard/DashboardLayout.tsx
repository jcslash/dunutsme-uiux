import React, { useState, useCallback, memo, useMemo, useEffect, useRef } from 'react';
import { 
  DonutLogoIcon, HomeIcon, ExternalLinkIcon, 
  HeartIcon, CreditCardIcon, SettingsIcon, 
  LogOutIcon, BellIcon, MenuIcon, ChevronDownIcon,
  CopyIcon
} from '../visuals/Icons';
import type { UserProfile } from '../../lib/userService';

// Dashboard page types
export type DashboardPage = 'home' | 'supporters' | 'payouts' | 'settings';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  onViewPage?: () => void;
  onLogout: () => void;
  userProfile?: UserProfile | null;
}

// Memoized NavItem component - simplified design
const NavItem = memo<{
  icon: React.FC<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}>(({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left
      ${active 
        ? 'bg-gradient-to-r from-glaze-pink/10 to-glaze-orange/10 text-chocolate-dark font-medium' 
        : 'text-chocolate/60 hover:bg-cream hover:text-chocolate-dark'}
    `}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-glaze-pink' : 'text-chocolate/40 group-hover:text-glaze-pink'} transition-colors`} />
    <span className="text-[14px] font-medium">{label}</span>
  </button>
));
NavItem.displayName = 'NavItem';

// Navigation items configuration
const NAV_ITEMS: Array<{
  icon: React.FC<{ className?: string }>;
  label: string;
  key: DashboardPage | 'viewPage';
}> = [
  { icon: HomeIcon, label: 'Home', key: 'home' },
  { icon: ExternalLinkIcon, label: 'View page', key: 'viewPage' },
  { icon: HeartIcon, label: 'Supporters', key: 'supporters' },
  { icon: CreditCardIcon, label: 'Payouts', key: 'payouts' },
  { icon: SettingsIcon, label: 'Settings', key: 'settings' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = memo(({ 
  children, 
  currentPage,
  onPageChange,
  onViewPage, 
  onLogout, 
  userProfile 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  // Get display name from user profile
  const displayName = userProfile?.displayName || userProfile?.username || 'User';
  const username = userProfile?.username || 'yourname';
  const pageUrl = `donutsme.app/${username}`;
  
  // Generate initials for avatar
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Copy link handler
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`https://${pageUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [pageUrl]);

  // Handle nav item click
  const handleNavClick = useCallback((key: DashboardPage | 'viewPage') => {
    if (key === 'viewPage') {
      onViewPage?.();
    } else {
      onPageChange(key);
    }
    setSidebarOpen(false);
  }, [onViewPage, onPageChange]);

  // Toggle user menu
  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
    setShowNotifications(false);
  }, []);

  // Toggle notifications
  const toggleNotifications = useCallback(() => {
    setShowNotifications(prev => !prev);
    setShowUserMenu(false);
  }, []);

  // Handle settings from user menu
  const handleSettingsClick = useCallback(() => {
    onPageChange('settings');
    setShowUserMenu(false);
  }, [onPageChange]);

  // Handle logout from user menu
  const handleLogoutClick = useCallback(() => {
    setShowUserMenu(false);
    onLogout();
  }, [onLogout]);

  // Memoize nav items
  const navItems = useMemo(() => (
    NAV_ITEMS.map((item) => (
      <NavItem 
        key={item.key}
        icon={item.icon}
        label={item.label}
        active={item.key === currentPage}
        onClick={() => handleNavClick(item.key)}
      />
    ))
  ), [currentPage, handleNavClick]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-dm-sans text-chocolate-dark">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar - Clean & Minimal */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-[240px] bg-white border-r border-chocolate/5 flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-chocolate/5">
          <a href="#" className="flex items-center gap-2.5 font-fredoka font-bold text-xl text-chocolate hover:scale-[1.02] transition-transform">
            <div className="w-8 h-8">
              <DonutLogoIcon />
            </div>
            Donuts Me
          </a>
        </div>

        {/* Navigation - Simplified */}
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="space-y-1">
            {navItems}
          </nav>
        </div>

        {/* Bottom Section - Logout */}
        <div className="p-3 border-t border-chocolate/5">
          <NavItem 
            icon={LogOutIcon} 
            label="Log out" 
            onClick={onLogout}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar - Cleaner */}
        <header className="h-16 bg-white border-b border-chocolate/5 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button 
              className="p-2 -ml-2 rounded-lg hover:bg-cream lg:hidden text-chocolate/70"
              onClick={handleOpenSidebar}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            
            {/* Page URL with copy button */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-chocolate/50">{pageUrl}</span>
              <button 
                onClick={handleCopyLink}
                className={`p-1.5 rounded-lg transition-all ${
                  copied 
                    ? 'bg-green-badge/10 text-green-badge' 
                    : 'hover:bg-cream text-chocolate/40 hover:text-chocolate'
                }`}
                title="Copy link"
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={toggleNotifications}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-cream text-chocolate/50 transition-colors relative"
              >
                <BellIcon className="w-5 h-5" />
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-chocolate/10 py-2 z-50">
                  <div className="px-4 py-2 border-b border-chocolate/5">
                    <h3 className="font-semibold text-chocolate-dark">Notifications</h3>
                  </div>
                  <div className="p-8 text-center">
                    <BellIcon className="w-8 h-8 text-chocolate/20 mx-auto mb-2" />
                    <p className="text-sm text-chocolate/50">No notifications yet</p>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={toggleUserMenu}
                className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-full hover:bg-cream transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-glaze-orange to-glaze-pink flex items-center justify-center text-white text-sm font-semibold">
                  {initials}
                </div>
                <span className="hidden md:block font-medium text-sm text-chocolate/70 group-hover:text-chocolate-dark">
                  {displayName}
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-chocolate/30 hidden md:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-chocolate/10 py-2 z-50">
                  <button
                    onClick={handleSettingsClick}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-chocolate/70 hover:bg-cream hover:text-chocolate-dark transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-chocolate/70 hover:bg-cream hover:text-chocolate-dark transition-colors"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-[900px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
