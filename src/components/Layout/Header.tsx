import React from 'react';
import { Waves, DollarSign } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DollarSign },
    { id: 'transactions', label: 'Transactions' },
    { id: 'wallets', label: 'Wallets' },
    { id: 'income', label: 'Income & FNPF' },
    { id: 'loans', label: 'Loans' },
    { id: 'budget', label: 'Budget' },
    { id: 'reports', label: 'Reports' }
  ];

  return (
    <header className="bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Waves className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Finance Fiji</h1>
              <p className="text-sky-100 text-sm">Personal Finance Manager</p>
            </div>
          </div>
        </div>
        
        <nav className="border-t border-sky-400/30">
          <div className="flex space-x-0 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  currentView === item.id
                    ? 'bg-white/20 text-white border-b-2 border-white'
                    : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;