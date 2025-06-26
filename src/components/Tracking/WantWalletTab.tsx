import React, { useState } from 'react';
import { PiggyBank, TrendingUp, TrendingDown, Calendar, Sparkles, Target, Trophy, Star, Gift, Zap, Crown, Plus, ArrowRight } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import BudgetHeader from '../Shared/BudgetHeader';

const WantWalletTab: React.FC = () => {
  const { 
    wantWalletBalance, 
    wantWalletTransactions, 
    goals, 
    contributeToGoal,
    savingsRate,
    achievements 
  } = useFinanceStore();

  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [contributionAmount, setContributionAmount] = useState<string>('');

  const totalAccumulated = wantWalletTransactions
    .filter(t => t.type === 'accumulation')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawn = wantWalletTransactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalContributed = wantWalletTransactions
    .filter(t => t.type === 'goal-contribution')
    .reduce((sum, t) => sum + t.amount, 0);

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

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
    if (wantWalletBalance >= 1000) return { level: 'Master Saver', icon: '👑', color: 'from-purple-500 to-purple-600' };
    if (wantWalletBalance >= 500) return { level: 'Expert Saver', icon: '🏆', color: 'from-amber-500 to-amber-600' };
    if (wantWalletBalance >= 200) return { level: 'Smart Saver', icon: '⭐', color: 'from-blue-500 to-blue-600' };
    if (wantWalletBalance >= 50) return { level: 'Rising Saver', icon: '🌟', color: 'from-emerald-500 to-emerald-600' };
    return { level: 'New Saver', icon: '🌱', color: 'from-gray-500 to-gray-600' };
  };

  const savingsLevel = getSavingsLevel();

  const getMotivationalMessage = () => {
    if (wantWalletBalance >= 1000) return "You're a financial wizard! Your discipline is truly inspiring! 🧙‍♂️✨";
    if (wantWalletBalance >= 500) return "Incredible savings! You're well on your way to financial freedom! 🚀";
    if (wantWalletBalance >= 200) return "Great job! Your smart spending choices are really paying off! 💪";
    if (wantWalletBalance >= 50) return "You're building momentum! Every dollar saved is a step toward your goals! 🎯";
    return "Every journey starts with a single step. You're doing great! 🌟";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Want Wallet Header with Level */}
      <div className={`bg-gradient-to-br ${savingsLevel.color} rounded-2xl shadow-xl text-white p-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 rounded-xl">
                <PiggyBank className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Want Wallet</h1>
                <p className="text-white/80">Your accumulated unspent wants money</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">
                ${wantWalletBalance.toFixed(2)}
              </div>
              <div className="text-white/80">
                Available Balance
              </div>
            </div>
          </div>

          {/* Savings Level Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 bg-white/20 rounded-full px-4 py-2">
              <span className="text-2xl">{savingsLevel.icon}</span>
              <span className="font-semibold">{savingsLevel.level}</span>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-white/80">Savings Rate</p>
              <p className="text-xl font-bold">{savingsRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mt-6 p-4 bg-white/20 rounded-xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-white/80 animate-pulse" />
              <span className="text-white/90 font-medium">{getMotivationalMessage()}</span>
              <Sparkles className="h-5 w-5 text-white/80 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Goal Contribution Section */}
      {activeGoals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Contribute to Goals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select a goal</option>
              {activeGoals.map(goal => (
                <option key={goal.id} value={goal.id}>
                  {goal.name} (${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)})
                </option>
              ))}
            </select>
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                max={wantWalletBalance}
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Amount to contribute"
              />
            </div>
            
            <button
              onClick={handleContributeToGoal}
              disabled={!selectedGoal || !contributionAmount || parseFloat(contributionAmount) > wantWalletBalance}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
              <span>Contribute</span>
            </button>
          </div>

          <p className="text-sm text-slate-600">
            Available to contribute: <span className="font-semibold">${wantWalletBalance.toFixed(2)}</span>
          </p>
        </div>
      )}

      {/* Goals Progress */}
      {activeGoals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h3 className="text-xl font-semibold text-slate-800 mb-6">Your Financial Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map(goal => {
              const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const remaining = goal.targetAmount - goal.currentAmount;
              const monthsToGoal = wantWalletBalance > 0 ? Math.ceil(remaining / (totalAccumulated / Math.max(1, wantWalletTransactions.filter(t => t.type === 'accumulation').length))) : 0;
              
              return (
                <div key={goal.id} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-800">{goal.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                      goal.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {goal.priority} priority
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Progress</span>
                      <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Current:</span>
                      <span className="font-semibold">${goal.currentAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Target:</span>
                      <span className="font-semibold">${goal.targetAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Remaining:</span>
                      <span className="font-semibold text-blue-600">${remaining.toFixed(2)}</span>
                    </div>
                    {monthsToGoal > 0 && monthsToGoal < 100 && (
                      <div className="flex justify-between">
                        <span className="text-slate-600">Est. completion:</span>
                        <span className="font-semibold text-emerald-600">{monthsToGoal} months</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Trophy className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Completed Goals</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedGoals.map(goal => (
              <div key={goal.id} className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h4 className="font-semibold text-emerald-800">{goal.name}</h4>
                    <p className="text-sm text-emerald-600">${goal.targetAmount.toFixed(2)} achieved!</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Accumulated</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">${totalAccumulated.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">From unspent wants budget</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Goal Contributions</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">${totalContributed.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Invested in your future</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <PiggyBank className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Net Savings</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">${(totalAccumulated - totalWithdrawn - totalContributed).toFixed(2)}</p>
          <p className="text-sm text-gray-600 mt-1">Available for goals</p>
        </div>
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Recent Achievements</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.slice(0, 6).map(achievement => (
              <div key={achievement.id} className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <h4 className="font-semibold text-amber-800">{achievement.name}</h4>
                    <p className="text-sm text-amber-600">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Transaction History</h2>
          <p className="text-slate-600 mt-1">All want wallet activity</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {wantWalletTransactions.length > 0 ? (
            wantWalletTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${
                      transaction.type === 'accumulation' ? 'bg-emerald-100' :
                      transaction.type === 'goal-contribution' ? 'bg-blue-100' :
                      'bg-red-100'
                    }`}>
                      {transaction.type === 'accumulation' ? (
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      ) : transaction.type === 'goal-contribution' ? (
                        <Target className="h-5 w-5 text-blue-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{transaction.description}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <p className="text-sm text-slate-500">
                          {new Date(transaction.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        {transaction.fromMonth && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {transaction.fromMonth}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      transaction.type === 'accumulation' ? 'text-emerald-600' :
                      transaction.type === 'goal-contribution' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {transaction.type === 'accumulation' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <div className={`text-sm ${
                      transaction.type === 'accumulation' ? 'text-emerald-600' :
                      transaction.type === 'goal-contribution' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {transaction.type === 'accumulation' ? 'Added' :
                       transaction.type === 'goal-contribution' ? 'Goal Contribution' :
                       'Withdrawn'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <PiggyBank className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p>Your want wallet will accumulate money from unspent wants budget</p>
              <p className="text-sm mt-2">Complete a month with unspent wants money to see it here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Educational Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">How Your Want Wallet Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-100 rounded-lg mt-1 flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Automatic Accumulation</h4>
                <p className="text-sm text-gray-600">
                  At month-end, any unspent money from your wants budget automatically transfers here. 
                  This rewards your discipline and builds your savings effortlessly.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg mt-1 flex-shrink-0">
                <PiggyBank className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Persistent Savings</h4>
                <p className="text-sm text-gray-600">
                  Your want wallet balance never resets - it keeps growing with your savings discipline. 
                  Watch it compound over time as you make smarter spending choices.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg mt-1 flex-shrink-0">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Goal-Driven Savings</h4>
                <p className="text-sm text-gray-600">
                  Use your accumulated savings to fund specific financial goals. 
                  See your progress visualized and get motivated to save even more.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-red-100 rounded-lg mt-1 flex-shrink-0">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Overspend Protection</h4>
                <p className="text-sm text-gray-600">
                  When you exceed your wants budget, the overage is automatically deducted from here. 
                  This prevents budget violations while encouraging mindful spending.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-amber-100 rounded-lg mt-1 flex-shrink-0">
                <Sparkles className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Guilt-Free Spending</h4>
                <p className="text-sm text-gray-600">
                  Use this balance for special purchases without affecting your monthly budget. 
                  You've earned it through disciplined spending!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg mt-1 flex-shrink-0">
                <Crown className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Achievement System</h4>
                <p className="text-sm text-gray-600">
                  Unlock badges and achievements as you reach savings milestones. 
                  Gamify your financial journey and celebrate your progress!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-8 p-6 bg-white/60 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4">💡 Success Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p className="mb-2"><strong>Start Small:</strong> Even saving $10-20 per month builds momentum and creates positive habits.</p>
              <p><strong>Set Clear Goals:</strong> Having specific targets makes it easier to resist impulse purchases.</p>
            </div>
            <div>
              <p className="mb-2"><strong>Track Progress:</strong> Regularly check your want wallet to see how your discipline pays off.</p>
              <p><strong>Celebrate Wins:</strong> Acknowledge your achievements - you're building financial freedom!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WantWalletTab;