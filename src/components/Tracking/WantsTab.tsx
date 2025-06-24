import React, { useState } from 'react';
import { Plus, Receipt, Trash2, ShoppingBag, TrendingDown } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import BudgetHeader from '../Shared/BudgetHeader';
import TransactionForm from './TransactionForm';

const WantsTab: React.FC = () => {
  const { 
    wantsBudget, 
    wantsSpent, 
    wantsRemaining, 
    transactions,
    deleteTransaction 
  } = useFinanceStore();

  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const wantsTransactions = transactions.filter(t => t.category === 'wants');
  const progressPercentage = wantsBudget > 0 ? (wantsSpent / wantsBudget) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Header with Budget Info */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-xl">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Wants</h1>
              <p className="text-amber-100">Entertainment and lifestyle expenses</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold mb-2">
              ${wantsRemaining.toFixed(2)}
            </div>
            <div className="text-amber-100">
              Remaining of ${wantsBudget.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-amber-100">Budget Progress</span>
            <span className="text-amber-100">{Math.round(progressPercentage)}% used</span>
          </div>
          <div className="w-full bg-amber-400/30 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progressPercentage > 100 ? 'bg-red-400' : 'bg-white'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          {progressPercentage > 100 && (
            <p className="text-red-200 text-sm mt-1">
              Over budget by ${(wantsSpent - wantsBudget).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowTransactionForm(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-6 w-6" />
          <span className="text-lg font-semibold">Add Transaction</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Recent Transactions</h2>
        </div>
        
        <div className="divide-y divide-slate-200">
          {wantsTransactions.length > 0 ? (
            wantsTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <TrendingDown className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{transaction.description}</h3>
                      <p className="text-sm text-slate-500">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-800">
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {transaction.receiptUrl && (
                        <a
                          href={transaction.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Receipt className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p>Start tracking your entertainment and lifestyle expenses</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          category="wants"
          onClose={() => setShowTransactionForm(false)}
        />
      )}
    </div>
  );
};

export default WantsTab;