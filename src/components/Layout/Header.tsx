import React, { useState } from 'react';
import { Settings, Heart, ShoppingBag, Shield, FileText, Wallet, PiggyBank, Building2, Menu, X, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'needs', label: 'Needs', icon: Heart, color: 'emerald', description: 'Essential expenses' },
    { id: 'wants', label: 'Wants', icon: ShoppingBag, color: 'amber', description: 'Entertainment & lifestyle' },
    { id: 'responsibilities', label: 'Responsibilities', icon: Shield, color: 'blue', description: 'Savings & investments' },
    { id: 'want-wallet', label: 'Want Wallet', icon: PiggyBank, color: 'pink', description: 'Accumulated savings' },
    { id: 'bank', label: 'Bank', icon: Building2, color: 'indigo', description: 'Account balance' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'purple', description: 'Financial insights' }
  ];

  const getCurrentPageInfo = () => {
    const currentItem = navItems.find(item => item.id === currentView);
    return currentItem || { label: 'Dashboard', icon: Wallet };
  };

  const currentPage = getCurrentPageInfo();
  const CurrentIcon = currentPage.icon;

  const getIconColor = (color: string) => {
    const colorMap = {
      emerald: 'text-emerald-600',
      amber: 'text-amber-600',
      blue: 'text-blue-600',
      pink: 'text-pink-600',
      indigo: 'text-indigo-600',
      purple: 'text-purple-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600';
  };

  const getBgColor = (color: string) => {
    const colorMap = {
      emerald: 'bg-emerald-50 hover:bg-emerald-100',
      amber: 'bg-amber-50 hover:bg-amber-100',
      blue: 'bg-blue-50 hover:bg-blue-100',
      pink: 'bg-pink-50 hover:bg-pink-100',
      indigo: 'bg-indigo-50 hover:bg-indigo-100',
      purple: 'bg-purple-50 hover:bg-purple-100'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-50 hover:bg-gray-100';
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                    <Wallet className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    FinanceFlow
                  </h1>
                  <p className="text-slate-500 text-sm">Smart Budget Tracker</p>
                </div>
              </div>

              {/* Navigation Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="flex items-center space-x-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                  <div className="flex items-center space-x-2">
                    <CurrentIcon className={`h-5 w-5 ${getIconColor(currentPage.color || 'gray')}`} />
                    <span className="font-medium text-gray-800">{currentPage.label}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                    isSidebarOpen ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>
            </div>

            {/* Right side - Settings */}
            <button
              onClick={() => onViewChange('settings')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                currentView === 'settings'
                  ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Navigation</h2>
                <p className="text-sm text-gray-500">Choose a section</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 text-left ${
                    isActive 
                      ? `${getBgColor(item.color)} border-2 border-${item.color}-200 shadow-sm` 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive ? `bg-${item.color}-100` : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isActive ? getIconColor(item.color) : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isActive ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  {isActive && (
                    <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Wallet className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">FinanceFlow</h4>
                  <p className="text-sm text-gray-600">Smart Budget Tracker</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;