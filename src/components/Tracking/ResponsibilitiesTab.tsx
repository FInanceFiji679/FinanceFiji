import React, { useState } from 'react';
import { Plus, Receipt, Trash2, Shield, TrendingDown, Clock } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import BudgetHeader from '../Shared/BudgetHeader';
import TransactionForm from './TransactionForm';

const ResponsibilitiesTab: React.FC = () => {
  const { 
    responsibilitiesBudget, 
    responsibilitiesSpent, 
    responsibilitiesRemaining, 
    transactions,
    deleteTransaction,
    budgetSettings,
    fixedExpensesTotal
  } = useFinanceStore();

  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const responsibilitiesTransactions = transactions.filter(t => t.category === 'responsibilities');
  const totalAllocated = responsibilitiesBudget;
  const totalUsed = responsibilitiesSpent + fixedExpensesTotal;
  const progressPercentage = totalAllocated > 0 ? (totalUsed / totalAllocated) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Header with Budget Info */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-xl">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Responsibilities</h1>
              <p className="text-blue-100">Savings, investments, and obligations</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold mb-2">
              ${responsibilitiesRemaining.toFixed(2)}
            </div>
            <div className="text-blue-100">
              Remaining of ${totalAllocated.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-blue-100">Budget Progress</span>
            <span className="text-blue-100">{Math.round(progressPercentage)}% used</span>
          </div>
          <div className="w-full bg-blue-400/30 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progressPercentage > 100 ? 'bg-red-400' : 'bg-white'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          {progressPercentage > 100 && (
            <p className="text-red-200 text-sm mt-1">
              Over budget by ${(totalUsed - totalAllocated).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Fixed Expenses Section */}
      {budgetSettings.fixedExpenses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-800">Fixed Monthly Expenses</h2>
            </div>
            <p className="text-slate-600 mt-1">Automatically deducted each month</p>
          </div>
          
          <div className="divide-y divide-slate-200">
            {budgetSettings.fixedExpenses.map((expense) => (
              <div key={expense.id} className="p-6 bg-blue-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{expense.name}</h3>
                      <p className="text-sm text-slate-500">Fixed monthly expense</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-800">
                      ${expense.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-blue-600">Auto-deducted</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowTransactionForm(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
          {responsibilitiesTransactions.length > 0 ? (
            responsibilitiesTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <TrendingDown className="h-5 w-5 text-blue-600" />
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
              <Shield className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p>Start tracking your savings and investment expenses</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          category="responsibilities"
          onClose={() => setShowTransactionForm(false)}
        />
      )}
    </div>
  );
};

export default ResponsibilitiesTab;