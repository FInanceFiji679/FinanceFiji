import React, { useState } from 'react';
import { PiggyBank, Plus, Target, TrendingUp, Calendar, Trophy } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import GoalForm from '../Goals/GoalForm';

const WantWalletTab: React.FC = () => {
  const { 
    wantWalletBalance, 
    wantWalletTransactions, 
    goals, 
    contributeToGoal,
    addGoal,
    wantsBudget,
    wantsSpent
  } = useFinanceStore();

  const [showGoalForm, setShowGoalForm] = useState(false);
  const [contributionAmount, setContributionAmount] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  const currentWantsRemaining = Math.max(0, wantsBudget - wantsSpent);

  const handleContributeToGoal = () => {
    if (selectedGoal && contributionAmount) {
      const amount = parseFloat(contributionAmount);
      if (amount > 0 && amount <= wantWalletBalance) {
        contributeToGoal(selectedGoal, amount);
        setSelectedGoal('');
        setContributionAmount('');
      }
    }
  };

  const getSavingsLevel = () => {
    if (wantWalletBalance >= 1000) return { level: 'Master Saver', icon: '👑', color: 'purple' };
    if (wantWalletBalance >= 500) return { level: 'Expert Saver', icon: '🏆', color: 'amber' };
    if (wantWalletBalance >= 200) return { level: 'Smart Saver', icon: '⭐', color: 'blue' };
    if (wantWalletBalance >= 50) return { level: 'Rising Saver', icon: '🌟', color: 'emerald' };
    return { level: 'New Saver', icon: '🌱', color: 'gray' };
  };

  const savingsLevel = getSavingsLevel();

  return (
    <div className="pb-20 md:pb-0">
      {/* Want Wallet Header */}
      <div className={`bg-gradient-to-r from-${savingsLevel.color}-500 to-${savingsLevel.color}-600 text-white p-6 rounded-2xl mb-6`}>
        <div className="text-center">
          <div className="text-4xl mb-2">{savingsLevel.icon}</div>
          <h1 className="text-2xl font-bold mb-1">Want Wallet</h1>
          <p className="text-white/80 text-sm mb-4">{savingsLevel.level}</p>
          <div className="text-4xl font-bold mb-2">
            ${wantWalletBalance.toFixed(2)}
          </div>
          <p className="text-white/80">Available Balance</p>
        </div>
      </div>

      {/* Current Month Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">This Month's Progress</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-600">Wants Remaining</p>
            <p className="text-xl font-bold text-amber-600">${currentWantsRemaining.toFixed(2)}</p>
            <p className="text-xs text-amber-600">Will be added at month-end</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Saved</p>
            <p className="text-xl font-bold text-emerald-600">${wantWalletBalance.toFixed(2)}</p>
            <p className="text-xs text-emerald-600">From smart spending</p>
          </div>
        </div>
      </div>

      {/* Goal Contribution */}
      {activeGoals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Contribute to Goals</h2>
            <button
              onClick={() => setShowGoalForm(true)}
              className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select a goal</option>
              {activeGoals.map(goal => (
                <option key={goal.id} value={goal.id}>
                  {goal.name} (${goal.currentAmount.toFixed(0)} / ${goal.targetAmount.toFixed(0)})
                </option>
              ))}
            </select>
            
            <div className="flex space-x-2">
              <input
                type="number"
                step="0.01"
                max={wantWalletBalance}
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Amount"
              />
              <button
                onClick={handleContributeToGoal}
                disabled={!selectedGoal || !contributionAmount}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                Contribute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 ? (
        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Goals</h2>
          {activeGoals.map(goal => {
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            return (
              <div key={goal.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                  <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${goal.currentAmount.toFixed(2)}</span>
                  <span>${goal.targetAmount.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
          <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
          <p className="text-gray-600 mb-4">Create your first financial goal</p>
          <button
            onClick={() => setShowGoalForm(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Create Goal
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {wantWalletTransactions.length > 0 ? (
            wantWalletTransactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'accumulation' ? 'bg-emerald-100' :
                      transaction.type === 'goal-contribution' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'accumulation' ? (
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      ) : transaction.type === 'goal-contribution' ? (
                        <Target className="h-5 w-5 text-blue-600" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`text-lg font-bold ${
                    transaction.type === 'accumulation' ? 'text-emerald-600' :
                    transaction.type === 'goal-contribution' ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'accumulation' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <PiggyBank className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No activity yet</p>
              <p className="text-sm">Save money from your wants budget to see it here</p>
            </div>
          )}
        </div>
      </div>

      {/* Goal Form Modal */}
      {showGoalForm && (
        <GoalForm
          onClose={() => setShowGoalForm(false)}
          onSubmit={addGoal}
        />
      )}
    </div>
  );
};

export default WantWalletTab;