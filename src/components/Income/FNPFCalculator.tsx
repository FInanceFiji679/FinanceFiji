import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';
import { FNPFData } from '../../types/finance';
import { calculateFNPFContributions, formatCurrency } from '../../utils/calculations';

interface FNPFCalculatorProps {
  onClose: () => void;
  currentFNPFData: FNPFData;
}

const FNPFCalculator: React.FC<FNPFCalculatorProps> = ({ onClose, currentFNPFData }) => {
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [voluntaryContribution, setVoluntaryContribution] = useState<string>('');

  const calculations = grossSalary ? calculateFNPFContributions(parseFloat(grossSalary)) : null;
  const voluntaryAmount = voluntaryContribution ? parseFloat(voluntaryContribution) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">FNPF Calculator</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Salary Information</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gross Monthly Salary (FJD)
              </label>
              <input
                type="number"
                step="0.01"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your gross salary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Voluntary Contribution (FJD)
              </label>
              <input
                type="number"
                step="0.01"
                value={voluntaryContribution}
                onChange={(e) => setVoluntaryContribution(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Optional additional contribution"
              />
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-900 mb-2">FNPF Contribution Rules</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Employee contributes 8% of gross salary</li>
                <li>• Employer contributes 8% of gross salary</li>
                <li>• Total mandatory contribution: 16%</li>
                <li>• Additional voluntary contributions are optional</li>
              </ul>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Calculation Results</h4>
            
            {calculations ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Gross Salary</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(parseFloat(grossSalary))}</span>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Employee Contribution (8%)</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(calculations.employeeContribution)}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Employer Contribution (8%)</span>
                    <span className="font-semibold text-emerald-600">+{formatCurrency(calculations.employerContribution)}</span>
                  </div>
                </div>

                {voluntaryAmount > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Voluntary Contribution</span>
                      <span className="font-semibold text-purple-600">-{formatCurrency(voluntaryAmount)}</span>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Net Take-Home Salary</span>
                    <span className="text-xl font-bold text-gray-900">
                      {formatCurrency(calculations.netSalary - voluntaryAmount)}
                    </span>
                  </div>
                </div>

                <div className="bg-purple-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total FNPF Contribution</span>
                    <span className="text-xl font-bold text-purple-600">
                      {formatCurrency(calculations.totalContribution + voluntaryAmount)}
                    </span>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">
                    Employee + Employer + Voluntary
                  </p>
                </div>

                {/* Annual Projections */}
                <div className="mt-6">
                  <h5 className="font-medium text-gray-900 mb-3">Annual Projections</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-sky-50 p-3 rounded-lg text-center">
                      <p className="text-xs font-medium text-sky-700">Annual FNPF Total</p>
                      <p className="text-lg font-bold text-sky-600">
                        {formatCurrency((calculations.totalContribution + voluntaryAmount) * 12)}
                      </p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <p className="text-xs font-medium text-amber-700">Annual Net Income</p>
                      <p className="text-lg font-bold text-amber-600">
                        {formatCurrency((calculations.netSalary - voluntaryAmount) * 12)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter your gross salary to see calculations</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FNPFCalculator;