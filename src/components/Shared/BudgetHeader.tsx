import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';

const BudgetHeader: React.FC = () => {
  const { budgetSettings, totalAllocated, totalSpent, remainingSalary } = useFinanceStore();

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Monthly Salary</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${budgetSettings.monthlyIncome.toFixed(2)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Total Allocated</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            ${totalAllocated.toFixed(2)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Current Spent</span>
          </div>
          <p className="text-2xl font-bold text-red-600">
            ${totalSpent.toFixed(2)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-600">Remaining Balance</span>
          </div>
          <p className={`text-2xl font-bold ${
            remainingSalary >= 0 ? 'text-purple-600' : 'text-red-600'
          }`}>
            ${remainingSalary.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetHeader;