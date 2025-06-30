import React from 'react';
import { Star, Trophy, Target, TrendingUp, Calendar } from 'lucide-react';
import { Achievement } from '../../hooks/useFinanceStore';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showDate?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'medium', 
  showDate = false 
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'savings': return 'from-emerald-400 to-emerald-600';
      case 'goal': return 'from-blue-400 to-blue-600';
      case 'streak': return 'from-purple-400 to-purple-600';
      case 'milestone': return 'from-amber-400 to-amber-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'savings': return TrendingUp;
      case 'goal': return Target;
      case 'streak': return Calendar;
      case 'milestone': return Trophy;
      default: return Star;
    }
  };

  const sizeClasses = {
    small: 'w-12 h-12 text-xs',
    medium: 'w-16 h-16 text-sm',
    large: 'w-20 h-20 text-base'
  };

  const TypeIcon = getTypeIcon(achievement.type);

  return (
    <div className="group relative">
      <div className={`${sizeClasses[size]} bg-gradient-to-br ${getTypeColor(achievement.type)} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 cursor-pointer`}>
        <span className="text-2xl">{achievement.icon}</span>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
          <TypeIcon className="h-3 w-3 text-gray-600" />
        </div>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap max-w-xs">
          <div className="font-semibold">{achievement.name}</div>
          <div className="text-gray-300">{achievement.description}</div>
          {showDate && (
            <div className="text-gray-400 text-xs mt-1">
              {new Date(achievement.unlockedDate).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default AchievementBadge;