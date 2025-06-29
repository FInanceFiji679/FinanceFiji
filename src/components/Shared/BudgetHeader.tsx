import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';

const BudgetHeader: React.FC = () => {
  const { 
    budgetSettings, 
    totalAllocated, 
    totalSpent, 
    remainingSalary,
    needsBudget,
    wantsBudget,
    responsibilitiesBudget
  } = useFinanceStore();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Monthly Income</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">
            ${budgetSettings.monthlyIncome.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Set in Settings</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Total Allocated</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-emerald-600">
            ${totalAllocated.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            N:{needsBudget.toFixed(0)} W:{wantsBudget.toFixed(0)} R:{responsibilitiesBudget.toFixed(0)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Current Spent</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-red-600">
            ${totalSpent.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Across all categories</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Remaining Balance</span>
          </div>
          <p className={`text-lg sm:text-2xl font-bold ${
            remainingSalary >= 0 ? 'text-purple-600' : 'text-red-600'
          }`}>
            ${remainingSalary.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {remainingSalary >= 0 ? 'Available' : 'Over budget'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetHeader;