import React, { useState } from 'react';
import { Plus, Receipt, Trash2, Heart, TrendingDown, DollarSign } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import BudgetHeader from '../Shared/BudgetHeader';
import TransactionForm from './TransactionForm';
import SalaryInputForm from '../Income/SalaryInputForm';

const NeedsTab: React.FC = () => {
  const { 
    needsBudget, 
    needsSpent, 
    needsRemaining, 
    transactions,
    deleteTransaction,
    addTransaction 
  } = useFinanceStore();

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showSalaryForm, setShowSalaryForm] = useState(false);

  const needsTransactions = transactions.filter(t => t.category === 'needs');
  const progressPercentage = needsBudget > 0 ? (needsSpent / needsBudget) * 100 : 0;

  const handleSalarySubmit = (salaryData: any) => {
    if (salaryData.type === 'salary') {
      // Add the net salary as income
      addTransaction({
        amount: salaryData.fnpfDeductions.netAmount,
        description: `Salary (Net) - ${salaryData.source}`,
        category: 'needs' // Income transactions for budget tracking
      });

      // Add FNPF deductions as responsibility transactions
      if (salaryData.fnpfDeductions.employeeDeduction > 0) {
        addTransaction({
          amount: salaryData.fnpfDeductions.employeeDeduction,
          description: `FNPF Employee Contribution - ${salaryData.source}`,
          category: 'responsibilities'
        });
      }

      if (salaryData.fnpfDeductions.personalDeduction > 0) {
        addTransaction({
          amount: salaryData.fnpfDeductions.personalDeduction,
          description: `FNPF Personal Contribution - ${salaryData.source}`,
          category: 'responsibilities'
        });
      }
    } else {
      // Add other income
      addTransaction({
        amount: salaryData.amount,
        description: `${salaryData.name} - ${salaryData.source || salaryData.category}`,
        category: 'needs' // Other income for budget tracking
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Salary Input Section */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Income Entry</h2>
              <p className="text-emerald-100">Record your salary and additional income first</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowSalaryForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add Income</span>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Salary</h3>
            <p className="text-sm text-emerald-100">Regular employment income with automatic FNPF deductions</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Weekly</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Bi-weekly</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Monthly</span>
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Other Income</h3>
            <p className="text-sm text-emerald-100">Freelance work, bonuses, gifts, and additional income sources</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Freelance</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Bonus</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">Gift</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Budget Info */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-xl">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Needs</h1>
              <p className="text-emerald-100">Essential expenses and necessities</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold mb-2">
              ${needsRemaining.toFixed(2)}
            </div>
            <div className="text-emerald-100">
              Remaining of ${needsBudget.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-emerald-100">Budget Progress</span>
            <span className="text-emerald-100">{Math.round(progressPercentage)}% used</span>
          </div>
          <div className="w-full bg-emerald-400/30 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progressPercentage > 100 ? 'bg-red-400' : 'bg-white'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          {progressPercentage > 100 && (
            <p className="text-red-200 text-sm mt-1">
              Over budget by ${(needsSpent - needsBudget).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowTransactionForm(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-6 w-6" />
          <span className="text-lg font-semibold">Add Expense</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Recent Transactions</h2>
        </div>
        
        <div className="divide-y divide-slate-200">
          {needsTransactions.length > 0 ? (
            needsTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <TrendingDown className="h-5 w-5 text-emerald-600" />
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
              <Heart className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p>Start by adding your salary, then track your essential expenses</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          category="needs"
          onClose={() => setShowTransactionForm(false)}
        />
      )}

      {/* Salary Input Form Modal */}
      {showSalaryForm && (
        <SalaryInputForm
          onClose={() => setShowSalaryForm(false)}
          onSubmit={handleSalarySubmit}
        />
      )}
    </div>
  );
};

export default NeedsTab;