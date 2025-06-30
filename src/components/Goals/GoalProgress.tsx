import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, DollarSign, Plus, CheckCircle } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  isCompleted: boolean;
  createdAt: string;
}

interface GoalProgressProps {
  goal: Goal;
  onContribute: (goalId: string, amount: number) => void;
  availableBalance: number;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal, onContribute, availableBalance }) => {
  const [contributionAmount, setContributionAmount] = useState<string>('');
  const [showContributeForm, setShowContributeForm] = useState(false);

  const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const targetDate = new Date(goal.targetDate);
  const today = new Date();
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const handleContribute = () => {
    const amount = parseFloat(contributionAmount);
    if (amount > 0 && amount <= availableBalance && amount <= remainingAmount) {
      onContribute(goal.id, amount);
      setContributionAmount('');
      setShowContributeForm(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Emergency Fund': 'from-red-500 to-red-600',
      'Vacation': 'from-blue-500 to-blue-600',
      'Car': 'from-green-500 to-green-600',
      'Home': 'from-purple-500 to-purple-600',
      'Education': 'from-yellow-500 to-yellow-600',
      'Investment': 'from-indigo-500 to-indigo-600',
      'Other': 'from-gray-500 to-gray-600'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const getStatusColor = () => {
    if (goal.isCompleted) return 'text-emerald-600';
    if (daysRemaining < 0) return 'text-red-600';
    if (daysRemaining < 30) return 'text-amber-600';
    return 'text-blue-600';
  };

  const getStatusText = () => {
    if (goal.isCompleted) return 'Completed!';
    if (daysRemaining < 0) return `${Math.abs(daysRemaining)} days overdue`;
    if (daysRemaining === 0) return 'Due today';
    return `${daysRemaining} days remaining`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
      {/* Goal Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 bg-gradient-to-r ${getCategoryColor(goal.category)} rounded-xl`}>
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
            <p className="text-sm text-gray-600">{goal.category}</p>
          </div>
        </div>
        
        {goal.isCompleted && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-100 rounded-full">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Complete</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{Math.min(progressPercentage, 100).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`bg-gradient-to-r ${getCategoryColor(goal.category)} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Amount Progress */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Current Amount</p>
          <p className="text-xl font-bold text-gray-900">${goal.currentAmount.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Target Amount</p>
          <p className="text-xl font-bold text-gray-900">${goal.targetAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Remaining Amount */}
      {!goal.isCompleted && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Still needed</p>
              <p className="text-lg font-semibold text-gray-900">${remainingAmount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Target date</p>
              <p className={`text-sm font-medium ${getStatusColor()}`}>
                {targetDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {!goal.isCompleted && (
          <button
            onClick={() => setShowContributeForm(!showContributeForm)}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Contribute</span>
          </button>
        )}
      </div>

      {/* Contribution Form */}
      {showContributeForm && !goal.isCompleted && (
        <div className="border-t border-gray-200 pt-4">
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  max={Math.min(availableBalance, remainingAmount)}
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Amount"
                />
              </div>
              <button
                onClick={handleContribute}
                disabled={!contributionAmount || parseFloat(contributionAmount) > availableBalance || parseFloat(contributionAmount) > remainingAmount}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>Available: ${availableBalance.toFixed(2)}</span>
              <span>Max needed: ${remainingAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Contribution Buttons */}
      {!goal.isCompleted && !showContributeForm && availableBalance > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-600 mb-2">Quick contribute:</p>
          <div className="flex space-x-2">
            {[25, 50, 100].map(amount => (
              <button
                key={amount}
                onClick={() => onContribute(goal.id, Math.min(amount, availableBalance, remainingAmount))}
                disabled={amount > availableBalance || amount > remainingAmount}
                className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ${Math.min(amount, availableBalance, remainingAmount)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;