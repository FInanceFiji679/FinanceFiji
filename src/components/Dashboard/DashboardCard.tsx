import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  trend
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200',
    green: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
    yellow: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
  };

  const iconColorClasses = {
    blue: 'text-sky-600 bg-sky-100',
    green: 'text-emerald-600 bg-emerald-100',
    yellow: 'text-amber-600 bg-amber-100',
    red: 'text-red-600 bg-red-100',
    purple: 'text-purple-600 bg-purple-100'
  };

  return (
    <div className={`rounded-xl border p-6 transition-all hover:shadow-lg ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${iconColorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;