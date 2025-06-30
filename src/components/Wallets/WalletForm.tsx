import React, { useState } from 'react';
import { X, Wallet } from 'lucide-react';
import { Wallet as WalletType } from '../../types/finance';

interface WalletFormProps {
  onClose: () => void;
  onSubmit: (wallet: Omit<WalletType, 'id'>) => void;
  editWallet?: WalletType;
}

const WalletForm: React.FC<WalletFormProps> = ({ onClose, onSubmit, editWallet }) => {
  const [formData, setFormData] = useState({
    name: editWallet?.name || '',
    type: editWallet?.type || 'bank' as const,
    balance: editWallet?.balance?.toString() || '0',
    minimumBalance: editWallet?.minimumBalance?.toString() || '0',
    currency: editWallet?.currency || 'FJD',
    isActive: editWallet?.isActive ?? true
  });

  const walletTypes = [
    { value: 'bank', label: 'Bank Account' },
    { value: 'mpaisa', label: 'MPAiSA Wallet' },
    { value: 'cash', label: 'Cash Wallet' },
    { value: 'savings', label: 'Savings Account' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      minimumBalance: parseFloat(formData.minimumBalance),
      currency: formData.currency,
      isActive: formData.isActive
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Wallet className="h-6 w-6 text-sky-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {editWallet ? 'Edit Wallet' : 'Add New Wallet'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., ANZ Current Account"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {walletTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Balance (FJD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Balance (FJD)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.minimumBalance}
                onChange={(e) => setFormData({ ...formData, minimumBalance: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="FJD">FJD - Fijian Dollar</option>
              <option value="USD">USD - US Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="NZD">NZD - New Zealand Dollar</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Active Wallet
            </label>
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
              {editWallet ? 'Update Wallet' : 'Add Wallet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalletForm;