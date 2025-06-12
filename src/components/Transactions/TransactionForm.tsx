import React, { useState } from 'react';
import { X, Receipt } from 'lucide-react';
import { Transaction } from '../../types/finance';
import { useFinanceData } from '../../hooks/useFinanceData';

interface TransactionFormProps {
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onSubmit }) => {
  const { wallets } = useFinanceData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'needs' as const,
    subcategory: '',
    description: '',
    sourceWallet: wallets[0]?.id || '',
    destinationWallet: '',
    type: 'expense' as const,
    receiptUrl: ''
  });

  const subcategories = {
    needs: ['Food & Groceries', 'Transportation', 'Utilities', 'Healthcare', 'Housing', 'Insurance'],
    wants: ['Entertainment', 'Dining Out', 'Shopping', 'Hobbies', 'Travel', 'Subscriptions'],
    responsibilities: ['Savings', 'Investments', 'Debt Payments', 'Emergency Fund', 'Retirement', 'Education']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      sourceWallet: formData.sourceWallet,
      destinationWallet: formData.type === 'transfer' ? formData.destinationWallet : undefined,
      type: formData.type,
      receiptUrl: formData.receiptUrl || undefined
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Transaction</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (FJD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          {formData.type !== 'transfer' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any, subcategory: '' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="needs">Needs</option>
                  <option value="wants">Wants</option>
                  <option value="responsibilities">Responsibilities</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  <option value="">Select subcategory</option>
                  {subcategories[formData.category].map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.type === 'income' ? 'Destination Wallet' : 'Source Wallet'}
            </label>
            <select
              value={formData.sourceWallet}
              onChange={(e) => setFormData({ ...formData, sourceWallet: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            >
              {wallets.filter(w => w.isActive).map(wallet => (
                <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
              ))}
            </select>
          </div>

          {formData.type === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination Wallet</label>
              <select
                value={formData.destinationWallet}
                onChange={(e) => setFormData({ ...formData, destinationWallet: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">Select destination</option>
                {wallets.filter(w => w.isActive && w.id !== formData.sourceWallet).map(wallet => (
                  <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Transaction description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receipt URL (Optional)</label>
            <div className="flex">
              <input
                type="url"
                value={formData.receiptUrl}
                onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="https://..."
              />
              <div className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md">
                <Receipt className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;