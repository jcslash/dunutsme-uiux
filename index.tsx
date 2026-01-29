import React, { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';
import { PRIVY_APP_ID, privyConfig } from './lib/privyConfig';

// Error Boundary Component for graceful error handling
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to monitoring service in production
    console.error('Application Error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md text-center">
            <div className="text-4xl mb-4">🍩</div>
            <h1 className="font-fredoka text-2xl font-bold text-chocolate-dark mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-chocolate/60 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-br from-glaze-pink to-glaze-orange text-white px-6 py-3 rounded-full font-fredoka font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get root element with null check
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

// Create root and render app
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={privyConfig}
      >
        <App />
      </PrivyProvider>
    </ErrorBoundary>
  </StrictMode>
);

// Report Web Vitals (optional - for performance monitoring)
if (typeof window !== 'undefined' && 'performance' in window) {
  // Log performance metrics in development
  if (import.meta.env.DEV) {
    const logPerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        console.log('Performance Metrics:', {
          'DOM Content Loaded': `${navigation.domContentLoadedEventEnd - navigation.startTime}ms`,
          'Load Complete': `${navigation.loadEventEnd - navigation.startTime}ms`,
          'First Paint': performance.getEntriesByName('first-paint')[0]?.startTime || 'N/A',
        });
      }
    };
    
    if (document.readyState === 'complete') {
      logPerformance();
    } else {
      window.addEventListener('load', logPerformance);
    }
  }
}
