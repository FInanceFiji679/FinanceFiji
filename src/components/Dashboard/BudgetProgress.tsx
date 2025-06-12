import React from 'react';
import { Budget, Transaction } from '../../types/finance';
import { calculateMonthlySpending, formatCurrency } from '../../utils/calculations';

interface BudgetProgressProps {
  budget: Budget;
  transactions: Transaction[];
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budget, transactions }) => {
  const needsSpent = calculateMonthlySpending(transactions, 'needs');
  const wantsSpent = calculateMonthlySpending(transactions, 'wants');
  const responsibilitiesSpent = calculateMonthlySpending(transactions, 'responsibilities');

  const needsBudget = budget.monthlyIncome * (budget.needsPercentage / 100);
  const wantsBudget = budget.monthlyIncome * (budget.wantsPercentage / 100);
  const responsibilitiesBudget = budget.monthlyIncome * (budget.responsibilitiesPercentage / 100);

  const categories = [
    {
      name: 'Needs',
      spent: needsSpent,
      budget: needsBudget,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      percentage: budget.needsPercentage
    },
    {
      name: 'Wants',
      spent: wantsSpent,
      budget: wantsBudget,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50',
      percentage: budget.wantsPercentage
    },
    {
      name: 'Responsibilities',
      spent: responsibilitiesSpent,
      budget: responsibilitiesBudget,
      color: 'bg-sky-500',
      bgColor: 'bg-sky-50',
      percentage: budget.responsibilitiesPercentage
    }
  ];

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const progress = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
        const isOverBudget = progress > 100;
        
        return (
          <div key={category.name} className={`p-4 rounded-lg ${category.bgColor}`}>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.percentage}% of income</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(category.spent)} / {formatCurrency(category.budget)}
                </p>
                <p className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                  {Math.round(progress)}% used
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isOverBudget ? 'bg-red-500' : category.color
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            {isOverBudget && (
              <p className="text-xs text-red-600 mt-1">
                Over budget by {formatCurrency(category.spent - category.budget)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BudgetProgress;