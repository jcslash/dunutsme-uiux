import React, { useState, useCallback, lazy, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';

// Lazy load components that are not immediately visible
const Onboarding = lazy(() => import('./components/Onboarding').then(m => ({ default: m.Onboarding })));
const DashboardLayout = lazy(() => import('./components/Dashboard/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const DashboardHome = lazy(() => import('./components/Dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const PublicProfile = lazy(() => import('./components/PublicProfile').then(m => ({ default: m.PublicProfile })));

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-glaze-pink border-t-transparent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDashboardReady, setIsDashboardReady] = useState(false);
  const [showPublicProfile, setShowPublicProfile] = useState(false);

  // Memoized callbacks to prevent unnecessary re-renders
  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);
  
  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const handleOnboardingFinish = useCallback(() => {
    setIsDashboardReady(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setIsDashboardReady(false);
    setShowPublicProfile(false);
    // Scroll to top to ensure we land on the Hero section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewPage = useCallback(() => setShowPublicProfile(true), []);
  const handleLogoClick = useCallback(() => setShowPublicProfile(false), []);

  // 1. Public Profile View (Accessible from dashboard or direct if we had router)
  if (showPublicProfile) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <PublicProfile onLogoClick={handleLogoClick} />
      </Suspense>
    );
  }

  // 2. Dashboard View
  if (isDashboardReady) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <DashboardLayout 
          onViewPage={handleViewPage} 
          onLogout={handleLogout}
        >
          <DashboardHome />
        </DashboardLayout>
      </Suspense>
    );
  }

  // 3. Onboarding View
  if (isLoggedIn) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Onboarding onFinish={handleOnboardingFinish} onLogout={handleLogout} />
      </Suspense>
    );
  }

  // 4. Landing Page View
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenLogin={openLogin} />
      <main id="main-content" className="flex-grow">
        <Hero onOpenLogin={openLogin} />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={closeLogin} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
