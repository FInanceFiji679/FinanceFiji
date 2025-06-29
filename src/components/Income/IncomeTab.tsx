import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, Building2, User, Gift, Calendar, Wallet, Settings, Edit, Lock, Unlock } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import { useFinanceData } from '../../hooks/useFinanceData';
import BudgetHeader from '../Shared/BudgetHeader';
import SalaryInputForm from './SalaryInputForm';
import IncomeBudgetSettings from './IncomeBudgetSettings';

const IncomeTab: React.FC = () => {
  const { addTransaction, budgetSettings, updateBudgetSettings } = useFinanceStore();
  const { wallets } = useFinanceData();
  const [showSalaryForm, setShowSalaryForm] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);

  const handleIncomeSubmit = (incomeData: any) => {
    if (incomeData.type === 'salary') {
      // Add the net salary as income
      addTransaction({
        amount: incomeData.fnpfDeductions.netAmount,
        description: `Salary (Net) - ${incomeData.source}`,
        category: 'needs',
        account: incomeData.destinationWallet,
        date: incomeData.date
      });

      // Add FNPF deductions as responsibility transactions
      if (incomeData.fnpfDeductions.employeeDeduction > 0) {
        addTransaction({
          amount: incomeData.fnpfDeductions.employeeDeduction,
          description: `FNPF Employee Contribution - ${incomeData.source}`,
          category: 'responsibilities',
          account: incomeData.destinationWallet,
          date: incomeData.date
        });
      }

      if (incomeData.fnpfDeductions.personalDeduction > 0) {
        addTransaction({
          amount: incomeData.fnpfDeductions.personalDeduction,
          description: `FNPF Personal Contribution - ${incomeData.source}`,
          category: 'responsibilities',
          account: incomeData.destinationWallet,
          date: incomeData.date
        });
      }
    } else {
      // Add other income
      addTransaction({
        amount: incomeData.amount,
        description: `${incomeData.name} - ${incomeData.source || incomeData.category}`,
        category: 'needs',
        account: incomeData.destinationWallet,
        date: incomeData.date
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Main Income Header */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-xl">
              <DollarSign className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Income & Budget Management</h1>
              <p className="text-green-100">Record your income and configure budget allocations</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBudgetSettings(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              {budgetSettings.allocationLocked ? <Lock className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
              <span className="font-medium">Budget Settings</span>
            </button>
            <button
              onClick={() => setShowSalaryForm(true)}
              className="flex items-center space-x-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <Plus className="h-6 w-6" />
              <span className="text-lg font-semibold">Add Income</span>
            </button>
          </div>
        </div>

        {/* Budget Status */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-green-100 text-sm">Monthly Income</span>
              <span className="text-white font-bold">${budgetSettings.monthlyIncome.toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-green-100 text-sm">Needs ({budgetSettings.needsPercentage}%)</span>
              <span className="text-white font-bold">${((budgetSettings.monthlyIncome * budgetSettings.needsPercentage) / 100).toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-green-100 text-sm">Wants ({budgetSettings.wantsPercentage}%)</span>
              <span className="text-white font-bold">${((budgetSettings.monthlyIncome * budgetSettings.wantsPercentage) / 100).toFixed(2)}</span>
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-green-100 text-sm">Savings ({budgetSettings.responsibilitiesPercentage}%)</span>
              <span className="text-white font-bold">${((budgetSettings.monthlyIncome * budgetSettings.responsibilitiesPercentage) / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Allocation Status */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {budgetSettings.allocationLocked ? (
              <>
                <Lock className="h-4 w-4 text-green-200" />
                <span className="text-green-200 text-sm">Budget allocations are locked</span>
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 text-amber-200" />
                <span className="text-amber-200 text-sm">Budget allocations can be modified</span>
              </>
            )}
          </div>
          <div className="text-green-100 text-sm">
            Total: {(budgetSettings.needsPercentage + budgetSettings.wantsPercentage + budgetSettings.responsibilitiesPercentage).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Income Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Salary Income</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Regular employment income with automatic FNPF deductions and tax calculations
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Weekly</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Bi-weekly</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Monthly</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">FNPF Auto-deduct</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Features:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Automatic FNPF calculations (8.5% employee + 8.5% employer)</li>
              <li>• Net salary calculation after deductions</li>
              <li>• Separate tracking of contributions</li>
              <li>• Integration with budget allocations</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-4">
            <Gift className="h-8 w-8 text-emerald-600" />
            <h3 className="text-xl font-semibold text-gray-900">Additional Income</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Freelance work, bonuses, gifts, and other income sources without FNPF deductions
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">Freelance</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">Bonus</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">Gift</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">No FNPF</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h4 className="font-medium text-emerald-900 mb-2">Features:</h4>
            <ul className="text-sm text-emerald-700 space-y-1">
              <li>• No automatic deductions</li>
              <li>• Flexible categorization</li>
              <li>• One-time or recurring income</li>
              <li>• Direct budget integration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Budget Allocation Guide */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Budget Allocation Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">50%</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Needs</h3>
            <p className="text-sm text-gray-600 mb-4">
              Essential expenses you can't avoid: rent, groceries, utilities, transportation, minimum debt payments.
            </p>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <p className="text-xs text-emerald-700">
                <strong>Examples:</strong> Housing, food, utilities, transport, insurance, FNPF contributions
              </p>
            </div>
          </div>

          <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-200">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">30%</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Wants</h3>
            <p className="text-sm text-gray-600 mb-4">
              Lifestyle choices: dining out, entertainment, hobbies, subscriptions, shopping for non-essentials.
            </p>
            <div className="bg-amber-100 p-3 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>Examples:</strong> Dining out, entertainment, kava sessions, shopping, subscriptions
              </p>
            </div>
          </div>

          <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">20%</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Savings</h3>
            <p className="text-sm text-gray-600 mb-4">
              Future you: emergency fund, retirement savings, investments, extra debt payments.
            </p>
            <div className="bg-blue-100 p-3 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Examples:</strong> Emergency fund, investments, extra FNPF, family support
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">💡 Pro Tip: Customize Your Allocations</h4>
          <p className="text-sm text-gray-600">
            The 50/30/20 rule is a starting point. Adjust percentages based on your lifestyle and goals. 
            If you have high rent, increase needs to 60% and reduce wants to 20%. The key is finding what works for your situation.
          </p>
        </div>
      </div>

      {/* FNPF Information */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">FNPF Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How FNPF Works</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  <strong>Employee Contribution:</strong> 8.5% of your gross salary is automatically deducted
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  <strong>Employer Contribution:</strong> Your employer adds another 8.5% (tracked separately)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <p className="text-sm text-gray-700">
                  <strong>Personal Contribution:</strong> Optional additional contribution you can set
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                Configure your FNPF deduction percentages in the budget settings above
              </p>
              <button
                onClick={() => setShowBudgetSettings(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Configure FNPF Settings →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Selection Info */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Wallet className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Account Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Available Accounts</h3>
            <div className="space-y-2">
              {wallets.filter(w => w.isActive).map(wallet => (
                <div key={wallet.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{wallet.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{wallet.type} account</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Account Selection</h3>
            <p className="text-sm text-gray-600 mb-4">
              When adding income, you'll choose which account receives the money. This helps you:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Track money across different accounts</li>
              <li>• Separate salary from additional income</li>
              <li>• Manage cash vs digital payments</li>
              <li>• Monitor account balances</li>
            </ul>
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