import React, { useState } from 'react';
import { BookOpen, Settings as SettingsIcon, Calculator } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import BudgetHeader from '../Shared/BudgetHeader';
import EducationalSection from '../Educational/EducationalSection';
import FinancialSettingsTab from './FinancialSettingsTab';

const SettingsTab: React.FC = () => {
  const { resetMonth } = useFinanceStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('financial');

  const tabs = [
    { id: 'financial', label: 'Financial Config', icon: SettingsIcon },
    { id: 'education', label: 'Learn & Grow', icon: BookOpen },
    { id: 'advanced', label: 'Advanced', icon: Calculator }
  ];

  const renderAdvanced = () => (
    <div className="space-y-8">
      {/* Month Reset */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-red-100 rounded-xl">
            <Calculator className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Monthly Reset</h2>
        </div>
        
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 mb-6">
          <h4 className="font-medium text-amber-900 mb-2">What happens when you reset?</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• All current month transactions are archived</li>
            <li>• Unspent wants money is added to your Want Wallet</li>
            <li>• Monthly remainder is added to your Bank balance</li>
            <li>• Transaction counters reset to zero</li>
            <li>• Your budget settings and goals remain unchanged</li>
          </ul>
        </div>
        
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            Reset Month
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <p className="text-red-600 font-medium">Are you sure? This cannot be undone.</p>
            <button
              onClick={() => {
                resetMonth();
                setShowResetConfirm(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Data Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Auto-Save</h4>
            <p className="text-sm text-blue-700 mb-3">
              All your data is automatically saved to your browser's local storage. 
              No account required, complete privacy.
            </p>
            <div className="flex items-center space-x-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Data Persistence</h4>
            <p className="text-sm text-purple-700 mb-3">
              Your financial data persists between sessions and browser restarts. 
              Clear browser data to reset everything.
            </p>
            <div className="flex items-center space-x-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings & Configuration</h1>
        <p className="text-slate-600">Customize your financial tracking experience</p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-700 font-medium">
            💡 Budget settings have been moved to the Income section for better organization
          </p>
          <p className="text-blue-600 text-sm mt-1">
            Configure your income and budget allocations directly when managing your income sources
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'financial' && <FinancialSettingsTab />}
      {activeTab === 'education' && <EducationalSection />}
      {activeTab === 'advanced' && renderAdvanced()}
    </div>
  );
};

export default SettingsTab;