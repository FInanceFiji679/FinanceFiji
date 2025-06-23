import React, { useState } from 'react';
import { Save, Plus, Trash2, DollarSign, Percent, Calculator } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';

const SettingsTab: React.FC = () => {
  const { 
    budgetSettings, 
    updateBudgetSettings, 
    addFixedExpense, 
    deleteFixedExpense,
    resetMonth 
  } = useFinanceStore();

  const [formData, setFormData] = useState({
    monthlyIncome: budgetSettings.monthlyIncome.toString(),
    needsPercentage: budgetSettings.needsPercentage.toString(),
    wantsPercentage: budgetSettings.wantsPercentage.toString(),
    responsibilitiesPercentage: budgetSettings.responsibilitiesPercentage.toString()
  });

  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handlePercentageChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    let newFormData = { ...formData, [field]: value };

    // Auto-adjust other percentages to maintain 100% total
    if (field === 'needsPercentage') {
      const remaining = 100 - numValue;
      const wantsRatio = parseFloat(formData.wantsPercentage) / (parseFloat(formData.wantsPercentage) + parseFloat(formData.responsibilitiesPercentage)) || 0.5;
      newFormData.wantsPercentage = Math.round(remaining * wantsRatio).toString();
      newFormData.responsibilitiesPercentage = (remaining - Math.round(remaining * wantsRatio)).toString();
    } else if (field === 'wantsPercentage') {
      const remaining = 100 - parseFloat(formData.needsPercentage);
      const adjustedValue = Math.min(numValue, remaining);
      newFormData.wantsPercentage = adjustedValue.toString();
      newFormData.responsibilitiesPercentage = (remaining - adjustedValue).toString();
    } else if (field === 'responsibilitiesPercentage') {
      const remaining = 100 - parseFloat(formData.needsPercentage);
      const adjustedValue = Math.min(numValue, remaining);
      newFormData.responsibilitiesPercentage = adjustedValue.toString();
      newFormData.wantsPercentage = (remaining - adjustedValue).toString();
    }

    setFormData(newFormData);
  };

  const handleSave = () => {
    updateBudgetSettings({
      monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
      needsPercentage: parseFloat(formData.needsPercentage) || 0,
      wantsPercentage: parseFloat(formData.wantsPercentage) || 0,
      responsibilitiesPercentage: parseFloat(formData.responsibilitiesPercentage) || 0
    });
  };

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount) {
      addFixedExpense({
        name: newExpense.name,
        amount: parseFloat(newExpense.amount)
      });
      setNewExpense({ name: '', amount: '' });
    }
  };

  const totalPercentage = parseFloat(formData.needsPercentage) + parseFloat(formData.wantsPercentage) + parseFloat(formData.responsibilitiesPercentage);
  const isValidPercentage = Math.abs(totalPercentage - 100) < 0.1;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Budget Settings</h1>
        <p className="text-slate-600">Configure your monthly income and budget allocations</p>
      </div>

      {/* Monthly Income */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Monthly Income</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Total Monthly Salary/Income
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Percent className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Budget Allocation</h2>
        </div>

        <div className="space-y-6">
          {/* Needs */}
          <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-800">Needs</h3>
                <p className="text-sm text-emerald-600">Essential expenses (housing, food, utilities)</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.needsPercentage}
                    onChange={(e) => handlePercentageChange('needsPercentage', e.target.value)}
                    className="w-20 px-3 py-2 text-center border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-emerald-700 font-medium">%</span>
                </div>
                <p className="text-sm text-emerald-600 mt-1">
                  ${((parseFloat(formData.monthlyIncome) || 0) * (parseFloat(formData.needsPercentage) || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.needsPercentage}
              onChange={(e) => handlePercentageChange('needsPercentage', e.target.value)}
              className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer slider-emerald"
            />
          </div>

          {/* Wants */}
          <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Wants</h3>
                <p className="text-sm text-amber-600">Entertainment, dining out, hobbies</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max={100 - parseFloat(formData.needsPercentage)}
                    value={formData.wantsPercentage}
                    onChange={(e) => handlePercentageChange('wantsPercentage', e.target.value)}
                    className="w-20 px-3 py-2 text-center border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-amber-700 font-medium">%</span>
                </div>
                <p className="text-sm text-amber-600 mt-1">
                  ${((parseFloat(formData.monthlyIncome) || 0) * (parseFloat(formData.wantsPercentage) || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={100 - parseFloat(formData.needsPercentage)}
              value={formData.wantsPercentage}
              onChange={(e) => handlePercentageChange('wantsPercentage', e.target.value)}
              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer slider-amber"
            />
          </div>

          {/* Responsibilities */}
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Responsibilities</h3>
                <p className="text-sm text-blue-600">Savings, investments, debt payments</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max={100 - parseFloat(formData.needsPercentage)}
                    value={formData.responsibilitiesPercentage}
                    onChange={(e) => handlePercentageChange('responsibilitiesPercentage', e.target.value)}
                    className="w-20 px-3 py-2 text-center border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-blue-700 font-medium">%</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  ${((parseFloat(formData.monthlyIncome) || 0) * (parseFloat(formData.responsibilitiesPercentage) || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={100 - parseFloat(formData.needsPercentage)}
              value={formData.responsibilitiesPercentage}
              onChange={(e) => handlePercentageChange('responsibilitiesPercentage', e.target.value)}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-blue"
            />
          </div>

          {/* Total Validation */}
          <div className={`p-4 rounded-xl border-2 ${
            isValidPercentage ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${
                isValidPercentage ? 'text-emerald-800' : 'text-red-800'
              }`}>
                Total Allocation:
              </span>
              <span className={`text-xl font-bold ${
                isValidPercentage ? 'text-emerald-800' : 'text-red-800'
              }`}>
                {Math.round(totalPercentage)}%
              </span>
            </div>
            {!isValidPercentage && (
              <p className="text-sm text-red-600 mt-1">
                Adjust percentages to reach exactly 100%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Monthly Responsibilities */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Calculator className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Fixed Monthly Responsibilities</h2>
        </div>

        {/* Add New Fixed Expense */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
          <input
            type="text"
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Expense name (e.g., Cat Food)"
          />
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0.00"
            />
          </div>
          <button
            onClick={handleAddExpense}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </button>
        </div>

        {/* Fixed Expenses List */}
        <div className="space-y-3">
          {budgetSettings.fixedExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <h4 className="font-medium text-slate-800">{expense.name}</h4>
                <p className="text-sm text-slate-600">Fixed monthly expense</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-slate-800">
                  ${expense.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => deleteFixedExpense(expense.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {budgetSettings.fixedExpenses.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>No fixed expenses configured yet</p>
              <p className="text-sm">Add recurring monthly expenses above</p>
            </div>
          )}
        </div>
      </div>

      {/* Month Reset */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Monthly Reset</h2>
        <p className="text-slate-600 mb-6">
          Reset all transactions and start a new month. Current data will be archived in Reports.
        </p>
        
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            Reset Month
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <p className="text-red-600 font-medium">Are you sure? This cannot be undone.</p>
            <button
              onClick={() => {
                resetMonth();
                setShowResetConfirm(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTab;