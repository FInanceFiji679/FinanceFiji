import React, { useState } from 'react';
import { Download, Calendar, PieChart, BarChart3, TrendingUp, FileText } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { formatCurrency, calculateMonthlySpending } from '../../utils/calculations';

const ReportsGenerator: React.FC = () => {
  const { transactions, wallets, budgets, loans, incomeSources, fnpfData } = useFinanceData();
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('summary');

  const getDateRangeTransactions = () => {
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

    return transactions.filter(t => new Date(t.date) >= startDate);
  };

  const filteredTransactions = getDateRangeTransactions();

  const generateSummaryReport = () => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = {
      needs: filteredTransactions
        .filter(t => t.type === 'expense' && t.category === 'needs')
        .reduce((sum, t) => sum + t.amount, 0),
      wants: filteredTransactions
        .filter(t => t.type === 'expense' && t.category === 'wants')
        .reduce((sum, t) => sum + t.amount, 0),
      responsibilities: filteredTransactions
        .filter(t => t.type === 'expense' && t.category === 'responsibilities')
        .reduce((sum, t) => sum + t.amount, 0)
    };

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      categoryBreakdown,
      transactionCount: filteredTransactions.length
    };
  };

  const generateCategoryReport = () => {
    const categories = ['needs', 'wants', 'responsibilities'];
    return categories.map(category => {
      const categoryTransactions = filteredTransactions.filter(
        t => t.type === 'expense' && t.category === category
      );
      
      const subcategoryBreakdown = categoryTransactions.reduce((acc, t) => {
        acc[t.subcategory] = (acc[t.subcategory] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

      return {
        category,
        total: categoryTransactions.reduce((sum, t) => sum + t.amount, 0),
        count: categoryTransactions.length,
        subcategories: subcategoryBreakdown
      };
    });
  };

  const exportReport = () => {
    let reportData: string[] = [];
    const reportTitle = `Finance Fiji Report - ${dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}`;
    const dateGenerated = new Date().toLocaleDateString('en-FJ');

    reportData.push(reportTitle);
    reportData.push(`Generated: ${dateGenerated}`);
    reportData.push('');

    if (reportType === 'summary') {
      const summary = generateSummaryReport();
      reportData.push('FINANCIAL SUMMARY');
      reportData.push('==================');
      reportData.push(`Total Income: ${formatCurrency(summary.totalIncome)}`);
      reportData.push(`Total Expenses: ${formatCurrency(summary.totalExpenses)}`);
      reportData.push(`Net Income: ${formatCurrency(summary.netIncome)}`);
      reportData.push(`Total Transactions: ${summary.transactionCount}`);
      reportData.push('');
      reportData.push('CATEGORY BREAKDOWN');
      reportData.push('==================');
      reportData.push(`Needs: ${formatCurrency(summary.categoryBreakdown.needs)}`);
      reportData.push(`Wants: ${formatCurrency(summary.categoryBreakdown.wants)}`);
      reportData.push(`Responsibilities: ${formatCurrency(summary.categoryBreakdown.responsibilities)}`);
    } else if (reportType === 'transactions') {
      reportData.push('TRANSACTION HISTORY');
      reportData.push('===================');
      reportData.push('Date,Type,Amount,Category,Description,Wallet');
      filteredTransactions.forEach(t => {
        const wallet = wallets.find(w => w.id === t.sourceWallet)?.name || 'Unknown';
        reportData.push(`${t.date},${t.type},${t.amount},${t.category || ''},${t.description},${wallet}`);
      });
    }

    const blob = new Blob([reportData.join('\n')], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-fiji-${reportType}-${dateRange}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const summaryData = generateSummaryReport();
  const categoryData = generateCategoryReport();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
        <button
          onClick={exportReport}
          className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last 12 Months</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="summary">Financial Summary</option>
              <option value="transactions">Transaction History</option>
              <option value="category">Category Analysis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summaryData.totalIncome)}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(summaryData.totalExpenses)}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className={`text-2xl font-bold mt-1 ${
                summaryData.netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {formatCurrency(summaryData.netIncome)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-sky-100 text-sky-600">
              <PieChart className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{summaryData.transactionCount}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryData.map((category) => (
            <div key={category.category} className="space-y-4">
              <div className={`p-4 rounded-lg ${
                category.category === 'needs' ? 'bg-emerald-50' :
                category.category === 'wants' ? 'bg-amber-50' : 'bg-sky-50'
              }`}>
                <h4 className="font-medium text-gray-900 capitalize">{category.category}</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(category.total)}</p>
                <p className="text-sm text-gray-600">{category.count} transactions</p>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700">Top Subcategories</h5>
                {Object.entries(category.subcategories)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([subcategory, amount]) => (
                    <div key={subcategory} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{subcategory}</span>
                      <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FNPF Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">FNPF Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Employee Contributions</h4>
            <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(fnpfData.employeeContribution)}</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Employer Contributions</h4>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{formatCurrency(fnpfData.employerContribution)}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Total FNPF Balance</h4>
            <p className="text-2xl font-bold text-purple-600 mt-2">{formatCurrency(fnpfData.totalBalance)}</p>
          </div>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Wallet Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.filter(w => w.isActive).map((wallet) => {
            const balance = wallet.balance; // In a real app, this would calculate current balance
            return (
              <div key={wallet.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{wallet.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{wallet.type}</p>
                </div>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(balance)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsGenerator;