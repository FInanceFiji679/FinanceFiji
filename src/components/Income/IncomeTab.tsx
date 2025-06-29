import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, Building2, User, Gift, Calendar, Wallet } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import { useFinanceData } from '../../hooks/useFinanceData';
import BudgetHeader from '../Shared/BudgetHeader';
import SalaryInputForm from './SalaryInputForm';

const IncomeTab: React.FC = () => {
  const { addTransaction } = useFinanceStore();
  const { wallets } = useFinanceData();
  const [showSalaryForm, setShowSalaryForm] = useState(false);

  const handleIncomeSubmit = (incomeData: any) => {
    if (incomeData.type === 'salary') {
      // Add the net salary as income
      addTransaction({
        amount: incomeData.fnpfDeductions.netAmount,
        description: `Salary (Net) - ${incomeData.source}`,
        category: 'needs' // Income transactions for budget tracking
      });

      // Add FNPF deductions as responsibility transactions
      if (incomeData.fnpfDeductions.employeeDeduction > 0) {
        addTransaction({
          amount: incomeData.fnpfDeductions.employeeDeduction,
          description: `FNPF Employee Contribution - ${incomeData.source}`,
          category: 'responsibilities'
        });
      }

      if (incomeData.fnpfDeductions.personalDeduction > 0) {
        addTransaction({
          amount: incomeData.fnpfDeductions.personalDeduction,
          description: `FNPF Personal Contribution - ${incomeData.source}`,
          category: 'responsibilities'
        });
      }
    } else {
      // Add other income
      addTransaction({
        amount: incomeData.amount,
        description: `${incomeData.name} - ${incomeData.source || incomeData.category}`,
        category: 'needs' // Other income for budget tracking
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
              <h1 className="text-3xl font-bold">Income Management</h1>
              <p className="text-green-100">Record your salary and additional income sources</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowSalaryForm(true)}
            className="flex items-center space-x-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            <Plus className="h-6 w-6" />
            <span className="text-lg font-semibold">Add Income</span>
          </button>
        </div>

        {/* Income Type Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="h-8 w-8 text-white" />
              <h3 className="text-xl font-semibold">Salary Income</h3>
            </div>
            <p className="text-green-100 mb-4">
              Regular employment income with automatic FNPF deductions and tax calculations
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Weekly</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Bi-weekly</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Monthly</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">FNPF Auto-deduct</span>
            </div>
          </div>
          
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Gift className="h-8 w-8 text-white" />
              <h3 className="text-xl font-semibold">Additional Income</h3>
            </div>
            <p className="text-green-100 mb-4">
              Freelance work, bonuses, gifts, and other income sources without FNPF deductions
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Freelance</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Bonus</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Gift</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full">No FNPF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">How Income Tracking Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">1</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Add Your Income</h3>
            <p className="text-sm text-gray-600">
              Record your salary or additional income. FNPF deductions are automatically calculated for salary.
            </p>
          </div>

          <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">2</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Automatic Processing</h3>
            <p className="text-sm text-gray-600">
              Net income goes to your selected wallet. FNPF contributions are tracked separately.
            </p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">3</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Budget Integration</h3>
            <p className="text-sm text-gray-600">
              Your income is automatically integrated with your budget tracking and spending categories.
            </p>
          </div>
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
                Configure your FNPF deduction percentages in Settings → Financial Config
              </p>
              <button
                onClick={() => window.location.hash = '#settings'}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Go to FNPF Settings →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Selection Info */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Wallet className="h-6 w-6 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Wallet Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Available Wallets</h3>
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
            <h3 className="font-semibold text-gray-900 mb-3">Wallet Selection</h3>
            <p className="text-sm text-gray-600 mb-4">
              When adding income, you'll choose which wallet receives the money. This helps you:
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

      {/* Salary Input Form Modal */}
      {showSalaryForm && (
        <SalaryInputForm
          onClose={() => setShowSalaryForm(false)}
          onSubmit={handleIncomeSubmit}
        />
      )}
    </div>
  );
};

export default IncomeTab;