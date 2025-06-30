import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { Loan } from '../../types/finance';
import { calculateLoanPayment } from '../../utils/calculations';

interface LoanFormProps {
  onClose: () => void;
  onSubmit: (loan: Omit<Loan, 'id' | 'payments'>) => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    principal: '',
    interestRate: '',
    termMonths: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [calculatedPayment, setCalculatedPayment] = useState<number | null>(null);

  const handleCalculate = () => {
    if (formData.principal && formData.interestRate && formData.termMonths) {
      const payment = calculateLoanPayment(
        parseFloat(formData.principal),
        parseFloat(formData.interestRate),
        parseInt(formData.termMonths)
      );
      setCalculatedPayment(payment);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const monthlyPayment = calculatedPayment || calculateLoanPayment(
      parseFloat(formData.principal),
      parseFloat(formData.interestRate),
      parseInt(formData.termMonths)
    );

    const startDate = new Date(formData.startDate);
    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    onSubmit({
      name: formData.name,
      principal: parseFloat(formData.principal),
      interestRate: parseFloat(formData.interestRate),
      termMonths: parseInt(formData.termMonths),
      startDate: formData.startDate,
      monthlyPayment,
      remainingBalance: parseFloat(formData.principal),
      nextPaymentDate: nextPaymentDate.toISOString().split('T')[0]
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Loan</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., Home Loan, Car Loan"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Principal Amount (FJD)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.principal}
              onChange={(e) => {
                setFormData({ ...formData, principal: e.target.value });
                setCalculatedPayment(null);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (% per year)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => {
                  setFormData({ ...formData, interestRate: e.target.value });
                  setCalculatedPayment(null);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="5.50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term (Months)
              </label>
              <input
                type="number"
                value={formData.termMonths}
                onChange={(e) => {
                  setFormData({ ...formData, termMonths: e.target.value });
                  setCalculatedPayment(null);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="360"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="bg-sky-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Monthly Payment</span>
              <button
                type="button"
                onClick={handleCalculate}
                className="inline-flex items-center px-3 py-1 bg-sky-600 text-white text-xs rounded-md hover:bg-sky-700 transition-colors"
              >
                <Calculator className="h-3 w-3 mr-1" />
                Calculate
              </button>
            </div>
            <p className="text-xl font-bold text-sky-600">
              {calculatedPayment ? `$${calculatedPayment.toFixed(2)}` : 'Click calculate'}
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
            >
              Add Loan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanForm;