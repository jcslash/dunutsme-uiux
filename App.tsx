import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { Onboarding } from './components/Onboarding';
import { DashboardLayout } from './components/Dashboard/DashboardLayout';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { PublicProfile } from './components/PublicProfile';

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDashboardReady, setIsDashboardReady] = useState(false);
  const [showPublicProfile, setShowPublicProfile] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  
  const handleLoginSuccess = () => {
      setIsLoggedIn(true);
  };

  const handleOnboardingFinish = () => {
      setIsDashboardReady(true);
  };

  // 1. Public Profile View (Accessible from dashboard or direct if we had router)
  if (showPublicProfile) {
      return <PublicProfile />;
  }

  // 2. Dashboard View
  if (isDashboardReady) {
      return (
          <DashboardLayout onViewPage={() => setShowPublicProfile(true)}>
              <DashboardHome />
          </DashboardLayout>
      );
  }

  // 3. Onboarding View
  if (isLoggedIn) {
      return <Onboarding onFinish={handleOnboardingFinish} />;
  }

  // 4. Landing Page View
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenLogin={openLogin} />
      <main id="main-content" className="flex-grow">
        <Hero onOpenLogin={openLogin} />
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