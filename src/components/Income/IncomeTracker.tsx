import React, { useState } from 'react';
import { Plus, Calculator, TrendingUp, PiggyBank } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';
import { calculateFNPFContributions, formatCurrency } from '../../utils/calculations';
import IncomeForm from './IncomeForm';
import FNPFCalculator from './FNPFCalculator';

const IncomeTracker: React.FC = () => {
  const { incomeSources, fnpfData, addIncomeSource, addTransaction } = useFinanceData();
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showFNPFCalculator, setShowFNPFCalculator] = useState(false);

  const totalMonthlyIncome = incomeSources
    .filter(source => source.isActive)
    .reduce((total, source) => {
      switch (source.frequency) {
        case 'weekly':
          return total + (source.amount * 4.33);
        case 'fortnightly':
          return total + (source.amount * 2.17);
        case 'monthly':
          return total + source.amount;
        case 'annually':
          return total + (source.amount / 12);
        default:
          return total;
      }
    }, 0);

  const fnpfEligibleIncome = incomeSources
    .filter(source => source.isActive && source.fnpfEligible)
    .reduce((total, source) => {
      switch (source.frequency) {
        case 'weekly':
          return total + (source.amount * 4.33);
        case 'fortnightly':
          return total + (source.amount * 2.17);
        case 'monthly':
          return total + source.amount;
        case 'annually':
          return total + (source.amount / 12);
        default:
          return total;
      }
    }, 0);

  const fnpfCalculations = calculateFNPFContributions(fnpfEligibleIncome);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Income & FNPF Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFNPFCalculator(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Calculator className="h-4 w-4 mr-2" />
            FNPF Calculator
          </button>
          <button
            onClick={() => setShowIncomeForm(true)}
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Income Source
          </button>
        </div>
      </div>

      {/* Income Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Monthly Income</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalMonthlyIncome)}</p>
            </div>
            <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">FNPF Eligible Income</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(fnpfEligibleIncome)}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <PiggyBank className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employee Contribution</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(fnpfCalculations.employeeContribution)}</p>
              <p className="text-xs text-gray-500 mt-1">8% of eligible income</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Monthly Income</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(fnpfCalculations.netSalary)}</p>
              <p className="text-xs text-gray-500 mt-1">After FNPF deduction</p>
            </div>
          </div>
        </div>
      </div>

      {/* FNPF Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">FNPF Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Employee Contribution</h4>
            <p className="text-2xl font-bold text-blue-600 mt-2">{formatCurrency(fnpfCalculations.employeeContribution)}</p>
            <p className="text-sm text-gray-600">Monthly (8%)</p>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Employer Contribution</h4>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{formatCurrency(fnpfCalculations.employerContribution)}</p>
            <p className="text-sm text-gray-600">Monthly (8%)</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Total Contribution</h4>
            <p className="text-2xl font-bold text-purple-600 mt-2">{formatCurrency(fnpfCalculations.totalContribution)}</p>
            <p className="text-sm text-gray-600">Monthly (16%)</p>
          </div>
        </div>
      </div>

      {/* Income Sources List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income Sources</h3>
        {incomeSources.length > 0 ? (
          <div className="space-y-4">
            {incomeSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{source.name}</h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{formatCurrency(source.amount)} / {source.frequency}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      source.fnpfEligible ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {source.fnpfEligible ? 'FNPF Eligible' : 'Not FNPF Eligible'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      source.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {source.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(
                      source.frequency === 'weekly' ? source.amount * 4.33 :
                      source.frequency === 'fortnightly' ? source.amount * 2.17 :
                      source.frequency === 'monthly' ? source.amount :
                      source.amount / 12
                    )}
                  </p>
                  <p className="text-sm text-gray-500">Monthly equivalent</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No income sources added yet</p>
            <button
              onClick={() => setShowIncomeForm(true)}
              className="mt-2 text-sky-600 hover:text-sky-700 font-medium"
            >
              Add your first income source
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showIncomeForm && (
        <IncomeForm
          onClose={() => setShowIncomeForm(false)}
          onSubmit={addIncomeSource}
        />
      )}

      {showFNPFCalculator && (
        <FNPFCalculator
          onClose={() => setShowFNPFCalculator(false)}
          currentFNPFData={fnpfData}
        />
      )}
    </div>
  );
};

export default IncomeTracker;