import React from 'react';
import { Trophy, Star, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { Achievement } from '../../hooks/useFinanceStore';
import AchievementBadge from './AchievementBadge';

interface AchievementSystemProps {
  achievements: Achievement[];
  currentStats: {
    wantWalletBalance: number;
    totalSaved: number;
    goalsCompleted: number;
    monthsTracked: number;
  };
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ achievements, currentStats }) => {
  const upcomingAchievements = [
    {
      name: 'First $100',
      description: 'Save your first $100 in Want Wallet',
      icon: '💯',
      type: 'savings',
      requirement: 100,
      current: currentStats.wantWalletBalance,
      category: 'savings'
    },
    {
      name: 'Savings Champion',
      description: 'Reach $500 in Want Wallet',
      icon: '🏆',
      type: 'savings',
      requirement: 500,
      current: currentStats.wantWalletBalance,
      category: 'savings'
    },
    {
      name: 'Goal Getter',
      description: 'Complete your first financial goal',
      icon: '🎯',
      type: 'goal',
      requirement: 1,
      current: currentStats.goalsCompleted,
      category: 'goals'
    },
    {
      name: 'Consistency King',
      description: 'Track expenses for 3 months straight',
      icon: '👑',
      type: 'streak',
      requirement: 3,
      current: currentStats.monthsTracked,
      category: 'consistency'
    },
    {
      name: 'Savings Master',
      description: 'Accumulate $1,000 in Want Wallet',
      icon: '🌟',
      type: 'savings',
      requirement: 1000,
      current: currentStats.wantWalletBalance,
      category: 'savings'
    }
  ];

  const getProgressPercentage = (current: number, requirement: number) => {
    return Math.min((current / requirement) * 100, 100);
  };

  const getAchievementsByType = (type: string) => {
    return achievements.filter(a => a.type === type);
  };

  const recentAchievements = achievements
    .sort((a, b) => new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-6 w-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-900">Recent Achievements</h3>
          </div>
          <div className="flex space-x-4">
            {recentAchievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                size="large"
                showDate={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Towards Next Achievements */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Next Achievements</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingAchievements
            .filter(achievement => !achievements.find(a => a.name === achievement.name))
            .slice(0, 4)
            .map((achievement, index) => {
              const progress = getProgressPercentage(achievement.current, achievement.requirement);
              const isClose = progress >= 75;
              
              return (
                <div key={index} className={`p-4 rounded-lg border-2 transition-all ${
                  isClose ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">
                        {achievement.current} / {achievement.requirement}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isClose ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {isClose && (
                    <div className="flex items-center space-x-1 text-emerald-600 text-sm font-medium">
                      <Star className="h-4 w-4" />
                      <span>Almost there!</span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* All Achievements by Category */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Achievement Gallery</h3>
        </div>
        
        <div className="space-y-6">
          {['savings', 'goal', 'streak', 'milestone'].map((type) => {
            const typeAchievements = getAchievementsByType(type);
            if (typeAchievements.length === 0) return null;
            
            return (
              <div key={type}>
                <h4 className="font-medium text-gray-900 mb-3 capitalize flex items-center space-x-2">
                  {type === 'savings' && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                  {type === 'goal' && <Target className="h-4 w-4 text-blue-600" />}
                  {type === 'streak' && <Calendar className="h-4 w-4 text-purple-600" />}
                  {type === 'milestone' && <Trophy className="h-4 w-4 text-amber-600" />}
                  <span>{type} Achievements ({typeAchievements.length})</span>
                </h4>
                <div className="flex flex-wrap gap-4">
                  {typeAchievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      size="medium"
                      showDate={true}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {achievements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium mb-2">No achievements yet</h4>
            <p>Start tracking your expenses to unlock your first achievement!</p>
          </div>
        )}
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-center">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
          <p className="text-2xl font-bold text-emerald-700">{getAchievementsByType('savings').length}</p>
          <p className="text-sm text-emerald-600">Savings Badges</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
          <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-blue-700">{getAchievementsByType('goal').length}</p>
          <p className="text-sm text-blue-600">Goal Badges</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
          <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
          <p className="text-2xl font-bold text-purple-700">{getAchievementsByType('streak').length}</p>
          <p className="text-sm text-purple-600">Streak Badges</p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-center">
          <Trophy className="h-8 w-8 mx-auto mb-2 text-amber-600" />
          <p className="text-2xl font-bold text-amber-700">{achievements.length}</p>
          <p className="text-sm text-amber-600">Total Badges</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementSystem;