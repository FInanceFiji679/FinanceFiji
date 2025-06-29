import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';

const BudgetHeader: React.FC = () => {
  const { 
    budgetSettings, 
    totalAllocated, 
    totalSpent, 
    remainingSalary,
    needsBudget,
    wantsBudget,
    responsibilitiesBudget,
    needsSpent,
    wantsSpent,
    responsibilitiesSpent,
    fixedExpensesTotal
  } = useFinanceStore();

  // Calculate budget health indicators
  const isOverBudget = remainingSalary < 0;
  const budgetUtilization = budgetSettings.monthlyIncome > 0 ? 
    ((totalSpent + fixedExpensesTotal) / budgetSettings.monthlyIncome) * 100 : 0;

  const getBudgetStatus = () => {
    if (budgetSettings.monthlyIncome === 0) return { status: 'setup', color: 'gray', message: 'Set up your income' };
    if (isOverBudget) return { status: 'over', color: 'red', message: 'Over budget' };
    if (budgetUtilization > 90) return { status: 'warning', color: 'amber', message: 'Near budget limit' };
    if (budgetUtilization > 75) return { status: 'caution', color: 'yellow', message: 'Monitor spending' };
    return { status: 'good', color: 'emerald', message: 'On track' };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8">
      {/* Status Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {budgetStatus.status === 'good' && <CheckCircle className="h-5 w-5 text-emerald-600" />}
          {budgetStatus.status === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-600" />}
          {budgetStatus.status === 'over' && <AlertTriangle className="h-5 w-5 text-red-600" />}
          <span className={`text-sm font-medium text-${budgetStatus.color}-600`}>
            {budgetStatus.message}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {budgetUtilization.toFixed(1)}% of income used
        </div>
      </div>

      {/* Main Budget Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm font-medium text-gray-600">Monthly Income</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gray-900">
            ${budgetSettings.monthlyIncome.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Set in Income tab</p>
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
            N:${needsBudget.toFixed(0)} W:${wantsBudget.toFixed(0)} S:${responsibilitiesBudget.toFixed(0)}
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
          <p className="text-xs text-gray-500">
            N:${needsSpent.toFixed(0)} W:${wantsSpent.toFixed(0)} S:${responsibilitiesSpent.toFixed(0)}
          </p>
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

      {/* Detailed Breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Fixed Expenses:</span>
            <span className="font-medium">${fixedExpensesTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Variable Spending:</span>
            <span className="font-medium">${totalSpent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Outgoing:</span>
            <span className="font-medium">${(totalSpent + fixedExpensesTotal).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Budget Allocation Percentages */}
      {budgetSettings.monthlyIncome > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Budget Allocation: {budgetSettings.needsPercentage}% Needs | {budgetSettings.wantsPercentage}% Wants | {budgetSettings.responsibilitiesPercentage}% Savings
            {budgetSettings.allocationLocked && (
              <span className="ml-2 text-emerald-600">🔒 Locked</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetHeader;