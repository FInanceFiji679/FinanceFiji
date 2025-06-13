import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { Transaction, Wallet } from '../../types/finance';
import { formatCurrency } from '../../utils/calculations';

interface RecentTransactionsProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, wallets }) => {
  const getWalletName = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet?.name || 'Unknown Wallet';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowDownLeft className="h-4 w-4 text-emerald-400" />;
      case 'expense':
        return <ArrowUpRight className="h-4 w-4 text-red-400" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 text-cyan-400" />;
      default:
        return <ArrowRightLeft className="h-4 w-4 text-slate-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'needs':
        return 'bg-emerald-500/20 text-emerald-300';
      case 'wants':
        return 'bg-amber-500/20 text-amber-300';
      case 'responsibilities':
        return 'bg-cyan-500/20 text-cyan-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-600 rounded-full shadow-sm">
              {getTransactionIcon(transaction.type)}
            </div>
            <div>
              <p className="font-medium text-white text-sm">{transaction.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-slate-400">
                  {getWalletName(transaction.sourceWallet)}
                </span>
                {transaction.type !== 'transfer' && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                    {transaction.category}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-semibold text-sm ${
              transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-xs text-slate-500">
              {new Date(transaction.date).toLocaleDateString('en-FJ')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;