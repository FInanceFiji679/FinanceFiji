import React, { useState } from 'react';
import { Settings, FileText, Wallet, PiggyBank, Menu, X, ChevronDown, DollarSign, BarChart3 } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'blue', description: 'Financial overview' },
    { id: 'income', label: 'Income', icon: DollarSign, color: 'green', description: 'Income & budget settings' },
    { id: 'transactions', label: 'Transactions', icon: FileText, color: 'slate', description: 'All financial transactions' },
    { id: 'want-wallet', label: 'Want Wallet', icon: PiggyBank, color: 'pink', description: 'Savings from unspent wants' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'purple', description: 'Financial insights' }
  ];

  const getCurrentPageInfo = () => {
    const currentItem = navItems.find(item => item.id === currentView);
    return currentItem || { label: 'Dashboard', icon: BarChart3, color: 'blue' };
  };

  const currentPage = getCurrentPageInfo();
  const CurrentIcon = currentPage.icon;

  const getIconColor = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      emerald: 'text-emerald-600',
      amber: 'text-amber-600',
      pink: 'text-pink-600',
      indigo: 'text-indigo-600',
      purple: 'text-purple-600',
      slate: 'text-slate-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-gray-600';
  };

  const getBgColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 hover:bg-blue-100',
      green: 'bg-green-50 hover:bg-green-100',
      emerald: 'bg-emerald-50 hover:bg-emerald-100',
      amber: 'bg-amber-50 hover:bg-amber-100',
      pink: 'bg-pink-50 hover:bg-pink-100',
      indigo: 'bg-indigo-50 hover:bg-indigo-100',
      purple: 'bg-purple-50 hover:bg-purple-100',
      slate: 'bg-slate-50 hover:bg-slate-100'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-50 hover:bg-gray-100';
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-3 sm:px-4">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Left side - Navigation Dropdown */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                <div className="hidden sm:flex items-center space-x-2">
                  <CurrentIcon className={`h-4 w-4 ${getIconColor(currentPage.color || 'gray')}`} />
                  <span className="font-medium text-gray-800 text-sm">{currentPage.label}</span>
                </div>
                <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-500 transition-transform duration-200 ${
                  isSidebarOpen ? 'rotate-180' : ''
                }`} />
              </button>
            </div>

            {/* Center - App Name with Fiji branding */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
                    <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-emerald-500 rounded-full p-0.5 sm:p-1">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Finance Fiji
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm hidden sm:block">Smart Money Management</p>
                </div>
              </div>
            </div>

            {/* Right side - Settings */}
            <div className="flex-shrink-0">
              <button
                onClick={() => onViewChange('settings')}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  currentView === 'settings'
                    ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline text-sm">Settings</span>
              </button>
            </div>
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
      <div className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 sm:p-6 h-full overflow-y-auto">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-2 rounded-lg">
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Finance Fiji</h2>
                <p className="text-xs sm:text-sm text-gray-500">Navigation</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
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
                  className={`w-full flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl transition-all duration-200 text-left ${
                    isActive 
                      ? `${getBgColor(item.color)} border-2 border-${item.color}-200 shadow-sm` 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive ? `bg-${item.color}-100` : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isActive ? getIconColor(item.color) : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm sm:text-base ${
                      isActive ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{item.description}</p>
                  </div>
                  {isActive && (
                    <div className={`w-2 h-2 rounded-full bg-${item.color}-500 flex-shrink-0`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Finance Fiji</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Designed for Fiji 🇫🇯</p>
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