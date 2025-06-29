import React, { useState } from 'react';
import { Edit, Lock, Save, AlertCircle } from 'lucide-react';
import { useFinanceStore } from '../hooks/useFinanceStore';

const AllocationManager: React.FC = () => {
  const { 
    allocations, 
    monthlyIncome, 
    updateAllocations, 
    lockAllocations, 
    unlockAllocations,
    setMonthlyIncome 
  } = useFinanceStore();

  const [tempAllocations, setTempAllocations] = useState(allocations);
  const [tempIncome, setTempIncome] = useState(monthlyIncome.toString());
  const [isEditing, setIsEditing] = useState(!allocations.isLocked);

  const totalPercentage = tempAllocations.needs + tempAllocations.wants + tempAllocations.savings;
  const isValidTotal = Math.abs(totalPercentage - 100) < 0.1;

  const handleSliderChange = (category: keyof typeof tempAllocations, value: number) => {
    if (!isEditing) return;

    const newAllocations = { ...tempAllocations };
    newAllocations[category] = value;

    // Auto-adjust other categories to maintain 100% total
    if (category === 'needs') {
      const remaining = 100 - value;
      const currentOther = tempAllocations.wants + tempAllocations.savings;
      if (currentOther > 0) {
        const wantsRatio = tempAllocations.wants / currentOther;
        newAllocations.wants = Math.round(remaining * wantsRatio);
        newAllocations.savings = remaining - newAllocations.wants;
      } else {
        newAllocations.wants = Math.round(remaining * 0.6);
        newAllocations.savings = remaining - newAllocations.wants;
      }
    } else if (category === 'wants') {
      const maxAllowed = 100 - tempAllocations.needs;
      const adjustedValue = Math.min(value, maxAllowed);
      newAllocations.wants = adjustedValue;
      newAllocations.savings = maxAllowed - adjustedValue;
    } else if (category === 'savings') {
      const maxAllowed = 100 - tempAllocations.needs;
      const adjustedValue = Math.min(value, maxAllowed);
      newAllocations.savings = adjustedValue;
      newAllocations.wants = maxAllowed - adjustedValue;
    }

    setTempAllocations(newAllocations);
  };

  const handleSave = () => {
    if (!isValidTotal) return;
    
    setMonthlyIncome(parseFloat(tempIncome) || 0);
    updateAllocations(tempAllocations);
    lockAllocations();
    setIsEditing(false);
  };

  const handleEdit = () => {
    unlockAllocations();
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempAllocations(allocations);
    setTempIncome(monthlyIncome.toString());
    setIsEditing(false);
    if (!allocations.isLocked) {
      lockAllocations();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Money Allocation</h1>
          <p className="text-gray-600 mt-1">Set your budget percentages</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {allocations.isLocked && !isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isValidTotal}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>Save & Lock</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Income */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Income</h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Monthly Income ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              value={tempIncome}
              onChange={(e) => setTempIncome(e.target.value)}
              disabled={!isEditing}
              className={`w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
              }`}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Allocation Sliders */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Budget Allocation</h2>
          {allocations.isLocked && !isEditing && (
            <div className="flex items-center space-x-2 text-gray-500">
              <Lock className="h-4 w-4" />
              <span className="text-sm">Locked</span>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Needs */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-emerald-800">Needs</h3>
                <p className="text-sm text-emerald-600">Essential expenses (housing, food, utilities)</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-700">{tempAllocations.needs}%</div>
                <div className="text-sm text-emerald-600">
                  ${((parseFloat(tempIncome) || 0) * tempAllocations.needs / 100).toFixed(2)}
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={tempAllocations.needs}
              onChange={(e) => handleSliderChange('needs', parseInt(e.target.value))}
              disabled={!isEditing}
              className={`w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer ${
                !isEditing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* Wants */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Wants</h3>
                <p className="text-sm text-amber-600">Entertainment, dining out, hobbies</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-700">{tempAllocations.wants}%</div>
                <div className="text-sm text-amber-600">
                  ${((parseFloat(tempIncome) || 0) * tempAllocations.wants / 100).toFixed(2)}
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={100 - tempAllocations.needs}
              value={tempAllocations.wants}
              onChange={(e) => handleSliderChange('wants', parseInt(e.target.value))}
              disabled={!isEditing}
              className={`w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer ${
                !isEditing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* Savings */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Savings</h3>
                <p className="text-sm text-blue-600">Emergency fund, investments, future goals</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-700">{tempAllocations.savings}%</div>
                <div className="text-sm text-blue-600">
                  ${((parseFloat(tempIncome) || 0) * tempAllocations.savings / 100).toFixed(2)}
                </div>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={100 - tempAllocations.needs}
              value={tempAllocations.savings}
              onChange={(e) => handleSliderChange('savings', parseInt(e.target.value))}
              disabled={!isEditing}
              className={`w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer ${
                !isEditing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* Total Validation */}
          <div className={`p-4 rounded-xl border-2 ${
            isValidTotal ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {!isValidTotal && <AlertCircle className="h-5 w-5 text-red-600" />}
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
                Adjust sliders to reach exactly 100%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationManager;