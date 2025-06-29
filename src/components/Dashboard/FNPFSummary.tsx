import React from 'react';
import { Building2, TrendingUp, DollarSign } from 'lucide-react';

const FNPFSummary: React.FC = () => {
  // Load FNPF configuration
  const fnpfConfig = JSON.parse(localStorage.getItem('fnpf-config') || '{"employeePercentage": 8.5, "personalContributionPercentage": 0}');
  
  // Mock FNPF data - in a real app this would come from the store
  const mockSalary = 2500; // Example monthly salary
  const employeeContribution = mockSalary * (fnpfConfig.employeePercentage / 100);
  const employerContribution = mockSalary * 0.085; // Standard 8.5%
  const totalMonthly = employeeContribution + employerContribution;
  const estimatedAnnual = totalMonthly * 12;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Building2 className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">FNPF Summary</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Employee Contribution</span>
          <span className="font-semibold text-gray-900">${employeeContribution.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Employer Contribution</span>
          <span className="font-semibold text-gray-900">${employerContribution.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-3 flex justify-between items-center">
          <span className="font-medium text-gray-900">Monthly Total</span>
          <span className="text-lg font-bold text-purple-600">${totalMonthly.toFixed(2)}</span>
        </div>
        
        <div className="bg-white p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-700">Annual Projection</span>
          </div>
          <p className="text-xl font-bold text-emerald-600">${estimatedAnnual.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default FNPFSummary;