import React from 'react';
import { DollarSign, TrendingUp, PiggyBank, Target } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const financialTips = [
    "The 50/30/20 rule helps balance your spending and savings automatically",
    "FNPF contributions in Fiji are 8% employee + 8% employer = 16% total",
    "Emergency funds should cover 3-6 months of essential expenses",
    "Small daily savings can compound into significant amounts over time",
    "Track every dollar to understand your spending patterns better"
  ];

  const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-emerald-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-amber-400/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-white/5 rounded-full animate-pulse"></div>
      </div>

      <div className="text-center z-10 max-w-md mx-auto px-6">
        {/* Logo and branding */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="bg-white/20 backdrop-blur-lg p-6 rounded-3xl shadow-2xl border border-white/30">
              <div className="flex items-center justify-center space-x-3">
                <div className="relative">
                  <DollarSign className="h-12 w-12 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold text-white">Finance Fiji</h1>
                  <p className="text-blue-100 text-sm">Smart Money Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading animation */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-white/80 text-lg font-medium">Initializing your financial dashboard...</p>
        </div>

        {/* Feature icons */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="text-white/70 text-xs">Smart Budgeting</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <PiggyBank className="h-6 w-6 text-amber-400" />
            </div>
            <p className="text-white/70 text-xs">FNPF Tracking</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="h-6 w-6 text-blue-300" />
            </div>
            <p className="text-white/70 text-xs">Goal Setting</p>
          </div>
        </div>

        {/* Financial tip */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
          <p className="text-white/90 text-sm leading-relaxed">
            💡 <strong>Tip:</strong> {randomTip}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;