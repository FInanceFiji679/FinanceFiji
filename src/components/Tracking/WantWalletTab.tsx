import React from 'react';
import { PiggyBank, TrendingUp, TrendingDown, Calendar, Sparkles } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import BudgetHeader from '../Shared/BudgetHeader';

const WantWalletTab: React.FC = () => {
  const { wantWalletBalance, wantWalletTransactions } = useFinanceStore();

  const totalAccumulated = wantWalletTransactions
    .filter(t => t.type === 'accumulation')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = wantWalletTransactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Want Wallet Header */}
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl shadow-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-xl">
              <PiggyBank className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Want Wallet</h1>
              <p className="text-pink-100">Your accumulated unspent wants money</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-5xl font-bold mb-2">
              ${wantWalletBalance.toFixed(2)}
            </div>
            <div className="text-pink-100">
              Available Balance
            </div>
          </div>
        </div>

        {/* Sparkle Animation */}
        <div className="mt-6 flex items-center justify-center space-x-2">
          <Sparkles className="h-5 w-5 text-pink-200 animate-pulse" />
          <span className="text-pink-100 text-sm">
            Money saved from unspent wants budget
          </span>
          <Sparkles className="h-5 w-5 text-pink-200 animate-pulse" />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Accumulated</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">${totalAccumulated.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">From unspent wants budget</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Withdrawn</h3>
          </div>
          <p className="text-3xl font-bold text-red-600">${totalWithdrawn.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">For overspend coverage</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <PiggyBank className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Net Savings</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">${(totalAccumulated - totalWithdrawn).toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Total saved amount</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Transaction History</h2>
          <p className="text-slate-600 mt-1">All want wallet activity</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {wantWalletTransactions.length > 0 ? (
            wantWalletTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      transaction.type === 'accumulation' 
                        ? 'bg-emerald-100' 
                        : 'bg-red-100'
                    }`}>
                      {transaction.type === 'accumulation' ? (
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{transaction.description}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <p className="text-sm text-slate-500">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        {transaction.fromMonth && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {transaction.fromMonth}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      transaction.type === 'accumulation' 
                        ? 'text-emerald-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'accumulation' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <div className={`text-sm ${
                      transaction.type === 'accumulation' 
                        ? 'text-emerald-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'accumulation' ? 'Added' : 'Withdrawn'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <PiggyBank className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p>Your want wallet will accumulate money from unspent wants budget</p>
              <p className="text-sm mt-2">Complete a month with unspent wants money to see it here!</p>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">How Your Want Wallet Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg mt-1">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Automatic Accumulation</h4>
                <p className="text-sm text-gray-600">
                  At month-end, any unspent money from your wants budget automatically transfers here.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg mt-1">
                <PiggyBank className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Persistent Savings</h4>
                <p className="text-sm text-gray-600">
                  Your want wallet balance never resets - it keeps growing with your savings discipline.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-red-100 rounded-lg mt-1">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Overspend Protection</h4>
                <p className="text-sm text-gray-600">
                  When you exceed your wants budget, the overage is automatically deducted from here.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg mt-1">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Guilt-Free Spending</h4>
                <p className="text-sm text-gray-600">
                  Use this balance for special purchases without affecting your monthly budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WantWalletTab;