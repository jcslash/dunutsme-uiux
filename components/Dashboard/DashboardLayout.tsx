import React, { useState, useCallback, memo, useMemo } from 'react';
import { 
  DonutLogoIcon, HomeIcon, ExternalLinkIcon, CompassIcon, 
  HeartIcon, StarIcon, ShoppingBagIcon, FileTextIcon, 
  ImageIcon, MessageSquareIcon, LayoutIcon, ZapIcon, 
  CreditCardIcon, SettingsIcon, LogOutIcon, BellIcon, MenuIcon, ChevronDownIcon 
} from '../visuals/Icons';
import type { UserProfile } from '../../lib/userService';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onViewPage?: () => void;
  onLogout: () => void;
  userProfile?: UserProfile | null;
}

// Memoized SectionTitle component
const SectionTitle = memo<{ children: React.ReactNode }>(({ children }) => (
  <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-chocolate/40 mb-2 font-fredoka">
    {children}
  </h3>
));
SectionTitle.displayName = 'SectionTitle';

// Memoized NavItem component
const NavItem = memo<{
  icon: React.FC<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}>(({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left
      ${active ? 'bg-cream text-chocolate-dark font-medium shadow-sm' : 'text-chocolate/70 hover:bg-cream hover:text-chocolate-dark'}
    `}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-glaze-pink' : 'text-chocolate/40 group-hover:text-glaze-pink'} transition-colors`} />
    <span className="text-[14px]">{label}</span>
  </button>
));
NavItem.displayName = 'NavItem';

// Navigation items data
const MAIN_NAV_ITEMS = [
  { icon: HomeIcon, label: 'Home', active: true },
  { icon: ExternalLinkIcon, label: 'View page', key: 'viewPage' },
  { icon: CompassIcon, label: 'Explore creators' },
] as const;

const MONETIZE_ITEMS = [
  { icon: HeartIcon, label: 'Supporters' },
  { icon: StarIcon, label: 'Memberships' },
  { icon: ShoppingBagIcon, label: 'Shop' },
] as const;

const PUBLISH_ITEMS = [
  { icon: FileTextIcon, label: 'Posts' },
  { icon: ImageIcon, label: 'Gallery' },
  { icon: MessageSquareIcon, label: 'Messages' },
] as const;

const SETTINGS_ITEMS = [
  { icon: LayoutIcon, label: 'Buttons & Graphics' },
  { icon: ZapIcon, label: 'Integrations' },
  { icon: CreditCardIcon, label: 'Payouts' },
  { icon: SettingsIcon, label: 'Settings' },
] as const;

export const DashboardLayout: React.FC<DashboardLayoutProps> = memo(({ children, onViewPage, onLogout, userProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  // Get display name from user profile
  const displayName = userProfile?.displayName || userProfile?.username || 'User';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  // Memoize main nav items
  const mainNavItems = useMemo(() => (
    MAIN_NAV_ITEMS.map((item, idx) => (
      <NavItem 
        key={idx}
        icon={item.icon}
        label={item.label}
        active={item.active}
        onClick={item.key === 'viewPage' ? onViewPage : undefined}
      />
    ))
  ), [onViewPage]);

  // Memoize monetize items
  const monetizeItems = useMemo(() => (
    MONETIZE_ITEMS.map((item, idx) => (
      <NavItem key={idx} icon={item.icon} label={item.label} />
    ))
  ), []);

  // Memoize publish items
  const publishItems = useMemo(() => (
    PUBLISH_ITEMS.map((item, idx) => (
      <NavItem key={idx} icon={item.icon} label={item.label} />
    ))
  ), []);

  // Memoize settings items
  const settingsItems = useMemo(() => (
    SETTINGS_ITEMS.map((item, idx) => (
      <NavItem key={idx} icon={item.icon} label={item.label} />
    ))
  ), []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-dm-sans text-chocolate-dark">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-white border-r border-chocolate/5 flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-chocolate/5">
          <a href="#" className="flex items-center gap-2 font-fredoka font-bold text-xl text-chocolate hover:scale-[1.02] transition-transform">
            <div className="w-8 h-8">
              <DonutLogoIcon />
            </div>
            Donuts&nbsp;Me
          </a>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          {/* Main Menu */}
          <div className="space-y-1">
            {mainNavItems}
          </div>

          {/* Monetize */}
          <div>
            <SectionTitle>Monetize</SectionTitle>
            <div className="space-y-1">
              {monetizeItems}
            </div>
          </div>

          {/* Publish */}
          <div>
            <SectionTitle>Publish</SectionTitle>
            <div className="space-y-1">
              {publishItems}
            </div>
          </div>

          {/* Settings */}
          <div>
            <SectionTitle>Settings</SectionTitle>
            <div className="space-y-1">
              {settingsItems}
            </div>
          </div>
          
          {/* More */}
          <div>
            <SectionTitle>More</SectionTitle>
            <div className="space-y-1">
              <NavItem icon={LogOutIcon} label="Log out" onClick={onLogout} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-chocolate/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 rounded-lg hover:bg-cream lg:hidden text-chocolate/70"
              onClick={handleOpenSidebar}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            {/* Show username link */}
            {userProfile?.username && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-chocolate/60">
                <span>donutsme.app/</span>
                <span className="font-semibold text-chocolate-dark">{userProfile.username}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Notifications */}
            <div className="relative group">
              <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream text-chocolate/60 transition-colors relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-glaze-pink border-2 border-white" />
              </button>
            </div>

            {/* User Menu */}
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-cream transition-colors group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-glaze-orange to-glaze-pink p-[2px]">
                <img 
                  src={avatarUrl}
                  alt={displayName} 
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="hidden sm:block font-medium text-sm text-chocolate group-hover:text-chocolate-dark">
                {displayName}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-chocolate/40 hidden sm:block" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-[1100px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';
