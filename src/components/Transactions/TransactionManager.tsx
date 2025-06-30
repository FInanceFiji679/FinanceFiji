import React, { useState } from 'react';
import { Plus, Filter, Receipt, Trash2, Calendar } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import TransactionForm from './TransactionForm';

const TransactionManager: React.FC = () => {
  const { 
    transactions, 
    deleteTransaction,
    needsBudget,
    wantsBudget,
    responsibilitiesBudget,
    needsSpent,
    wantsSpent,
    responsibilitiesSpent
  } = useFinanceStore();

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const bankAccounts = [
    { id: 'anz', name: 'ANZ Bank' },
    { id: 'westpac', name: 'Westpac' },
    { id: 'bsp', name: 'BSP' },
    { id: 'mpaisa', name: 'MPaisa' },
    { id: 'cash', name: 'Cash' }
  ];

  const filteredTransactions = filterCategory === 'all' 
    ? transactions 
    : transactions.filter(t => t.category === filterCategory);

  const budgetData = [
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'needs': return 'bg-emerald-100 text-emerald-800';
      case 'wants': return 'bg-amber-100 text-amber-800';
      case 'responsibilities': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-2xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-slate-300">Track your spending</p>
          </div>
          <button
            onClick={() => setShowTransactionForm(true)}
            className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {budgetData.map((item) => (
          <div key={item.name} className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-1">{item.name}</h3>
            <p className="text-lg font-bold text-gray-900 mb-2">
              ${item.spent.toFixed(0)}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className={`h-2 rounded-full bg-${item.color}-500 transition-all`}
                style={{ width: `${Math.min(item.percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              ${item.budget.toFixed(0)} budget
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Filter className="h-5 w-5 text-gray-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="needs">Needs</option>
            <option value="wants">Wants</option>
            <option value="responsibilities">Savings</option>
          </select>
        </div>
      </div>

      {/* Add Transaction Button */}
      <div className="text-center mb-6">
        <button
          onClick={() => setShowTransactionForm(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg mx-auto"
        >
          <Plus className="h-6 w-6" />
          <span className="text-lg font-semibold">Add Transaction</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Transactions ({filteredTransactions.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                      <span className="text-lg font-bold text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                          {transaction.category}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {transaction.documentUrl && (
                          <a
                            href={transaction.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                          >
                            <Receipt className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Receipt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No transactions found</h3>
              <p>Add your first transaction to start tracking</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          bankAccounts={bankAccounts}
        />
      )}
    </div>
  );
};

export default TransactionManager;