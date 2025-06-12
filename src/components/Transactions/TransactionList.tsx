import React, { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Receipt, Calendar } from 'lucide-react';
import { Transaction, Wallet } from '../../types/finance';
import { formatCurrency } from '../../utils/calculations';

interface TransactionListProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, wallets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const getWalletName = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet?.name || 'Unknown Wallet';
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowDownLeft className="h-5 w-5 text-emerald-600" />;
      case 'expense':
        return <ArrowUpRight className="h-5 w-5 text-red-600" />;
      case 'transfer':
        return <ArrowRightLeft className="h-5 w-5 text-blue-600" />;
      default:
        return <ArrowRightLeft className="h-5 w-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'needs':
        return 'bg-emerald-100 text-emerald-800';
      case 'wants':
        return 'bg-amber-100 text-amber-800';
      case 'responsibilities':
        return 'bg-sky-100 text-sky-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      
      switch (dateRange) {
        case 'today':
          matchesDate = transactionDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = transactionDate >= weekAgo;
          break;
        case 'month':
          matchesDate = transactionDate.getMonth() === now.getMonth() && 
                       transactionDate.getFullYear() === now.getFullYear();
          break;
        case 'year':
          matchesDate = transactionDate.getFullYear() === now.getFullYear();
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesCategory && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Search transactions..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Categories</option>
              <option value="needs">Needs</option>
              <option value="wants">Wants</option>
              <option value="responsibilities">Responsibilities</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Transactions ({filteredTransactions.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500">
                          {getWalletName(transaction.sourceWallet)}
                          {transaction.destinationWallet && (
                            <> → {getWalletName(transaction.destinationWallet)}</>
                          )}
                        </span>
                        {transaction.type !== 'transfer' && (
                          <>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(transaction.category)}`}>
                              {transaction.category}
                            </span>
                            <span className="text-xs text-gray-500">{transaction.subcategory}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 
                      transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('en-FJ')}
                      </span>
                      {transaction.receiptUrl && (
                        <a
                          href={transaction.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:text-sky-700"
                        >
                          <Receipt className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;