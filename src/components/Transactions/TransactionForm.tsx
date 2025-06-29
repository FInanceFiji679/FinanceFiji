import React, { useState } from 'react';
import { X, DollarSign, FileText, Calendar, Building2, Smartphone, Wallet, Upload } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';

interface BankAccount {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface TransactionFormProps {
  onClose: () => void;
  bankAccounts: BankAccount[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, bankAccounts }) => {
  const { addTransaction } = useFinanceStore();
  
  const [formData, setFormData] = useState({
    amount: '',
    category: 'needs' as 'needs' | 'wants' | 'responsibilities',
    account: bankAccounts[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    documentUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.account) {
      newErrors.account = 'Please select an account';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    addTransaction({
      amount: parseFloat(formData.amount),
      category: formData.category,
      account: formData.account,
      date: formData.date,
      description: formData.description.trim(),
      documentUrl: formData.documentUrl.trim() || undefined
    });

    onClose();
  };

  const getAccountInfo = (accountId: string) => {
    return bankAccounts.find(acc => acc.id === accountId) || bankAccounts[0];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'needs':
        return 'from-emerald-500 to-emerald-600';
      case 'wants':
        return 'from-amber-500 to-amber-600';
      case 'responsibilities':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getCategoryColor(formData.category)} text-white p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Add New Transaction</h2>
                <p className="text-white/80">Record your financial activity</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (FJD) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0.00"
                required
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'needs', label: 'Needs', description: 'Essential expenses', color: 'emerald' },
                { id: 'wants', label: 'Wants', description: 'Lifestyle choices', color: 'amber' },
                { id: 'responsibilities', label: 'Savings', description: 'Future planning', color: 'blue' }
              ].map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.id as any })}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.category === category.id
                      ? `border-${category.color}-500 bg-${category.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`font-medium ${
                    formData.category === category.id ? `text-${category.color}-700` : 'text-gray-900'
                  }`}>
                    {category.label}
                  </div>
                  <div className={`text-xs ${
                    formData.category === category.id ? `text-${category.color}-600` : 'text-gray-500'
                  }`}>
                    {category.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Account Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {bankAccounts.map((account) => {
                const AccountIcon = account.icon;
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, account: account.id })}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.account === account.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <AccountIcon className={`h-5 w-5 ${
                        formData.account === account.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <span className={`font-medium text-sm ${
                        formData.account === account.id ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {account.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.account && (
              <p className="text-red-500 text-sm mt-1">{errors.account}</p>
            )}
          </div>

          {/* Date and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="What was this transaction for?"
                  required
                />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Supporting Document */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Document (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                value={formData.documentUrl}
                onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="https://... (receipt, invoice, etc.)"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Link to receipt, invoice, or other supporting document
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${getCategoryColor(formData.category)} text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium`}
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