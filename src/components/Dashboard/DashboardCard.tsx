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
    blue: 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600',
    green: 'bg-gradient-to-br from-emerald-900/50 to-slate-800 border-emerald-700',
    yellow: 'bg-gradient-to-br from-amber-900/50 to-slate-800 border-amber-700',
    red: 'bg-gradient-to-br from-red-900/50 to-slate-800 border-red-700',
    purple: 'bg-gradient-to-br from-purple-900/50 to-slate-800 border-purple-700'
  };

  const iconColorClasses = {
    blue: 'text-cyan-400 bg-cyan-500/20',
    green: 'text-emerald-400 bg-emerald-500/20',
    yellow: 'text-amber-400 bg-amber-500/20',
    red: 'text-red-400 bg-red-500/20',
    purple: 'text-purple-400 bg-purple-500/20'
  };

  return (
    <div className={`rounded-xl border p-6 transition-all hover:shadow-lg hover:shadow-slate-900/20 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-slate-500 ml-1">vs last month</span>
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