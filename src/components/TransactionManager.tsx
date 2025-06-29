import React, { useState } from 'react';
import { Plus, Trash2, FileText, Calendar, DollarSign, Building2, Smartphone } from 'lucide-react';
import { useFinanceStore } from '../hooks/useFinanceStore';
import TransactionForm from './TransactionForm';

const TransactionManager: React.FC = () => {
  const { transactions, deleteTransaction } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);

  const getBankIcon = (bankId: string) => {
    if (bankId === 'mpaisa') {
      return <Smartphone className="h-5 w-5 text-purple-600" />;
    }
    return <Building2 className="h-5 w-5 text-blue-600" />;
  };

  const getCategoryColor = (category: string) => {
    return category === 'need' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Manage your income and expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <p className="text-gray-600 mt-1">Total: {transactions.length} transactions</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 rounded-xl">
                      {getBankIcon(transaction.bankAccount)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(transaction.category)}`}>
                          {transaction.category === 'need' ? 'Need' : 'Want'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {transaction.bankAccount === 'mpaisa' ? 'MPaisa' : 
                           transaction.bankAccount.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {transaction.supportingDocument && (
                        <a
                          href={transaction.supportingDocument}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View supporting document"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p>Start by adding your first transaction</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first transaction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default TransactionManager;