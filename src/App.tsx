import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import IncomeTracker from './components/Income/IncomeTracker';
import TransactionManager from './components/Transactions/TransactionManager';
import WalletManager from './components/Wallets/WalletManager';
import LoanManager from './components/Loans/LoanManager';
import BudgetManager from './components/Budget/BudgetManager';
import ReportsGenerator from './components/Reports/ReportsGenerator';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'income':
        return <IncomeTracker />;
      case 'transactions':
        return <TransactionManager />;
      case 'wallets':
        return <WalletManager />;
      case 'loans':
        return <LoanManager />;
      case 'budget':
        return <BudgetManager />;
      case 'reports':
        return <ReportsGenerator />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;