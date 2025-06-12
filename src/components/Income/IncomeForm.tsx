import React, { useState } from 'react';
import { X } from 'lucide-react';
import { IncomeSource } from '../../types/finance';
import { useFinanceData } from '../../hooks/useFinanceData';

interface IncomeFormProps {
  onClose: () => void;
  onSubmit: (income: Omit<IncomeSource, 'id'>) => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ onClose, onSubmit }) => {
  const { wallets } = useFinanceData();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as const,
    destinationWallet: wallets[0]?.id || '',
    fnpfEligible: true,
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name: formData.name,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      destinationWallet: formData.destinationWallet,
      fnpfEligible: formData.fnpfEligible,
      isActive: formData.isActive
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Income Source</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Income Source Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., Main Job, Freelance Work"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (FJD)
            </label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination Wallet
            </label>
            <select
              value={formData.destinationWallet}
              onChange={(e) => setFormData({ ...formData, destinationWallet: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            >
              {wallets.map(wallet => (
                <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="fnpfEligible"
              checked={formData.fnpfEligible}
              onChange={(e) => setFormData({ ...formData, fnpfEligible: e.target.checked })}
              className="rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            <label htmlFor="fnpfEligible" className="text-sm text-gray-700">
              FNPF Eligible (8% contribution applies)
            </label>
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
              Active Income Source
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
              Add Income Source
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;