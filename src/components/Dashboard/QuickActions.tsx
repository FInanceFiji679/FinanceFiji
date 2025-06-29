import React from 'react';
import { Plus, TrendingUp, Target, FileText } from 'lucide-react';

interface QuickActionsProps {
  onAction?: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    { id: 'add-income', label: 'Add Income', icon: Plus, color: 'emerald' },
    { id: 'add-expense', label: 'Add Expense', icon: TrendingUp, color: 'blue' },
    { id: 'create-goal', label: 'Create Goal', icon: Target, color: 'purple' },
    { id: 'view-reports', label: 'View Reports', icon: FileText, color: 'amber' }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
      blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200',
      amber: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onAction?.(action.id)}
              className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${getColorClasses(action.color)}`}
            >
              <Icon className="h-5 w-5 mx-auto mb-2" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;