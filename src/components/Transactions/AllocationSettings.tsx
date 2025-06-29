import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, Save, Edit, Percent, AlertTriangle, CheckCircle } from 'lucide-react';
import { BudgetSettings } from '../../hooks/useFinanceStore';

interface AllocationSettingsProps {
  onClose: () => void;
  budgetSettings: BudgetSettings;
  updateBudgetSettings: (settings: Partial<BudgetSettings>) => void;
}

const AllocationSettings: React.FC<AllocationSettingsProps> = ({
  onClose,
  budgetSettings,
  updateBudgetSettings
}) => {
  const [isEditing, setIsEditing] = useState(!budgetSettings.allocationLocked);
  const [formData, setFormData] = useState({
    needsPercentage: budgetSettings.needsPercentage,
    wantsPercentage: budgetSettings.wantsPercentage,
    responsibilitiesPercentage: budgetSettings.responsibilitiesPercentage
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const hasFormChanges = 
      formData.needsPercentage !== budgetSettings.needsPercentage ||
      formData.wantsPercentage !== budgetSettings.wantsPercentage ||
      formData.responsibilitiesPercentage !== budgetSettings.responsibilitiesPercentage;
    
    setHasChanges(hasFormChanges);
  }, [formData, budgetSettings]);

  const totalPercentage = formData.needsPercentage + formData.wantsPercentage + formData.responsibilitiesPercentage;
  const isValidTotal = Math.abs(totalPercentage - 100) < 0.1;

  const handlePercentageChange = (field: string, value: number) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    
    let newFormData = { ...formData, [field]: clampedValue };

    // Auto-adjust other percentages to maintain 100% total
    if (field === 'needsPercentage') {
      const remaining = 100 - clampedValue;
      const currentWants = formData.wantsPercentage;
      const currentResp = formData.responsibilitiesPercentage;
      const currentTotal = currentWants + currentResp;
      
      if (currentTotal > 0) {
        const wantsRatio = currentWants / currentTotal;
        newFormData.wantsPercentage = Math.round(remaining * wantsRatio * 10) / 10;
        newFormData.responsibilitiesPercentage = Math.round((remaining - (remaining * wantsRatio)) * 10) / 10;
      } else {
        newFormData.wantsPercentage = Math.round(remaining * 0.6 * 10) / 10;
        newFormData.responsibilitiesPercentage = Math.round(remaining * 0.4 * 10) / 10;
      }
    } else if (field === 'wantsPercentage') {
      const needsPercent = formData.needsPercentage;
      const maxAllowed = 100 - needsPercent;
      const adjustedValue = Math.min(clampedValue, maxAllowed);
      newFormData.wantsPercentage = adjustedValue;
      newFormData.responsibilitiesPercentage = maxAllowed - adjustedValue;
    } else if (field === 'responsibilitiesPercentage') {
      const needsPercent = formData.needsPercentage;
      const maxAllowed = 100 - needsPercent;
      const adjustedValue = Math.min(clampedValue, maxAllowed);
      newFormData.responsibilitiesPercentage = adjustedValue;
      newFormData.wantsPercentage = maxAllowed - adjustedValue;
    }

    setFormData(newFormData);
  };

  const handleSave = () => {
    if (!isValidTotal) return;

    updateBudgetSettings({
      needsPercentage: formData.needsPercentage,
      wantsPercentage: formData.wantsPercentage,
      responsibilitiesPercentage: formData.responsibilitiesPercentage,
      allocationLocked: true
    });

    setIsEditing(false);
  };

  const handleEdit = () => {
    updateBudgetSettings({
      allocationLocked: false
    });
    setIsEditing(true);
  };

  const handleLock = () => {
    if (!isValidTotal) return;

    updateBudgetSettings({
      needsPercentage: formData.needsPercentage,
      wantsPercentage: formData.wantsPercentage,
      responsibilitiesPercentage: formData.responsibilitiesPercentage,
      allocationLocked: true
    });

    setIsEditing(false);
  };

  const resetToDefaults = () => {
    setFormData({
      needsPercentage: 50,
      wantsPercentage: 30,
      responsibilitiesPercentage: 20
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {budgetSettings.allocationLocked ? <Lock className="h-6 w-6" /> : <Unlock className="h-6 w-6" />}
              </div>
              <div>
                <h2 className="text-xl font-bold">Money Allocation Settings</h2>
                <p className="text-slate-300">
                  {budgetSettings.allocationLocked ? 'Allocations are locked' : 'Configure your budget percentages'}
                </p>
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              {budgetSettings.allocationLocked ? (
                <>
                  <Lock className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-700">Allocations Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-700">Allocations Unlocked</span>
                </>
              )}
            </div>
            
            <div className="flex space-x-2">
              {budgetSettings.allocationLocked && !isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={resetToDefaults}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Reset to 50/30/20
                  </button>
                  <button
                    onClick={handleLock}
                    disabled={!isValidTotal}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Lock & Save</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Allocation Sliders */}
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
                      step="0.1"
                      value={formData.needsPercentage}
                      onChange={(e) => handlePercentageChange('needsPercentage', parseFloat(e.target.value) || 0)}
                      disabled={!isEditing}
                      className="w-20 px-3 py-2 text-center border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <span className="text-emerald-700 font-medium">%</span>
                  </div>
                  <p className="text-sm text-emerald-600 mt-1">
                    ${((budgetSettings.monthlyIncome * formData.needsPercentage) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={formData.needsPercentage}
                onChange={(e) => handlePercentageChange('needsPercentage', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer slider-emerald disabled:cursor-not-allowed disabled:opacity-50"
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
                      max={100 - formData.needsPercentage}
                      step="0.1"
                      value={formData.wantsPercentage}
                      onChange={(e) => handlePercentageChange('wantsPercentage', parseFloat(e.target.value) || 0)}
                      disabled={!isEditing}
                      className="w-20 px-3 py-2 text-center border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <span className="text-amber-700 font-medium">%</span>
                  </div>
                  <p className="text-sm text-amber-600 mt-1">
                    ${((budgetSettings.monthlyIncome * formData.wantsPercentage) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={100 - formData.needsPercentage}
                step="0.1"
                value={formData.wantsPercentage}
                onChange={(e) => handlePercentageChange('wantsPercentage', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer slider-amber disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Responsibilities/Savings */}
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800">Savings</h3>
                  <p className="text-sm text-blue-600">Savings, investments, debt payments</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max={100 - formData.needsPercentage}
                      step="0.1"
                      value={formData.responsibilitiesPercentage}
                      onChange={(e) => handlePercentageChange('responsibilitiesPercentage', parseFloat(e.target.value) || 0)}
                      disabled={!isEditing}
                      className="w-20 px-3 py-2 text-center border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <span className="text-blue-700 font-medium">%</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    ${((budgetSettings.monthlyIncome * formData.responsibilitiesPercentage) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max={100 - formData.needsPercentage}
                step="0.1"
                value={formData.responsibilitiesPercentage}
                onChange={(e) => handlePercentageChange('responsibilitiesPercentage', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-blue disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* Total Validation */}
          <div className={`p-4 rounded-xl border-2 ${
            isValidTotal ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isValidTotal ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  isValidTotal ? 'text-emerald-800' : 'text-red-800'
                }`}>
                  Total Allocation:
                </span>
              </div>
              <span className={`text-xl font-bold ${
                isValidTotal ? 'text-emerald-800' : 'text-red-800'
              }`}>
                {totalPercentage.toFixed(1)}%
              </span>
            </div>
            {!isValidTotal && (
              <p className="text-sm text-red-600 mt-1">
                Adjust percentages to reach exactly 100%
              </p>
            )}
          </div>

          {/* Information */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">How Allocation Locking Works</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Locked allocations prevent accidental changes to your budget structure</li>
              <li>• You must click "Edit" to modify percentages when locked</li>
              <li>• All transactions will be categorized according to these percentages</li>
              <li>• Locking ensures consistency across all financial calculations</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Monthly Income: ${budgetSettings.monthlyIncome.toFixed(2)}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              {isEditing && hasChanges && (
                <button
                  onClick={handleSave}
                  disabled={!isValidTotal}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationSettings;