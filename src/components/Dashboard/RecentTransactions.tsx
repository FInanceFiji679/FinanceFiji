import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Calendar, Building2, Smartphone, Wallet } from 'lucide-react';
import { Transaction } from '../../hooks/useFinanceStore';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const getTransactionIcon = (category: string) => {
    switch (category) {
      case 'needs':
        return <ArrowUpRight className="h-4 w-4 text-emerald-600" />;
      case 'wants':
        return <ArrowUpRight className="h-4 w-4 text-amber-600" />;
      case 'responsibilities':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      default:
        return <ArrowRightLeft className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAccountIcon = (account: string) => {
    if (account === 'mpaisa') return <Smartphone className="h-4 w-4 text-indigo-600" />;
    if (account === 'cash') return <Wallet className="h-4 w-4 text-emerald-600" />;
    return <Building2 className="h-4 w-4 text-blue-600" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'needs':
        return 'bg-emerald-100 text-emerald-800';
      case 'wants':
        return 'bg-amber-100 text-amber-800';
      case 'responsibilities':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccountName = (account: string) => {
    const accountMap: Record<string, string> = {
      'anz': 'ANZ Bank',
      'baroda': 'Bank of Baroda',
      'bsp': 'BSP',
      'bred': 'Bred Bank',
      'hfc': 'HFC Bank',
      'westpac': 'Westpac',
      'mpaisa': 'MPaisa',
      'cash': 'Cash'
    };
    return accountMap[account] || account;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No transactions yet</p>
        <p className="text-sm">Start tracking your expenses</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-full shadow-sm">
              {getTransactionIcon(transaction.category)}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500 flex items-center space-x-1">
                  {getAccountIcon(transaction.account)}
                  <span>{getAccountName(transaction.account)}</span>
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString('en-FJ')}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm text-gray-900">
              ${transaction.amount.toFixed(2)}
            </p>
            {transaction.documentUrl && (
              <a
                href={transaction.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                View Doc
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;