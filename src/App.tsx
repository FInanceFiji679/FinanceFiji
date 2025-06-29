import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import IncomeTab from './components/Income/IncomeTab';
import NeedsTab from './components/Tracking/NeedsTab';
import WantsTab from './components/Tracking/WantsTab';
import ResponsibilitiesTab from './components/Tracking/ResponsibilitiesTab';
import WantWalletTab from './components/Tracking/WantWalletTab';
import BankTab from './components/Tracking/BankTab';
import ReportsTab from './components/Reports/ReportsTab';
import SettingsTab from './components/Settings/SettingsTab';
import TutorialModal from './components/Tutorial/TutorialModal';
import LoadingScreen from './components/UI/LoadingScreen';
import { useFinanceStore } from './hooks/useFinanceStore';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const { hasSeenTutorial, markTutorialComplete } = useFinanceStore();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasSeenTutorial]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'income':
        return <IncomeTab />;
      case 'needs':
        return <NeedsTab />;
      case 'wants':
        return <WantsTab />;
      case 'responsibilities':
        return <ResponsibilitiesTab />;
      case 'want-wallet':
        return <WantWalletTab />;
      case 'bank':
        return <BankTab />;
      case 'reports':
        return <ReportsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <Dashboard />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Fiji-inspired background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-emerald-600"></div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="fiji-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.1"/>
              <path d="M5,5 L15,15 M15,5 L5,15" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fiji-pattern)"/>
        </svg>
      </div>

      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="relative z-10 w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="w-full">
          {renderCurrentView()}
        </div>
      </main>
      
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={markTutorialComplete}
      />
    </div>
  );
}

export default App;