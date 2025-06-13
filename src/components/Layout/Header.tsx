import React from 'react';
import { Waves, DollarSign, BarChart3, Wallet, TrendingUp, CreditCard, Target, FileText } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'wallets', label: 'Wallets', icon: Wallet },
    { id: 'income', label: 'Income & FNPF', icon: TrendingUp },
    { id: 'loans', label: 'Loans', icon: DollarSign },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-3 rounded-xl shadow-lg">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1">
                <DollarSign className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Finance Fiji</h1>
              <p className="text-slate-400 text-sm">Personal Finance Manager</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-center text-slate-500 text-xs">
            <p>© 2024 Finance Fiji</p>
            <p className="mt-1">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white capitalize">
                {navItems.find(item => item.id === currentView)?.label || 'Dashboard'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Manage your finances with confidence
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-slate-400 text-xs">Last updated</p>
                <p className="text-white text-sm font-medium">
                  {new Date().toLocaleDateString('en-FJ')}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">FJ</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 bg-slate-900 overflow-auto">
          <div className="p-6">
            {/* Content will be rendered here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Header;