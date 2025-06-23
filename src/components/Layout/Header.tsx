import React from 'react';
import { Settings, Heart, ShoppingBag, Shield, FileText, Wallet } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'needs', label: 'Needs', icon: Heart, color: 'emerald' },
    { id: 'wants', label: 'Wants', icon: ShoppingBag, color: 'amber' },
    { id: 'responsibilities', label: 'Responsibilities', icon: Shield, color: 'blue' },
    { id: 'reports', label: 'Reports', icon: FileText, color: 'purple' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'slate' }
  ];

  const getButtonStyles = (item: any) => {
    const isActive = currentView === item.id;
    const colorMap = {
      emerald: isActive 
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
        : 'text-emerald-600 hover:bg-emerald-50',
      amber: isActive 
        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25' 
        : 'text-amber-600 hover:bg-amber-50',
      blue: isActive 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
        : 'text-blue-600 hover:bg-blue-50',
      purple: isActive 
        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
        : 'text-purple-600 hover:bg-purple-50',
      slate: isActive 
        ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25' 
        : 'text-slate-600 hover:bg-slate-50'
    };
    
    return colorMap[item.color as keyof typeof colorMap];
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
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

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${getButtonStyles(item)}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;