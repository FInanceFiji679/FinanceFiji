import React, { useState } from 'react';
import { X, DollarSign, Calendar, Building2, Plus, User, Gift } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';

interface SalaryInputFormProps {
  onClose: () => void;
  onSubmit: (salaryData: any) => void;
}

const SalaryInputForm: React.FC<SalaryInputFormProps> = ({ onClose, onSubmit }) => {
  const { wallets } = useFinanceData();
  const [formData, setFormData] = useState({
    type: 'salary' as 'salary' | 'other',
    amount: '',
    frequency: 'monthly' as 'weekly' | 'bi-weekly' | 'monthly',
    date: new Date().toISOString().split('T')[0],
    source: '',
    destinationWallet: wallets[0]?.id || '',
    description: '',
    // Additional income fields
    name: '',
    category: 'freelance' as 'freelance' | 'bonus' | 'gift' | 'other'
  });

  // Load FNPF configuration
  const fnpfConfig = JSON.parse(localStorage.getItem('fnpf-config') || '{"employeePercentage": 8.5, "personalContributionPercentage": 0}');

  const calculateFNPFDeductions = () => {
    const grossAmount = parseFloat(formData.amount) || 0;
    const employeeDeduction = grossAmount * (fnpfConfig.employeePercentage / 100);
    const personalDeduction = grossAmount * (fnpfConfig.personalContributionPercentage / 100);
    const totalDeductions = employeeDeduction + personalDeduction;
    const netAmount = grossAmount - totalDeductions;

    return {
      grossAmount,
      employeeDeduction,
      personalDeduction,
      totalDeductions,
      netAmount
    };
  };

  const fnpfCalculation = calculateFNPFDeductions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const salaryData = {
      ...formData,
      amount: parseFloat(formData.amount),
      fnpfDeductions: formData.type === 'salary' ? {
        employeeDeduction: fnpfCalculation.employeeDeduction,
        personalDeduction: fnpfCalculation.personalDeduction,
        totalDeductions: fnpfCalculation.totalDeductions,
        netAmount: fnpfCalculation.netAmount
      } : null
    };
    
    onSubmit(salaryData);
    onClose();
  };

  const getIncomeTypeIcon = (type: string) => {
    switch (type) {
      case 'salary': return Building2;
      case 'other': return Plus;
      default: return DollarSign;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'freelance': return User;
      case 'bonus': return DollarSign;
      case 'gift': return Gift;
      case 'other': return Plus;
      default: return DollarSign;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Add Income</h2>
                <p className="text-emerald-100">Record your salary or additional income</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Income Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Income Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'salary' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'salary'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Salary</div>
                <div className="text-xs text-gray-500">Regular employment income with FNPF</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'other' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'other'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Other Income</div>
                <div className="text-xs text-gray-500">Freelance, bonus, gifts, etc.</div>
              </button>
            </div>
          </div>

          {/* Salary Section */}
          {formData.type === 'salary' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Salary Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gross Salary Amount (FJD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employer/Source *
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="e.g., ABC Company Ltd"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Other Income Section */}
          {formData.type === 'other' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Income Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Income Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Freelance Project, Birthday Gift"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (FJD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="freelance">Freelance Work</option>
                    <option value="bonus">Bonus/Commission</option>
                    <option value="gift">Gift/Inheritance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source
                  </label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Client Name, Company"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Destination Wallet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Account *
            </label>
            <select
              value={formData.destinationWallet}
              onChange={(e) => setFormData({ ...formData, destinationWallet: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              required
            >
              {wallets.filter(w => w.isActive).map(wallet => (
                <option key={wallet.id} value={wallet.id}>{wallet.name} ({wallet.type})</option>
              ))}
            </select>
          </div>

          {/* FNPF Calculation Preview (for salary only) */}
          {formData.type === 'salary' && formData.amount && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-medium text-gray-900 mb-4">FNPF Deduction Preview</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gross Salary:</span>
                    <span className="font-medium">${fnpfCalculation.grossAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Employee FNPF ({fnpfConfig.employeePercentage}%):</span>
                    <span className="font-medium text-red-600">-${fnpfCalculation.employeeDeduction.toFixed(2)}</span>
                  </div>
                  {fnpfConfig.personalContributionPercentage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Personal Contribution ({fnpfConfig.personalContributionPercentage}%):</span>
                      <span className="font-medium text-red-600">-${fnpfCalculation.personalDeduction.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Deductions:</span>
                    <span className="font-medium text-red-600">-${fnpfCalculation.totalDeductions.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium text-gray-900">Net Amount:</span>
                    <span className="text-xl font-bold text-emerald-600">${fnpfCalculation.netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> FNPF deductions will be automatically recorded as separate transactions. 
                  The net amount will be added to your selected account.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 ${
                formData.type === 'salary' 
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
              }`}
            >
              Add {formData.type === 'salary' ? 'Salary' : 'Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryInputForm;