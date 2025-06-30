import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Plus, ArrowRight } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { 
    budgetSettings, 
    needsBudget,
    wantsBudget,
    responsibilitiesBudget,
    needsSpent,
    wantsSpent,
    responsibilitiesSpent,
    remainingSalary,
    wantWalletBalance,
    bankBalance,
    transactions
  } = useFinanceStore();

  const recentTransactions = transactions.slice(0, 3);
  const monthlyIncome = budgetSettings.monthlyIncome;

  // Quick stats
  const stats = [
    {
      label: 'Income',
      value: monthlyIncome,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Remaining',
      value: remainingSalary,
      color: remainingSalary >= 0 ? 'text-blue-600' : 'text-red-600',
      bg: remainingSalary >= 0 ? 'bg-blue-50' : 'bg-red-50'
    },
    {
      label: 'Want Wallet',
      value: wantWalletBalance,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'Bank',
      value: bankBalance,
      color: bankBalance >= 0 ? 'text-indigo-600' : 'text-red-600',
      bg: bankBalance >= 0 ? 'bg-indigo-50' : 'bg-red-50'
    }
  ];

  const budgetItems = [
    {
      name: 'Needs',
      spent: needsSpent,
      budget: needsBudget,
      color: 'emerald',
      percentage: needsBudget > 0 ? (needsSpent / needsBudget) * 100 : 0
    },
    {
      name: 'Wants',
      spent: wantsSpent,
      budget: wantsBudget,
      color: 'amber',
      percentage: wantsBudget > 0 ? (wantsSpent / wantsBudget) * 100 : 0
    },
    {
      name: 'Savings',
      spent: responsibilitiesSpent,
      budget: responsibilitiesBudget,
      color: 'blue',
      percentage: responsibilitiesBudget > 0 ? (responsibilitiesSpent / responsibilitiesBudget) * 100 : 0
    }
  ];

  return (
    <div className="pb-20 md:pb-0">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-blue-100">Here's your financial overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bg} p-4 rounded-xl`}>
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>
              ${stat.value.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Progress</h2>
        <div className="space-y-4">
          {budgetItems.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
                <span className="text-sm text-gray-600">
                  ${item.spent.toFixed(0)} / ${item.budget.toFixed(0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full bg-${item.color}-500 transition-all`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate?.('income')}
            className="flex items-center justify-center space-x-2 p-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Income</span>
          </button>
          <button
            onClick={() => onNavigate?.('transactions')}
            className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Expense</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <button
            onClick={() => onNavigate?.('transactions')}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
          >
            <span className="text-sm font-medium">View All</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.category === 'needs' ? 'bg-emerald-100' :
                    transaction.category === 'wants' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    <TrendingDown className={`h-4 w-4 ${
                      transaction.category === 'needs' ? 'text-emerald-600' :
                      transaction.category === 'wants' ? 'text-amber-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">${transaction.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No transactions yet</p>
            <button
              onClick={() => onNavigate?.('transactions')}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first transaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;