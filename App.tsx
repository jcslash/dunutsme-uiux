import React, { useState, useCallback, useEffect, lazy, Suspense, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import * as apiClient from './lib/apiClient';
import type { UserProfile } from './lib/apiClient';
import type { DashboardPage } from './components/Dashboard/DashboardLayout';

// Lazy load components that are not immediately visible (Rule 2.4: Dynamic Imports for Heavy Components)
const Onboarding = lazy(() => import('./components/Onboarding').then(m => ({ default: m.Onboarding })));
const DashboardLayout = lazy(() => import('./components/Dashboard/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const DashboardHome = lazy(() => import('./components/Dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const DashboardSupporters = lazy(() => import('./components/Dashboard/DashboardSupporters').then(m => ({ default: m.DashboardSupporters })));
const DashboardPayouts = lazy(() => import('./components/Dashboard/DashboardPayouts').then(m => ({ default: m.DashboardPayouts })));
const DashboardSettings = lazy(() => import('./components/Dashboard/DashboardSettings').then(m => ({ default: m.DashboardSettings })));
const PublicProfile = lazy(() => import('./components/PublicProfile').then(m => ({ default: m.PublicProfile })));

// Static JSX hoisted outside component (Rule 6.3: Hoist Static JSX Elements)
const LoadingSpinner = (
  <div className="w-16 h-16 border-4 border-glaze-pink border-t-transparent rounded-full animate-spin" />
);

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    {LoadingSpinner}
  </div>
);

// App state types
type AppView = 'landing' | 'onboarding' | 'dashboard' | 'publicProfile';

// Demo mode check - lazy initialization (Rule 5.10: Use Lazy State Initialization)
const getDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('demo') === 'true';
};

// Demo user profile - hoisted as constant (Rule 5.4: Extract Default Non-primitive Parameter Value)
const DEMO_USER_PROFILE: UserProfile = {
  id: 'demo-user',
  username: 'demouser',
  displayName: 'Demo User',
  bio: 'This is a demo account for testing purposes.',
  createdAt: new Date().toISOString(),
};

const App: React.FC = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();
  
  // Lazy state initialization (Rule 5.10)
  const [demoMode] = useState(getDemoMode);
  const [currentView, setCurrentView] = useState<AppView>(() => getDemoMode() ? 'dashboard' : 'landing');
  const [dashboardPage, setDashboardPage] = useState<DashboardPage>('home');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => getDemoMode() ? DEMO_USER_PROFILE : null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);

  // Check user registration status when authenticated (Rule 5.6: Narrow Effect Dependencies)
  useEffect(() => {
    if (demoMode) return;
    
    const checkUser = async () => {
      if (ready && authenticated && user) {
        setIsCheckingUser(true);
        
        try {
          const accessToken = await user.getAccessToken();
          const { user: profile } = await apiClient.getCurrentUser(accessToken);
          setUserProfile(profile);
          setCurrentView('dashboard');
        } catch (error) {
          // User not registered, show onboarding
          console.log('User not registered, showing onboarding');
          setCurrentView('onboarding');
        } finally {
          setIsCheckingUser(false);
        }
      } else if (ready && !authenticated) {
        setCurrentView('landing');
        setUserProfile(null);
      }
    };
    
    checkUser();
  }, [ready, authenticated, user, demoMode]);

  // Handle Privy login (Rule 5.7: Put Interaction Logic in Event Handlers)
  const handleOpenLogin = useCallback(() => {
    login();
  }, [login]);

  // Handle logout - functional setState (Rule 5.9: Use Functional setState Updates)
  const handleLogout = useCallback(async () => {
    if (demoMode) {
      window.location.href = '/';
      return;
    }
    await logout();
    setCurrentView('landing');
    setUserProfile(null);
    setDashboardPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [logout, demoMode]);

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

  // Memoize dashboard content to prevent unnecessary re-renders (Rule 5.5: Extract to Memoized Components)
  const dashboardContent = useMemo(() => {
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
  }, [dashboardPage, userProfile, handleProfileUpdate, handleLogout]);

  // Derive loading state (Rule 5.1: Calculate Derived State During Rendering)
  const isLoading = !demoMode && (!ready || isCheckingUser);

  // Early return for loading state (Rule 7.8: Early Return from Functions)
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Use explicit conditional rendering (Rule 6.8: Use Explicit Conditional Rendering)
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
  if (currentView === 'dashboard' && (demoMode || authenticated)) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <DashboardLayout 
          currentPage={dashboardPage}
          onPageChange={handlePageChange}
          onViewPage={handleViewPage} 
          onLogout={handleLogout}
          userProfile={userProfile}
        >
          {dashboardContent}
        </DashboardLayout>
      </Suspense>
    );
  }

  // 3. Onboarding View
  if (currentView === 'onboarding' && authenticated && user) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Onboarding 
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
