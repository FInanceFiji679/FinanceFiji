import React from 'react';
import { Target, Calendar, Flag, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { FinancialGoal } from '../../hooks/useFinanceStore';

interface GoalProgressProps {
  goal: FinancialGoal;
  onContribute?: (goalId: string, amount: number) => void;
  availableBalance?: number;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal, onContribute, availableBalance = 0 }) => {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const remaining = goal.targetAmount - goal.currentAmount;
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'short-term': return 'bg-blue-100 text-blue-800';
      case 'medium-term': return 'bg-purple-100 text-purple-800';
      case 'long-term': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeToGoal = () => {
    if (!goal.targetDate) return null;
    
    const targetDate = new Date(goal.targetDate);
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months left`;
    return `${Math.ceil(diffDays / 365)} years left`;
  };

  const timeToGoal = getTimeToGoal();

  return (
    <div className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
      isCompleted 
        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300' 
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{goal.name}</h3>
            {isCompleted && (
              <div className="flex items-center space-x-1 text-emerald-600">
                <Target className="h-4 w-4" />
                <span className="text-xs font-medium">Completed!</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
              {goal.priority} priority
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
              {goal.category.replace('-', ' ')}
            </span>
          </div>

          {goal.description && (
            <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isCompleted 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            ${goal.currentAmount.toFixed(2)}
          </span>
          <span className="font-medium text-gray-900">
            ${goal.targetAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">Remaining</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            ${remaining.toFixed(2)}
          </p>
        </div>

        {timeToGoal && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Time Left</span>
            </div>
            <p className={`text-lg font-bold ${
              timeToGoal === 'Overdue' ? 'text-red-600' : 'text-gray-900'
            }`}>
              {timeToGoal}
            </p>
          </div>
        )}
      </div>

      {/* Target Date */}
      {goal.targetDate && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Calendar className="h-4 w-4" />
          <span>Target: {new Date(goal.targetDate).toLocaleDateString('en-FJ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      )}

      {/* Contribution Section */}
      {!isCompleted && onContribute && availableBalance > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Quick Contribute</p>
              <p className="text-xs text-gray-500">Available: ${availableBalance.toFixed(2)}</p>
            </div>
            <div className="flex space-x-2">
              {[10, 25, 50, 100].map(amount => (
                amount <= availableBalance && amount <= remaining && (
                  <button
                    key={amount}
                    onClick={() => onContribute(goal.id, amount)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    +${amount}
                  </button>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completion Celebration */}
      {isCompleted && (
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 text-emerald-600">
            <Target className="h-5 w-5" />
            <span className="font-medium">🎉 Congratulations! Goal achieved!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalProgress;