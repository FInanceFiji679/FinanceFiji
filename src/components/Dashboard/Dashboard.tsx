import React from 'react';
import { Wallet, TrendingUp, PiggyBank, CreditCard, Target, AlertTriangle, Building2, DollarSign } from 'lucide-react';
import DashboardCard from './DashboardCard';
import BudgetProgress from './BudgetProgress';
import RecentTransactions from './RecentTransactions';
import FNPFSummary from './FNPFSummary';
import QuickActions from './QuickActions';
import { useFinanceStore } from '../../hooks/useFinanceStore';

const Dashboard: React.FC = () => {
  const { 
    budgetSettings, 
    transactions, 
    wantWalletBalance, 
    bankBalance, 
    goals,
    needsBudget,
    wantsBudget,
    responsibilitiesBudget,
    needsSpent,
    wantsSpent,
    responsibilitiesSpent,
    totalSpent,
    remainingSalary
  } = useFinanceStore();

  // Calculate monthly income from transactions
  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return t.type === 'income' && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = totalSpent;
  const monthlyNet = monthlyIncome - monthlyExpenses;

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  // Budget utilization percentages
  const needsUtilization = needsBudget > 0 ? (needsSpent / needsBudget) * 100 : 0;
  const wantsUtilization = wantsBudget > 0 ? (wantsSpent / wantsBudget) * 100 : 0;
  const responsibilitiesUtilization = responsibilitiesBudget > 0 ? (responsibilitiesSpent / responsibilitiesBudget) * 100 : 0;

  // Alerts
  const alerts = [];
  if (needsUtilization > 90) alerts.push({ type: 'warning', message: 'Needs budget almost exhausted' });
  if (wantsUtilization > 100) alerts.push({ type: 'error', message: 'Wants budget exceeded' });
  if (remainingSalary < 0) alerts.push({ type: 'error', message: 'Monthly budget exceeded' });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl shadow-xl text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to Finance Fiji</h1>
              <p className="text-blue-100 text-lg">Your comprehensive financial dashboard</p>
              <div className="mt-4 flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-2xl font-bold">{transactions.length}</p>
                  <p className="text-blue-200 text-sm">Transactions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{activeGoals.length}</p>
                  <p className="text-blue-200 text-sm">Active Goals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{completedGoals.length}</p>
                  <p className="text-blue-200 text-sm">Completed</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <Wallet className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-xl border ${
              alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">{alert.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Monthly Income"
          value={`$${monthlyIncome.toFixed(2)}`}
          icon={TrendingUp}
          color="green"
          trend={{ value: 5.2, isPositive: true }}
        />
        <DashboardCard
          title="Monthly Expenses"
          value={`$${monthlyExpenses.toFixed(2)}`}
          icon={CreditCard}
          color="red"
          trend={{ value: -2.1, isPositive: false }}
        />
        <DashboardCard
          title="Want Wallet"
          value={`$${wantWalletBalance.toFixed(2)}`}
          icon={PiggyBank}
          color="purple"
          trend={{ value: 12.5, isPositive: true }}
        />
        <DashboardCard
          title="Bank Balance"
          value={`$${bankBalance.toFixed(2)}`}
          icon={Building2}
          color={bankBalance >= 0 ? 'blue' : 'red'}
        />
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Budget Overview</h3>
          <div className="space-y-6">
            {/* Needs */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Target className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-900">Needs</h4>
                    <p className="text-sm text-emerald-600">Essential expenses</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-700">${needsSpent.toFixed(2)}</p>
                  <p className="text-sm text-emerald-600">of ${needsBudget.toFixed(2)}</p>
                </div>
              </div>
              <div className="w-full bg-emerald-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${needsUtilization > 100 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(needsUtilization, 100)}%` }}
                />
              </div>
              <p className="text-xs text-emerald-600 mt-1">{needsUtilization.toFixed(1)}% utilized</p>
            </div>

            {/* Wants */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900">Wants</h4>
                    <p className="text-sm text-amber-600">Lifestyle expenses</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-amber-700">${wantsSpent.toFixed(2)}</p>
                  <p className="text-sm text-amber-600">of ${wantsBudget.toFixed(2)}</p>
                </div>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${wantsUtilization > 100 ? 'bg-red-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(wantsUtilization, 100)}%` }}
                />
              </div>
              <p className="text-xs text-amber-600 mt-1">{wantsUtilization.toFixed(1)}% utilized</p>
            </div>

            {/* Responsibilities */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Responsibilities</h4>
                    <p className="text-sm text-blue-600">Savings & investments</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-700">${responsibilitiesSpent.toFixed(2)}</p>
                  <p className="text-sm text-blue-600">of ${responsibilitiesBudget.toFixed(2)}</p>
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${responsibilitiesUtilization > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(responsibilitiesUtilization, 100)}%` }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-1">{responsibilitiesUtilization.toFixed(1)}% utilized</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* FNPF Summary */}
          <FNPFSummary />
          
          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Goals</h3>
          {activeGoals.length > 0 ? (
            <div className="space-y-4">
              {activeGoals.slice(0, 3).map(goal => {
                const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                return (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{goal.name}</h4>
                      <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all"
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
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No active goals</p>
              <button className="mt-2 text-blue-600 hover:text-blue-700 font-medium">
                Create your first goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;