import React from 'react';
import { Wallet, TrendingUp, PiggyBank, CreditCard, Target, AlertTriangle } from 'lucide-react';
import DashboardCard from './DashboardCard';
import BudgetProgress from './BudgetProgress';
import RecentTransactions from './RecentTransactions';
import { useFinanceData } from '../../hooks/useFinanceData';
import { calculateWalletBalance, calculateMonthlySpending, formatCurrency } from '../../utils/calculations';

const Dashboard: React.FC = () => {
  const { transactions, wallets, budgets, goals, fnpfData } = useFinanceData();

  const totalBalance = wallets.reduce((sum, wallet) => 
    sum + calculateWalletBalance(wallet, transactions), 0
  );

  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      const now = new Date();
      return t.type === 'income' && 
             date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = calculateMonthlySpending(transactions);
  const monthlyNet = monthlyIncome - monthlyExpenses;

  const activeBudget = budgets.find(b => b.isActive);
  const lowBalanceWallets = wallets.filter(w => 
    calculateWalletBalance(w, transactions) < w.minimumBalance
  );

  const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount);
  const totalFNPF = fnpfData.employeeContribution + fnpfData.employerContribution + fnpfData.voluntaryContribution;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Financial Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString('en-FJ')}
        </div>
      </div>

      {/* Alert Section */}
      {lowBalanceWallets.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Low Balance Alert</h3>
              <div className="text-sm text-red-700 mt-1">
                {lowBalanceWallets.map(wallet => (
                  <p key={wallet.id}>
                    {wallet.name}: {formatCurrency(calculateWalletBalance(wallet, transactions))} 
                    (Min: {formatCurrency(wallet.minimumBalance)})
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={Wallet}
          color="blue"
        />
        <DashboardCard
          title="Monthly Income"
          value={formatCurrency(monthlyIncome)}
          icon={TrendingUp}
          color="green"
        />
        <DashboardCard
          title="Monthly Expenses"
          value={formatCurrency(monthlyExpenses)}
          icon={CreditCard}
          color="red"
        />
        <DashboardCard
          title="Net Income"
          value={formatCurrency(monthlyNet)}
          icon={PiggyBank}
          color={monthlyNet >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="FNPF Balance"
          value={formatCurrency(totalFNPF)}
          icon={PiggyBank}
          color="purple"
        />
        <DashboardCard
          title="Active Goals"
          value={activeGoals.length.toString()}
          icon={Target}
          color="yellow"
        />
        <DashboardCard
          title="Total Wallets"
          value={wallets.filter(w => w.isActive).length.toString()}
          icon={Wallet}
          color="blue"
        />
      </div>

      {/* Budget and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
          {activeBudget ? (
            <BudgetProgress budget={activeBudget} transactions={transactions} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No active budget set</p>
              <button className="mt-2 text-sky-600 hover:text-sky-700 font-medium">
                Create Budget
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <RecentTransactions transactions={transactions.slice(0, 5)} wallets={wallets} />
        </div>
      </div>

      {/* Goals Progress */}
      {activeGoals.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.slice(0, 4).map(goal => (
              <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  <span className="text-sm text-gray-500">
                    {Math.round((goal.currentAmount / goal.targetAmount) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;