import React, { useState } from 'react';
import { Plus, Edit, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { calculateWalletBalance, formatCurrency } from '../../utils/calculations';
import WalletForm from './WalletForm';

const WalletManager: React.FC = () => {
  const { wallets, transactions, addWallet, updateWallet } = useFinanceData();
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);

  const getWalletTypeIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return '🏦';
      case 'mpaisa':
        return '📱';
      case 'cash':
        return '💵';
      case 'savings':
        return '🏛️';
      default:
        return '💳';
    }
  };

  const getWalletTypeColor = (type: string) => {
    switch (type) {
      case 'bank':
        return 'bg-blue-50 border-blue-200';
      case 'mpaisa':
        return 'bg-purple-50 border-purple-200';
      case 'cash':
        return 'bg-emerald-50 border-emerald-200';
      case 'savings':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getRecentTransactions = (walletId: string) => {
    return transactions
      .filter(t => t.sourceWallet === walletId || t.destinationWallet === walletId)
      .slice(0, 3);
  };

  const totalBalance = wallets.reduce((sum, wallet) => 
    sum + calculateWalletBalance(wallet, transactions), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wallet Management</h2>
          <p className="text-gray-600 mt-1">Total Balance: {formatCurrency(totalBalance)}</p>
        </div>
        <button
          onClick={() => setShowWalletForm(true)}
          className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => {
          const currentBalance = calculateWalletBalance(wallet, transactions);
          const isLowBalance = currentBalance < wallet.minimumBalance;
          const recentTransactions = getRecentTransactions(wallet.id);
          
          return (
            <div
              key={wallet.id}
              className={`rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                wallet.isActive ? getWalletTypeColor(wallet.type) : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getWalletTypeIcon(wallet.type)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{wallet.type} Account</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingWallet(wallet);
                    setShowWalletForm(true);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Current Balance</span>
                  {isLowBalance && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${
                  currentBalance >= 0 ? 'text-gray-900' : 'text-red-600'
                }`}>
                  {formatCurrency(currentBalance, wallet.currency)}
                </p>
                {isLowBalance && (
                  <p className="text-xs text-red-600 mt-1">
                    Below minimum balance of {formatCurrency(wallet.minimumBalance, wallet.currency)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Recent Activity</h4>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-1">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate flex-1">
                          {transaction.description}
                        </span>
                        <div className="flex items-center space-x-1 ml-2">
                          {transaction.sourceWallet === wallet.id ? (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          ) : (
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                          )}
                          <span className={`font-medium ${
                            transaction.sourceWallet === wallet.id ? 'text-red-600' : 'text-emerald-600'
                          }`}>
                            {transaction.sourceWallet === wallet.id ? '-' : '+'}
                            {formatCurrency(transaction.amount, wallet.currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No recent transactions</p>
                )}
              </div>

              {!wallet.isActive && (
                <div className="mt-4 p-2 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">Inactive Wallet</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showWalletForm && (
        <WalletForm
          onClose={() => {
            setShowWalletForm(false);
            setEditingWallet(null);
          }}
          onSubmit={(walletData) => {
            if (editingWallet) {
              updateWallet(editingWallet.id, walletData);
            } else {
              addWallet(walletData);
            }
          }}
          editWallet={editingWallet}
        />
      )}
    </div>
  );
};

export default WalletManager;