import React, { useState } from 'react';
import { X, DollarSign, FileText, Receipt } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';

interface TransactionFormProps {
  category: 'needs' | 'wants' | 'responsibilities';
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ category, onClose }) => {
  const { addTransaction } = useFinanceStore();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    receiptUrl: ''
  });

  const getCategoryInfo = () => {
    switch (category) {
      case 'needs':
        return {
          title: 'Add Needs Transaction',
          color: 'emerald',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          buttonColor: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
        };
      case 'wants':
        return {
          title: 'Add Wants Transaction',
          color: 'amber',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          buttonColor: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
        };
      case 'responsibilities':
        return {
          title: 'Add Responsibilities Transaction',
          color: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          buttonColor: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
        };
    }
  };

  const categoryInfo = getCategoryInfo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      return;
    }

    addTransaction({
      amount: parseFloat(formData.amount),
      description: formData.description,
      category,
      receiptUrl: formData.receiptUrl || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className={`${categoryInfo.bgColor} ${categoryInfo.borderColor} border-b px-6 py-4 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">{categoryInfo.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="What did you spend on?"
                required
              />
            </div>
          </div>

          {/* Receipt URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Receipt URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Receipt className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="url"
                value={formData.receiptUrl}
                onChange={(e) => setFormData({ ...formData, receiptUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="https://..."
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Link to receipt image or document
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 bg-gradient-to-r ${categoryInfo.buttonColor} text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl`}
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