import React, { useState } from 'react';
import { Plus, DollarSign, Settings, Building2 } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import SalaryInputForm from './SalaryInputForm';
import IncomeBudgetSettings from './IncomeBudgetSettings';

const IncomeTab: React.FC = () => {
  const { budgetSettings, updateBudgetSettings } = useFinanceStore();
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);

  const handleIncomeSubmit = (incomeData: any) => {
    // Handle income submission logic here
    console.log('Income submitted:', incomeData);
  };

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Income & Budget</h1>
            <p className="text-emerald-100">Manage your income and allocations</p>
          </div>
          <button
            onClick={() => setShowBudgetSettings(true)}
            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Current Budget Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Budget</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-gray-600">Monthly Income</p>
            <p className="text-2xl font-bold text-emerald-600">${budgetSettings.monthlyIncome.toFixed(2)}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Budget Status</p>
            <p className="text-sm font-medium text-blue-600">
              {budgetSettings.allocationLocked ? '🔒 Locked' : '🔓 Unlocked'}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Needs ({budgetSettings.needsPercentage}%)</span>
            <span className="font-medium">${((budgetSettings.monthlyIncome * budgetSettings.needsPercentage) / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Wants ({budgetSettings.wantsPercentage}%)</span>
            <span className="font-medium">${((budgetSettings.monthlyIncome * budgetSettings.wantsPercentage) / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Savings ({budgetSettings.responsibilitiesPercentage}%)</span>
            <span className="font-medium">${((budgetSettings.monthlyIncome * budgetSettings.responsibilitiesPercentage) / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Add Income Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowSalaryForm(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg mx-auto"
        >
          <Plus className="h-6 w-6" />
          <span className="text-lg font-semibold">Add Income</span>
        </button>
      </div>

      {/* Income Types */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Salary Income</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Regular employment income with automatic FNPF deductions
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Weekly</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Bi-weekly</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Monthly</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">FNPF Auto</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <DollarSign className="h-6 w-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Other Income</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Freelance work, bonuses, gifts, and additional income
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Freelance</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Bonus</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Gift</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">No FNPF</span>
          </div>
        </div>
      </div>

      {/* FNPF Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">FNPF Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 mb-1">Employee Contribution</p>
            <p className="font-semibold text-blue-600">8.5% (Auto-deducted)</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Employer Contribution</p>
            <p className="font-semibold text-emerald-600">8.5% (Tracked)</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSalaryForm && (
        <SalaryInputForm
          onClose={() => setShowSalaryForm(false)}
          onSubmit={handleIncomeSubmit}
        />
      )}

      {showBudgetSettings && (
        <IncomeBudgetSettings
          onClose={() => setShowBudgetSettings(false)}
          budgetSettings={budgetSettings}
          updateBudgetSettings={updateBudgetSettings}
        />
      )}
    </div>
  );
};

export default IncomeTab;