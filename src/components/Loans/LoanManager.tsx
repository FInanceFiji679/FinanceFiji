import React, { useState } from 'react';
import { Plus, Calendar, DollarSign, Percent, Clock } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { formatCurrency, generatePaymentSchedule } from '../../utils/calculations';
import LoanForm from './LoanForm';

const LoanManager: React.FC = () => {
  const { loans, addLoan } = useFinanceData();
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  const totalLoanBalance = loans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const totalMonthlyPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loan Management</h2>
          <p className="text-gray-600 mt-1">
            Total Outstanding: {formatCurrency(totalLoanBalance)} | 
            Monthly Payments: {formatCurrency(totalMonthlyPayments)}
          </p>
        </div>
        <button
          onClick={() => setShowLoanForm(true)}
          className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Loan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalLoanBalance)}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Payments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalMonthlyPayments)}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{loans.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Loans</h3>
        </div>
        
        {loans.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {loans.map((loan) => {
              const progressPercentage = ((loan.principal - loan.remainingBalance) / loan.principal) * 100;
              const schedule = generatePaymentSchedule(loan);
              const totalInterest = schedule.reduce((sum, payment) => sum + payment.interest, 0);
              
              return (
                <div key={loan.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{loan.name}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Percent className="h-4 w-4 mr-1" />
                          {loan.interestRate}% APR
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {loan.termMonths} months
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Next: {new Date(loan.nextPaymentDate).toLocaleDateString('en-FJ')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Monthly Payment</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(loan.monthlyPayment)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Original Amount</p>
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(loan.principal)}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Remaining Balance</p>
                      <p className="text-lg font-semibold text-red-600">{formatCurrency(loan.remainingBalance)}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Total Interest</p>
                      <p className="text-lg font-semibold text-amber-600">{formatCurrency(totalInterest)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Loan Progress</span>
                      <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% paid</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-emerald-500 h-3 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}
                    className="text-sky-600 hover:text-sky-700 text-sm font-medium"
                  >
                    {selectedLoan === loan.id ? 'Hide' : 'View'} Payment Schedule
                  </button>

                  {selectedLoan === loan.id && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Payment Schedule (First 12 months)</h5>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2">Month</th>
                              <th className="text-right py-2">Payment</th>
                              <th className="text-right py-2">Principal</th>
                              <th className="text-right py-2">Interest</th>
                              <th className="text-right py-2">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {schedule.slice(0, 12).map((payment) => (
                              <tr key={payment.month} className="border-b border-gray-100">
                                <td className="py-2">{payment.month}</td>
                                <td className="text-right py-2">{formatCurrency(payment.payment)}</td>
                                <td className="text-right py-2">{formatCurrency(payment.principal)}</td>
                                <td className="text-right py-2">{formatCurrency(payment.interest)}</td>
                                <td className="text-right py-2">{formatCurrency(payment.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No loans added yet</p>
            <button
              onClick={() => setShowLoanForm(true)}
              className="mt-2 text-sky-600 hover:text-sky-700 font-medium"
            >
              Add your first loan
            </button>
          </div>
        )}
      </div>

      {showLoanForm && (
        <LoanForm
          onClose={() => setShowLoanForm(false)}
          onSubmit={addLoan}
        />
      )}
    </div>
  );
};

export default LoanManager;