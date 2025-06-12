import React, { useState } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

const TransactionManager: React.FC = () => {
  const { transactions, wallets, addTransaction } = useFinanceData();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Type', 'Amount', 'Category', 'Subcategory', 'Description', 'Source Wallet', 'Destination Wallet'],
      ...transactions.map(t => [
        t.date,
        t.type,
        t.amount.toString(),
        t.category || '',
        t.subcategory || '',
        t.description,
        wallets.find(w => w.id === t.sourceWallet)?.name || '',
        t.destinationWallet ? wallets.find(w => w.id === t.destinationWallet)?.name || '' : ''
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Transaction Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={exportTransactions}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => setShowTransactionForm(true)}
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </button>
        </div>
      </div>

      <TransactionList transactions={transactions} wallets={wallets} />

      {showTransactionForm && (
        <TransactionForm
          onClose={() => setShowTransactionForm(false)}
          onSubmit={addTransaction}
        />
      )}
    </div>
  );
};

export default TransactionManager;