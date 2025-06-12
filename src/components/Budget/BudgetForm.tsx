import React, { useState } from 'react';
import { X, Target } from 'lucide-react';
import { Budget } from '../../types/finance';

interface BudgetFormProps {
  onClose: () => void;
  onSubmit: (budget: Omit<Budget, 'id' | 'categories'>) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    monthlyIncome: '',
    needsPercentage: 50,
    wantsPercentage: 30,
    responsibilitiesPercentage: 20,
    isActive: true
  });

  const totalPercentage = formData.needsPercentage + formData.wantsPercentage + formData.responsibilitiesPercentage;
  const isValidPercentage = totalPercentage === 100;

  const handlePercentageChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidPercentage) {
      alert('Percentages must total 100%');
      return;
    }

    onSubmit({
      name: formData.name,
      monthlyIncome: parseFloat(formData.monthlyIncome),
      needsPercentage: formData.needsPercentage,
      wantsPercentage: formData.wantsPercentage,
      responsibilitiesPercentage: formData.responsibilitiesPercentage,
      isActive: formData.isActive
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Create Budget Plan</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., Monthly Budget 2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Income (FJD)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Budget Allocation</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Needs</label>
                  <span className="text-sm text-gray-600">{formData.needsPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.needsPercentage}
                  onChange={(e) => handlePercentageChange('needsPercentage', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-emerald"
                />
                <p className="text-xs text-gray-500 mt-1">Essential expenses (housing, food, utilities)</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Wants</label>
                  <span className="text-sm text-gray-600">{formData.wantsPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.wantsPercentage}
                  onChange={(e) => handlePercentageChange('wantsPercentage', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-amber"
                />
                <p className="text-xs text-gray-500 mt-1">Entertainment, dining out, hobbies</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Responsibilities</label>
                  <span className="text-sm text-gray-600">{formData.responsibilitiesPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.responsibilitiesPercentage}
                  onChange={(e) => handlePercentageChange('responsibilitiesPercentage', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-sky"
                />
                <p className="text-xs text-gray-500 mt-1">Savings, investments, debt payments</p>
              </div>
            </div>

            <div className={`p-3 rounded-lg ${
              isValidPercentage ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-medium ${
                isValidPercentage ? 'text-emerald-800' : 'text-red-800'
              }`}>
                Total: {totalPercentage}%
                {!isValidPercentage && ' (Must equal 100%)'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Set as active budget
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
              disabled={!isValidPercentage}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;