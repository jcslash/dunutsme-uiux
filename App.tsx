import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { isUserRegistered, getUserByPrivyId, type UserProfile } from './lib/userService';
import type { DashboardPage } from './components/Dashboard/DashboardLayout';

// Lazy load components that are not immediately visible
const Onboarding = lazy(() => import('./components/Onboarding').then(m => ({ default: m.Onboarding })));
const DashboardLayout = lazy(() => import('./components/Dashboard/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const DashboardHome = lazy(() => import('./components/Dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const DashboardSupporters = lazy(() => import('./components/Dashboard/DashboardSupporters').then(m => ({ default: m.DashboardSupporters })));
const DashboardPayouts = lazy(() => import('./components/Dashboard/DashboardPayouts').then(m => ({ default: m.DashboardPayouts })));
const DashboardSettings = lazy(() => import('./components/Dashboard/DashboardSettings').then(m => ({ default: m.DashboardSettings })));
const PublicProfile = lazy(() => import('./components/PublicProfile').then(m => ({ default: m.PublicProfile })));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-glaze-pink border-t-transparent rounded-full animate-spin" />
  </div>
);

// App state types
type AppView = 'landing' | 'onboarding' | 'dashboard' | 'publicProfile';

// Demo mode - set to true to preview Dashboard without authentication
const DEMO_MODE = new URLSearchParams(window.location.search).get('demo') === 'true';

const App: React.FC = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  
  const [currentView, setCurrentView] = useState<AppView>(DEMO_MODE ? 'dashboard' : 'landing');
  const [dashboardPage, setDashboardPage] = useState<DashboardPage>('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    DEMO_MODE ? {
      privyId: 'demo-user',
      username: 'demouser',
      displayName: 'Demo User',
      bio: 'This is a demo account for testing purposes.',
      createdAt: Date.now(),
    } : null
  );
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  // Check user registration status when authenticated
  useEffect(() => {
    if (DEMO_MODE) return; // Skip auth check in demo mode
    
    if (ready && authenticated && user) {
      setIsCheckingUser(true);
      
      // Get Privy user ID
      const privyId = user.id;
      
      // Check if user is already registered
      if (isUserRegistered(privyId)) {
        // User exists, get their profile and go to dashboard
        const profile = getUserByPrivyId(privyId);
        setUserProfile(profile);
        setCurrentView('dashboard');
      } else {
        // New user, go to onboarding
        setCurrentView('onboarding');
      }
      
      setIsCheckingUser(false);
    } else if (ready && !authenticated) {
      // User logged out, reset to landing
      setCurrentView('landing');
      setUserProfile(null);
    }
  }, [ready, authenticated, user]);

  // Handle Privy login
  const handleOpenLogin = useCallback(() => {
    login();
  }, [login]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    if (DEMO_MODE) {
      window.location.href = '/';
      return;
    }
    await logout();
    setCurrentView('landing');
    setUserProfile(null);
    setDashboardPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [logout]);

  // Handle onboarding completion
  const handleOnboardingFinish = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView('dashboard');
  }, []);

  // Handle view page
  const handleViewPage = useCallback(() => {
    setCurrentView('publicProfile');
  }, []);

  // Handle logo click (return to dashboard from public profile)
  const handleLogoClick = useCallback(() => {
    setCurrentView('dashboard');
  }, []);

  // Handle dashboard page change
  const handlePageChange = useCallback((page: DashboardPage) => {
    setDashboardPage(page);
  }, []);

  // Handle profile update from settings
  const handleProfileUpdate = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
  }, []);

  // Render dashboard content based on current page
  const renderDashboardContent = () => {
    switch (dashboardPage) {
      case 'supporters':
        return <DashboardSupporters userProfile={userProfile} />;
      case 'payouts':
        return <DashboardPayouts userProfile={userProfile} />;
      case 'settings':
        return (
          <DashboardSettings 
            userProfile={userProfile} 
            onProfileUpdate={handleProfileUpdate}
            onLogout={handleLogout}
          />
        );
      case 'home':
      default:
        return <DashboardHome userProfile={userProfile} />;
    }
  };

  // Show loading while Privy is initializing or checking user (skip in demo mode)
  if (!DEMO_MODE && (!ready || isCheckingUser)) {
    return <LoadingFallback />;
  }

  // 1. Public Profile View
  if (currentView === 'publicProfile') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <PublicProfile 
          onLogoClick={handleLogoClick} 
          userProfile={userProfile}
        />
      </Suspense>
    );
  }

  // 2. Dashboard View (demo mode or authenticated)
  if (currentView === 'dashboard' && (DEMO_MODE || authenticated)) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <DashboardLayout 
          currentPage={dashboardPage}
          onPageChange={handlePageChange}
          onViewPage={handleViewPage} 
          onLogout={handleLogout}
          userProfile={userProfile}
        >
          {renderDashboardContent()}
        </DashboardLayout>
      </Suspense>
    );
  }

  // 3. Onboarding View
  if (currentView === 'onboarding' && authenticated && user) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Onboarding 
          privyUser={user}
          onFinish={handleOnboardingFinish} 
          onLogout={handleLogout} 
        />
      </Suspense>
    );
  }

  // 4. Landing Page View
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenLogin={handleOpenLogin} />
      <main id="main-content" className="flex-grow">
        <Hero onOpenLogin={handleOpenLogin} />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default App;
