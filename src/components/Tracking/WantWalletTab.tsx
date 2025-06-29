import React, { useState } from 'react';
import { PiggyBank, TrendingUp, TrendingDown, Calendar, Sparkles, Target, Trophy, Star, Gift, Zap, Crown, Plus, ArrowRight, DollarSign, Clock } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import BudgetHeader from '../Shared/BudgetHeader';
import GoalForm from '../Goals/GoalForm';
import GoalProgress from '../Goals/GoalProgress';
import AchievementSystem from '../Achievements/AchievementSystem';

const WantWalletTab: React.FC = () => {
  const { 
    wantWalletBalance, 
    wantWalletTransactions, 
    goals, 
    contributeToGoal,
    savingsRate,
    achievements,
    addGoal,
    wantsBudget,
    wantsSpent,
    monthlyArchive
  } = useFinanceStore();

  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [contributionAmount, setContributionAmount] = useState<string>('');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

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
    if (wantWalletBalance >= 1000) return { level: 'Master Saver', icon: '👑', color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' };
    if (wantWalletBalance >= 500) return { level: 'Expert Saver', icon: '🏆', color: 'from-amber-500 to-amber-600', bgColor: 'from-amber-50 to-amber-100' };
    if (wantWalletBalance >= 200) return { level: 'Smart Saver', icon: '⭐', color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' };
    if (wantWalletBalance >= 50) return { level: 'Rising Saver', icon: '🌟', color: 'from-emerald-500 to-emerald-600', bgColor: 'from-emerald-50 to-emerald-100' };
    return { level: 'New Saver', icon: '🌱', color: 'from-gray-500 to-gray-600', bgColor: 'from-gray-50 to-gray-100' };
  };

  const savingsLevel = getSavingsLevel();

  const getMotivationalMessage = () => {
    if (wantWalletBalance >= 1000) return "You're a financial wizard! Your discipline is truly inspiring! 🧙‍♂️✨";
    if (wantWalletBalance >= 500) return "Incredible savings! You're well on your way to financial freedom! 🚀";
    if (wantWalletBalance >= 200) return "Great job! Your smart spending choices are really paying off! 💪";
    if (wantWalletBalance >= 50) return "You're building momentum! Every dollar saved is a step toward your goals! 🎯";
    return "Every journey starts with a single step. You're doing great! 🌟";
  };

  const getCurrentMonthProgress = () => {
    const currentWantsRemaining = wantsBudget - wantsSpent;
    const progressPercentage = wantsBudget > 0 ? ((wantsBudget - wantsSpent) / wantsBudget) * 100 : 0;
    return { remaining: currentWantsRemaining, percentage: Math.max(0, progressPercentage) };
  };

  const monthProgress = getCurrentMonthProgress();

  const sections = [
    { id: 'overview', label: 'Overview', icon: PiggyBank },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'history', label: 'History', icon: Calendar }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
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

      {/* Current Month Progress */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month's Wants Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Wants Budget Remaining</span>
              <span className="text-sm text-gray-600">{Math.round(monthProgress.percentage)}% left</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${monthProgress.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Spent: ${wantsSpent.toFixed(2)}</span>
              <span className="font-medium text-gray-900">Budget: ${wantsBudget.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
            <h4 className="font-medium text-emerald-900 mb-2">Potential Want Wallet Boost</h4>
            <p className="text-2xl font-bold text-emerald-700">${Math.max(0, monthProgress.remaining).toFixed(2)}</p>
            <p className="text-sm text-emerald-600">
              {monthProgress.remaining > 0 ? 'Will be added at month-end' : 'Overspent this month'}
            </p>
          </div>
        </div>
      </div>

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
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-8">
      {/* Goal Contribution Section */}
      {activeGoals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Contribute to Goals</h2>
            </div>
            <button
              onClick={() => setShowGoalForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Goal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Select a goal</option>
              {activeGoals.map(goal => (
                <option key={goal.id} value={goal.id}>
                  {goal.name} (${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)})
                </option>
              ))}
            </select>
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                max={wantWalletBalance}
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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

          <p className="text-sm text-gray-600">
            Available to contribute: <span className="font-semibold">${wantWalletBalance.toFixed(2)}</span>
          </p>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Your Financial Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map(goal => (
              <GoalProgress
                key={goal.id}
                goal={goal}
                onContribute={contributeToGoal}
                availableBalance={wantWalletBalance}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
          <Target className="h-16 w-16 mx-auto mb-6 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-4">No Financial Goals Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Set specific financial goals to make your Want Wallet savings more meaningful and motivating.
          </p>
          <button
            onClick={() => setShowGoalForm(true)}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Goal
          </button>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Trophy className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Completed Goals</h3>
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
    </div>
  );

  const renderAchievements = () => (
    <AchievementSystem
      achievements={achievements}
      currentStats={{
        wantWalletBalance,
        totalSaved: totalAccumulated,
        goalsCompleted: completedGoals.length,
        monthsTracked: monthlyArchive.length
      }}
    />
  );

  const renderHistory = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        <p className="text-gray-600 mt-1">All want wallet activity</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {wantWalletTransactions.length > 0 ? (
          wantWalletTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                    <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">
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
          <div className="p-12 text-center text-gray-500">
            <PiggyBank className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
            <p>Your want wallet will accumulate money from unspent wants budget</p>
            <p className="text-sm mt-2">Complete a month with unspent wants money to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Section Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="flex space-x-1 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Content */}
      {activeSection === 'overview' && renderOverview()}
      {activeSection === 'goals' && renderGoals()}
      {activeSection === 'achievements' && renderAchievements()}
      {activeSection === 'history' && renderHistory()}

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