import React, { useState } from 'react';
import { Plus, Download, Edit, Save, X, TrendingUp, TrendingDown, DollarSign, Calendar, FileText, Building2, Smartphone, Wallet, Lock, Unlock } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import TransactionForm from './TransactionForm';
import AllocationSettings from './AllocationSettings';

const TransactionManager: React.FC = () => {
  const { 
    transactions, 
    budgetSettings, 
    updateBudgetSettings,
    deleteTransaction,
    needsBudget,
    wantsBudget,
    responsibilitiesBudget,
    needsSpent,
    wantsSpent,
    responsibilitiesSpent,
    totalSpent,
    remainingSalary
  } = useFinanceStore();

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showAllocationSettings, setShowAllocationSettings] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('month');

  const bankAccounts = [
    { id: 'anz', name: 'ANZ Bank', icon: Building2, color: 'blue' },
    { id: 'baroda', name: 'Bank of Baroda', icon: Building2, color: 'orange' },
    { id: 'bsp', name: 'Bank of South Pacific (BSP)', icon: Building2, color: 'red' },
    { id: 'bred', name: 'Bred Bank', icon: Building2, color: 'green' },
    { id: 'hfc', name: 'HFC Bank', icon: Building2, color: 'purple' },
    { id: 'westpac', name: 'Westpac Banking Corporation', icon: Building2, color: 'red' },
    { id: 'mpaisa', name: 'MPaisa Wallet', icon: Smartphone, color: 'indigo' },
    { id: 'cash', name: 'Cash', icon: Wallet, color: 'emerald' }
  ];

  const getAccountInfo = (accountId: string) => {
    return bankAccounts.find(acc => acc.id === accountId) || bankAccounts[0];
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0);
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const matchesDate = transactionDate >= startDate;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      const matchesAccount = filterAccount === 'all' || transaction.account === filterAccount;
      
      return matchesDate && matchesCategory && matchesAccount;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Amount', 'Category', 'Account', 'Description', 'Document'],
      ...filteredTransactions.map(t => [
        t.date,
        t.amount.toString(),
        t.category,
        getAccountInfo(t.account).name,
        t.description,
        t.documentUrl || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-fiji-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'needs':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'wants':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'responsibilities':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccountColor = (accountId: string) => {
    const account = getAccountInfo(accountId);
    const colorMap = {
      blue: 'text-blue-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
      emerald: 'text-emerald-600'
    };
    return colorMap[account.color as keyof typeof colorMap] || 'text-gray-600';
  };

  const isAllocationLocked = budgetSettings.allocationLocked || false;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-xl">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Transaction Management</h1>
              <p className="text-slate-300">Complete financial tracking and allocation control</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAllocationSettings(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200"
            >
              {isAllocationLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
              <span>Allocations</span>
            </button>
            <button
              onClick={exportTransactions}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all duration-200"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowTransactionForm(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Needs</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Spent</span>
              <span className="font-semibold">${needsSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Budget</span>
              <span className="font-semibold">${needsBudget.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  needsSpent > needsBudget ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min((needsSpent / needsBudget) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className={`font-semibold ${
                needsBudget - needsSpent >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                ${(needsBudget - needsSpent).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <TrendingDown className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Wants</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Spent</span>
              <span className="font-semibold">${wantsSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Budget</span>
              <span className="font-semibold">${wantsBudget.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  wantsSpent > wantsBudget ? 'bg-red-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min((wantsSpent / wantsBudget) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className={`font-semibold ${
                wantsBudget - wantsSpent >= 0 ? 'text-amber-600' : 'text-red-600'
              }`}>
                ${(wantsBudget - wantsSpent).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Savings</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Spent</span>
              <span className="font-semibold">${responsibilitiesSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Budget</span>
              <span className="font-semibold">${responsibilitiesBudget.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  responsibilitiesSpent > responsibilitiesBudget ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min((responsibilitiesSpent / responsibilitiesBudget) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className={`font-semibold ${
                responsibilitiesBudget - responsibilitiesSpent >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                ${(responsibilitiesBudget - responsibilitiesSpent).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Wallet className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Income</span>
              <span className="font-semibold">${budgetSettings.monthlyIncome.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Spent</span>
              <span className="font-semibold">${totalSpent.toFixed(2)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  totalSpent > budgetSettings.monthlyIncome ? 'bg-red-500' : 'bg-purple-500'
                }`}
                style={{ width: `${Math.min((totalSpent / budgetSettings.monthlyIncome) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Remaining</span>
              <span className={`font-semibold ${
                remainingSalary >= 0 ? 'text-purple-600' : 'text-red-600'
              }`}>
                ${remainingSalary.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Transactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="needs">Needs</option>
              <option value="wants">Wants</option>
              <option value="responsibilities">Savings</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Accounts</option>
              {bankAccounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Transactions ({filteredTransactions.length})
            </h3>
            <div className="text-sm text-gray-600">
              Total: ${filteredTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => {
              const accountInfo = getAccountInfo(transaction.account);
              const AccountIcon = accountInfo.icon;
              
              return (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gray-100`}>
                        <AccountIcon className={`h-5 w-5 ${getAccountColor(transaction.account)}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{transaction.description}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm text-gray-500">{accountInfo.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(transaction.category)}`}>
                            {transaction.category}
                          </span>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(transaction.date).toLocaleDateString('en-FJ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${transaction.amount.toFixed(2)}
                        </div>
                        {transaction.documentUrl && (
                          <a
                            href={transaction.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View Document
                          </a>
                        )}
                      </div>
                      
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No transactions found</h3>
              <p>Add your first transaction to start tracking your finances</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          bankAccounts={bankAccounts}
        />
      )}

      {showAllocationSettings && (
        <AllocationSettings
          onClose={() => setShowAllocationSettings(false)}
          budgetSettings={budgetSettings}
          updateBudgetSettings={updateBudgetSettings}
        />
      )}
    </div>
  );
};

export default TransactionManager;