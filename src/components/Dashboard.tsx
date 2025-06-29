import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '../hooks/useFinanceStore';

const Dashboard: React.FC = () => {
  const {
    monthlyIncome,
    allocations,
    needsSpent,
    wantsSpent,
    totalSpent,
    needsAllocated,
    wantsAllocated,
    savingsAllocated,
    needsRemaining,
    wantsRemaining,
    actualSavings,
    transactions
  } = useFinanceStore();

  const needsProgress = needsAllocated > 0 ? (needsSpent / needsAllocated) * 100 : 0;
  const wantsProgress = wantsAllocated > 0 ? (wantsSpent / wantsAllocated) * 100 : 0;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Income</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">${monthlyIncome.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">${totalSpent.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <PiggyBank className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Actual Savings</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">${actualSavings.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Transactions</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">{transactions.length}</p>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Progress</h2>
          
          <div className="space-y-6">
            {/* Needs Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-emerald-800">Needs</h3>
                  <p className="text-sm text-emerald-600">{allocations.needs}% allocation</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-700">${needsSpent.toFixed(2)}</p>
                  <p className="text-sm text-emerald-600">of ${needsAllocated.toFixed(2)}</p>
                </div>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    needsProgress > 100 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(needsProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600">{needsProgress.toFixed(1)}% used</span>
                <span className={`font-medium ${needsRemaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  ${Math.abs(needsRemaining).toFixed(2)} {needsRemaining >= 0 ? 'remaining' : 'over budget'}
                </span>
              </div>
            </div>

            {/* Wants Progress */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-amber-800">Wants</h3>
                  <p className="text-sm text-amber-600">{allocations.wants}% allocation</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-700">${wantsSpent.toFixed(2)}</p>
                  <p className="text-sm text-amber-600">of ${wantsAllocated.toFixed(2)}</p>
                </div>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    wantsProgress > 100 ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(wantsProgress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-600">{wantsProgress.toFixed(1)}% used</span>
                <span className={`font-medium ${wantsRemaining >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                  ${Math.abs(wantsRemaining).toFixed(2)} {wantsRemaining >= 0 ? 'remaining' : 'over budget'}
                </span>
              </div>
            </div>

            {/* Savings */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-blue-800">Savings</h3>
                  <p className="text-sm text-blue-600">{allocations.savings}% allocation</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-700">${actualSavings.toFixed(2)}</p>
                  <p className="text-sm text-blue-600">actual savings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
          
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.category === 'need' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {transaction.category === 'need' ? 'Need' : 'Want'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${transaction.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions yet</p>
              <p className="text-sm">Add your first transaction to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Allocation Summary */}
      {monthlyIncome > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Allocation Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="font-semibold text-emerald-800 mb-2">Needs ({allocations.needs}%)</h3>
              <p className="text-2xl font-bold text-emerald-700">${needsAllocated.toFixed(2)}</p>
              <p className="text-sm text-emerald-600 mt-1">Essential expenses</p>
            </div>
            
            <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-2">Wants ({allocations.wants}%)</h3>
              <p className="text-2xl font-bold text-amber-700">${wantsAllocated.toFixed(2)}</p>
              <p className="text-sm text-amber-600 mt-1">Lifestyle expenses</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Savings ({allocations.savings}%)</h3>
              <p className="text-2xl font-bold text-blue-700">${savingsAllocated.toFixed(2)}</p>
              <p className="text-sm text-blue-600 mt-1">Future goals</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;