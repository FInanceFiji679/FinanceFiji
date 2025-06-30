import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import IncomeTab from './components/Income/IncomeTab';
import TransactionManager from './components/Transactions/TransactionManager';
import WantWalletTab from './components/Tracking/WantWalletTab';
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
        return <Dashboard onNavigate={setCurrentView} />;
      case 'income':
        return <IncomeTab />;
      case 'transactions':
        return <TransactionManager />;
      case 'want-wallet':
        return <WantWalletTab />;
      case 'reports':
        return <ReportsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {renderCurrentView()}
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