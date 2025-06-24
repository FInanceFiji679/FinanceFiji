import React, { useState } from 'react';
import Header from './components/Layout/Header';
import SettingsTab from './components/Settings/SettingsTab';
import NeedsTab from './components/Tracking/NeedsTab';
import WantsTab from './components/Tracking/WantsTab';
import ResponsibilitiesTab from './components/Tracking/ResponsibilitiesTab';
import WantWalletTab from './components/Tracking/WantWalletTab';
import BankTab from './components/Tracking/BankTab';
import ReportsTab from './components/Reports/ReportsTab';

function App() {
  const [currentView, setCurrentView] = useState('needs');

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
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;