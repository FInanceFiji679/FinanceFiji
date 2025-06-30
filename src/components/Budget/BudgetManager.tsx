import React, { useState } from 'react';
import { Plus, Target, TrendingUp, AlertCircle } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { calculateMonthlySpending, formatCurrency } from '../../utils/calculations';
import BudgetForm from './BudgetForm';
import BudgetProgress from '../Dashboard/BudgetProgress';

const BudgetManager: React.FC = () => {
  const { budgets, transactions, addBudget } = useFinanceData();
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const activeBudget = budgets.find(b => b.isActive);
  const totalMonthlySpending = calculateMonthlySpending(transactions);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Budget Planning</h2>
        <button
          onClick={() => setShowBudgetForm(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </button>
      </div>

      {activeBudget ? (
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(activeBudget.monthlyIncome)}</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spending</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalMonthlySpending)}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <Target className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Remaining</p>
                  <p className={`text-2xl font-bold mt-1 ${
                    activeBudget.monthlyIncome - totalMonthlySpending >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(activeBudget.monthlyIncome - totalMonthlySpending)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-sky-100 text-sky-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Needs</h4>
                    <p className="text-sm text-gray-600">{activeBudget.needsPercentage}% of income</p>
                  </div>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatCurrency(activeBudget.monthlyIncome * (activeBudget.needsPercentage / 100))}
                  </p>
                </div>

                <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Wants</h4>
                    <p className="text-sm text-gray-600">{activeBudget.wantsPercentage}% of income</p>
                  </div>
                  <p className="text-xl font-bold text-amber-600">
                    {formatCurrency(activeBudget.monthlyIncome * (activeBudget.wantsPercentage / 100))}
                  </p>
                </div>

                <div className="flex justify-between items-center p-4 bg-sky-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Responsibilities</h4>
                    <p className="text-sm text-gray-600">{activeBudget.responsibilitiesPercentage}% of income</p>
                  </div>
                  <p className="text-xl font-bold text-sky-600">
                    {formatCurrency(activeBudget.monthlyIncome * (activeBudget.responsibilitiesPercentage / 100))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress This Month</h3>
              <BudgetProgress budget={activeBudget} transactions={transactions} />
            </div>
          </div>

          {/* Budget Tips */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Tips & Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">50/30/20 Rule</h4>
                <p className="text-sm text-blue-700">
                  A popular budgeting method: 50% needs, 30% wants, 20% savings and debt repayment.
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <h4 className="font-medium text-emerald-900 mb-2">Emergency Fund</h4>
                <p className="text-sm text-emerald-700">
                  Aim to save 3-6 months of expenses in your emergency fund for financial security.
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-medium text-amber-900 mb-2">Track Regularly</h4>
                <p className="text-sm text-amber-700">
                  Review your budget weekly to stay on track and make adjustments as needed.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">FNPF Contributions</h4>
                <p className="text-sm text-purple-700">
                  Your FNPF contributions (16% total) are automatically building your retirement savings.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Target className="h-16 w-16 mx-auto mb-6 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Active Budget</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create a budget plan to track your spending and achieve your financial goals. 
            Use the 50/30/20 rule as a starting point.
          </p>
          <button
            onClick={() => setShowBudgetForm(true)}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Budget
          </button>
        </div>
      )}

      {/* All Budgets */}
      {budgets.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Budget Plans</h3>
          <div className="space-y-3">
            {budgets.map((budget) => (
              <div key={budget.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{budget.name}</h4>
                  <p className="text-sm text-gray-600">
                    Income: {formatCurrency(budget.monthlyIncome)} | 
                    Needs: {budget.needsPercentage}% | 
                    Wants: {budget.wantsPercentage}% | 
                    Responsibilities: {budget.responsibilitiesPercentage}%
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  budget.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {budget.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBudgetForm && (
        <BudgetForm
          onClose={() => setShowBudgetForm(false)}
          onSubmit={addBudget}
        />
      )}
    </div>
  );
};

export default BudgetManager;