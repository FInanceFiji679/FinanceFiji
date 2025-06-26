import React, { useState, useEffect } from 'react';
import Header from './components/Layout/Header';
import SettingsTab from './components/Settings/SettingsTab';
import NeedsTab from './components/Tracking/NeedsTab';
import WantsTab from './components/Tracking/WantsTab';
import ResponsibilitiesTab from './components/Tracking/ResponsibilitiesTab';
import WantWalletTab from './components/Tracking/WantWalletTab';
import BankTab from './components/Tracking/BankTab';
import ReportsTab from './components/Reports/ReportsTab';
import TutorialModal from './components/Tutorial/TutorialModal';
import { useFinanceStore } from './hooks/useFinanceStore';

function App() {
  const [currentView, setCurrentView] = useState('needs');
  const { hasSeenTutorial, markTutorialComplete } = useFinanceStore();
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, [hasSeenTutorial]);

  const renderCurrentView = () => {
    switch (currentView) {
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
      case 'settings':
        return <SettingsTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <NeedsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
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