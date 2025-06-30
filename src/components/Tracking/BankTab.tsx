import React from 'react';
import { Building2, TrendingUp, DollarSign, Calendar, Minus, Plus } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import BudgetHeader from '../Shared/BudgetHeader';

const BankTab: React.FC = () => {
  const { 
    bankBalance, 
    budgetSettings, 
    totalSpent, 
    fixedExpensesTotal, 
    monthlyArchive,
    remainingSalary 
  } = useFinanceStore();

  // Calculate monthly breakdown
  const monthlyBreakdown = {
    initialSalary: budgetSettings.monthlyIncome,
    totalDeductions: totalSpent + fixedExpensesTotal,
    currentMonthRemainder: remainingSalary,
    accumulatedBalance: bankBalance
  };

  // Get historical data for the last 6 months
  const recentHistory = monthlyArchive.slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Bank Balance Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-white/20 rounded-xl">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Bank Account</h1>
              <p className="text-indigo-100">Your accumulated financial balance</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-5xl font-bold mb-2">
              ${bankBalance.toFixed(2)}
            </div>
            <div className="text-indigo-100">
              Total Balance
            </div>
          </div>
        </div>

        {/* Balance Indicator */}
        <div className="mt-6 flex items-center justify-center space-x-2">
          {bankBalance >= 0 ? (
            <>
              <TrendingUp className="h-5 w-5 text-emerald-300" />
              <span className="text-indigo-100 text-sm">
                Positive balance - Great financial management!
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5 text-red-300 rotate-180" />
              <span className="text-indigo-100 text-sm">
                Negative balance - Consider reviewing your spending
              </span>
            </>
          )}
        </div>
      </div>

      {/* Current Month Breakdown */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Current Month Breakdown</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700">Income & Deductions</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-slate-800">Monthly Salary</span>
                </div>
                <span className="text-xl font-bold text-emerald-600">
                  +${monthlyBreakdown.initialSalary.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Minus className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-slate-800">Total Spending</span>
                </div>
                <span className="text-xl font-bold text-red-600">
                  -${totalSpent.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Minus className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-slate-800">Fixed Expenses</span>
                </div>
                <span className="text-xl font-bold text-red-600">
                  -${fixedExpensesTotal.toFixed(2)}
                </span>
              </div>

              <div className="border-t-2 border-slate-200 pt-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-slate-800">Month Remainder</span>
                  </div>
                  <span className={`text-xl font-bold ${
                    monthlyBreakdown.currentMonthRemainder >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    ${monthlyBreakdown.currentMonthRemainder.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-700">Balance Summary</h3>
            
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
              <div className="text-center">
                <h4 className="text-lg font-medium text-indigo-800 mb-2">Accumulated Bank Balance</h4>
                <p className={`text-4xl font-bold ${
                  bankBalance >= 0 ? 'text-indigo-600' : 'text-red-600'
                }`}>
                  ${bankBalance.toFixed(2)}
                </p>
                <p className="text-sm text-indigo-600 mt-2">
                  {bankBalance >= 0 ? 'Available for future use' : 'Requires attention'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2">How It Works</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Monthly remainder is added to bank balance</li>
                <li>• Balance persists across months</li>
                <li>• Never resets automatically</li>
                <li>• Tracks your long-term financial health</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly History */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Monthly History</h2>
          <p className="text-slate-600 mt-1">Track your financial progress over time</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {recentHistory.length > 0 ? (
            recentHistory.map((monthData, index) => (
              <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {monthData.month} {monthData.year}
                      </h3>
                      <p className="text-sm text-slate-500">
                        Income: ${monthData.budgetSettings.monthlyIncome.toFixed(2)} | 
                        Spent: ${monthData.totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      monthData.remainingSalary >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {monthData.remainingSalary >= 0 ? '+' : ''}${monthData.remainingSalary.toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-500">
                      {monthData.remainingSalary >= 0 ? 'Added to bank' : 'Deficit'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">No history yet</h3>
              <p>Complete your first month to see historical data</p>
            </div>
          )}
        </div>
      </div>

      {/* Financial Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-xl ${
              bankBalance >= 0 ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`h-6 w-6 ${
                bankBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Financial Health</h3>
          </div>
          <p className={`text-2xl font-bold ${
            bankBalance >= 0 ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {bankBalance >= 0 ? 'Positive' : 'Needs Attention'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {bankBalance >= 0 ? 'Great money management!' : 'Consider reducing expenses'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Average</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            ${recentHistory.length > 0 
              ? (recentHistory.reduce((sum, month) => sum + month.remainingSalary, 0) / recentHistory.length).toFixed(2)
              : '0.00'
            }
          </p>
          <p className="text-sm text-gray-600 mt-1">Average monthly remainder</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Months Tracked</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">{monthlyArchive.length}</p>
          <p className="text-sm text-gray-600 mt-1">Total months of data</p>
        </div>
      </div>
    </div>
  );
};

export default BankTab;