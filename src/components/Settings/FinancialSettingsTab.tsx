import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Wallet, DollarSign, Calendar, Settings, CheckCircle, AlertCircle, Building2, CreditCard, Percent, Clock } from 'lucide-react';
import { useFinanceData } from '../../hooks/useFinanceData';

interface WalletConfig {
  id: string;
  name: string;
  transactionFeeAmount: number;
  transactionFeeEnabled: boolean;
  bankAssociation: string;
  applyToNeeds: boolean;
  applyToWants: boolean;
}

interface FNPFConfig {
  employeePercentage: number;
  personalContributionPercentage: number;
  showOnDashboard: boolean;
  includeInReports: boolean;
  emailNotifications: boolean;
}

const FinancialSettingsTab: React.FC = () => {
  const { wallets, addWallet, updateWallet } = useFinanceData();
  
  const [walletConfigs, setWalletConfigs] = useState<WalletConfig[]>([]);
  const [fnpfConfig, setFnpfConfig] = useState<FNPFConfig>({
    employeePercentage: 8.5,
    personalContributionPercentage: 0,
    showOnDashboard: true,
    includeInReports: true,
    emailNotifications: false
  });

  const [activeSection, setActiveSection] = useState('wallets');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load saved configurations
  useEffect(() => {
    const savedWalletConfigs = localStorage.getItem('wallet-configs');
    const savedFnpfConfig = localStorage.getItem('fnpf-config');

    if (savedWalletConfigs) {
      setWalletConfigs(JSON.parse(savedWalletConfigs));
    } else {
      // Initialize with existing wallets
      const initialConfigs = wallets.map(wallet => ({
        id: wallet.id,
        name: wallet.name,
        transactionFeeAmount: 0,
        transactionFeeEnabled: false,
        bankAssociation: '',
        applyToNeeds: true,
        applyToWants: true
      }));
      setWalletConfigs(initialConfigs);
    }

    if (savedFnpfConfig) {
      setFnpfConfig(JSON.parse(savedFnpfConfig));
    }
  }, [wallets]);

  // Auto-save functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (walletConfigs.length > 0) {
        saveConfigurations();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [walletConfigs, fnpfConfig]);

  const saveConfigurations = async () => {
    setSaveStatus('saving');
    
    try {
      // Validate all configurations
      const errors = validateConfigurations();
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setSaveStatus('error');
        return;
      }

      // Save to localStorage
      localStorage.setItem('wallet-configs', JSON.stringify(walletConfigs));
      localStorage.setItem('fnpf-config', JSON.stringify(fnpfConfig));

      // Create daily backup
      const backupData = {
        walletConfigs,
        fnpfConfig,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(`settings-backup-${new Date().toDateString()}`, JSON.stringify(backupData));

      setSaveStatus('saved');
      setValidationErrors({});
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      console.error('Failed to save configurations:', error);
    }
  };

  const validateConfigurations = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Validate wallet configurations
    walletConfigs.forEach((config, index) => {
      if (!config.name.trim()) {
        errors[`wallet-${index}-name`] = 'Wallet name is required';
      }
      if (config.name.length > 30) {
        errors[`wallet-${index}-name`] = 'Wallet name must be 30 characters or less';
      }
      if (config.transactionFeeAmount < 0) {
        errors[`wallet-${index}-fee`] = 'Transaction fee cannot be negative';
      }
    });

    // Validate FNPF configuration
    if (fnpfConfig.employeePercentage < 0 || fnpfConfig.employeePercentage > 100) {
      errors['fnpf-employee'] = 'Employee percentage must be between 0 and 100';
    }
    if (fnpfConfig.personalContributionPercentage < 0 || fnpfConfig.personalContributionPercentage > 100) {
      errors['fnpf-personal'] = 'Personal contribution percentage must be between 0 and 100';
    }

    return errors;
  };

  const addWalletConfig = () => {
    const newConfig: WalletConfig = {
      id: Date.now().toString(),
      name: '',
      transactionFeeAmount: 0,
      transactionFeeEnabled: false,
      bankAssociation: '',
      applyToNeeds: true,
      applyToWants: true
    };
    setWalletConfigs([...walletConfigs, newConfig]);
  };

  const updateWalletConfig = (id: string, updates: Partial<WalletConfig>) => {
    setWalletConfigs(configs => 
      configs.map(config => 
        config.id === id ? { ...config, ...updates } : config
      )
    );
  };

  const deleteWalletConfig = (id: string) => {
    setWalletConfigs(configs => configs.filter(config => config.id !== id));
  };

  const sections = [
    { id: 'wallets', label: 'Wallet Management', icon: Wallet },
    { id: 'fnpf', label: 'FNPF Settings', icon: Building2 }
  ];

  const renderWalletManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Wallet Management Configuration</h3>
          <p className="text-sm text-gray-600">Configure transaction fees and bank associations for your wallets</p>
        </div>
        <button
          onClick={addWalletConfig}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Wallet</span>
        </button>
      </div>

      <div className="space-y-4">
        {walletConfigs.map((config, index) => (
          <div key={config.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Wallet Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Name *
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={config.name}
                  onChange={(e) => updateWalletConfig(config.id, { name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors[`wallet-${index}-name`] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., ANZ Current Account"
                />
                {validationErrors[`wallet-${index}-name`] && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors[`wallet-${index}-name`]}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{config.name.length}/30 characters</p>
              </div>

              {/* Transaction Fee Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Fee (FJD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={config.transactionFeeAmount}
                    onChange={(e) => updateWalletConfig(config.id, { transactionFeeAmount: parseFloat(e.target.value) || 0 })}
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      validationErrors[`wallet-${index}-fee`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {validationErrors[`wallet-${index}-fee`] && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors[`wallet-${index}-fee`]}</p>
                )}
              </div>

              {/* Bank Association */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank/Account Association
                </label>
                <select
                  value={config.bankAssociation}
                  onChange={(e) => updateWalletConfig(config.id, { bankAssociation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Bank</option>
                  <option value="anz">ANZ Bank</option>
                  <option value="westpac">Westpac</option>
                  <option value="bsp">BSP</option>
                  <option value="fdb">Fiji Development Bank</option>
                  <option value="bred">BRED Bank</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Transaction Fee Toggle */}
              <div className="flex items-center space-x-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.transactionFeeEnabled}
                    onChange={(e) => updateWalletConfig(config.id, { transactionFeeEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
                <span className="text-sm text-gray-700">Enable Transaction Fees</span>
              </div>

              {/* Apply to Needs */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`needs-${config.id}`}
                  checked={config.applyToNeeds}
                  onChange={(e) => updateWalletConfig(config.id, { applyToNeeds: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`needs-${config.id}`} className="text-sm text-gray-700">
                  Apply to "Need" transactions
                </label>
              </div>

              {/* Apply to Wants */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`wants-${config.id}`}
                  checked={config.applyToWants}
                  onChange={(e) => updateWalletConfig(config.id, { applyToWants: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`wants-${config.id}`} className="text-sm text-gray-700">
                  Apply to "Want" transactions
                </label>
              </div>
            </div>

            {/* Delete Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => deleteWalletConfig(config.id)}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}

        {walletConfigs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No wallet configurations yet</p>
            <button
              onClick={addWalletConfig}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first wallet configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderFNPFConfiguration = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">FNPF Configuration</h3>
        <p className="text-sm text-gray-600">Configure FNPF deduction percentages - deductions will be applied when salary is entered</p>
      </div>

      {/* FNPF Percentages */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-md font-semibold text-blue-900 mb-4">FNPF Contribution Rates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee Contribution Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={fnpfConfig.employeePercentage}
                onChange={(e) => setFnpfConfig({ ...fnpfConfig, employeePercentage: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors['fnpf-employee'] ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            {validationErrors['fnpf-employee'] && (
              <p className="text-red-500 text-xs mt-1">{validationErrors['fnpf-employee']}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Standard rate is 8.5%</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Contribution Percentage (Optional)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={fnpfConfig.personalContributionPercentage}
                onChange={(e) => setFnpfConfig({ ...fnpfConfig, personalContributionPercentage: parseFloat(e.target.value) || 0 })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors['fnpf-personal'] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            {validationErrors['fnpf-personal'] && (
              <p className="text-red-500 text-xs mt-1">{validationErrors['fnpf-personal']}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Additional voluntary contribution</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">How FNPF Deductions Work</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• FNPF deductions are automatically calculated when you enter salary income</li>
            <li>• Employee contribution is deducted from your gross salary</li>
            <li>• Employer contribution (8.5%) is added separately and tracked</li>
            <li>• Personal contribution is an additional deduction from your salary</li>
            <li>• All deductions are recorded with the salary transaction date</li>
          </ul>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h4 className="text-md font-semibold text-purple-900 mb-4">Display Preferences</h4>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="show-dashboard"
              checked={fnpfConfig.showOnDashboard}
              onChange={(e) => setFnpfConfig({ ...fnpfConfig, showOnDashboard: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="show-dashboard" className="text-sm text-gray-700">
              Show FNPF information on dashboard
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="include-reports"
              checked={fnpfConfig.includeInReports}
              onChange={(e) => setFnpfConfig({ ...fnpfConfig, includeInReports: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="include-reports" className="text-sm text-gray-700">
              Include FNPF data in monthly reports
            </label>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="email-notifications"
              checked={fnpfConfig.emailNotifications}
              onChange={(e) => setFnpfConfig({ ...fnpfConfig, emailNotifications: e.target.checked })}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="email-notifications" className="text-sm text-gray-700">
              Email notifications for FNPF contributions
            </label>
          </div>
        </div>
      </div>

      {/* FNPF Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">FNPF Calculation Preview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Employee Deduction</p>
            <p className="text-2xl font-bold text-blue-600">
              {fnpfConfig.employeePercentage}%
            </p>
            <p className="text-xs text-gray-500">From gross salary</p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Personal Contribution</p>
            <p className="text-2xl font-bold text-emerald-600">
              {fnpfConfig.personalContributionPercentage}%
            </p>
            <p className="text-xs text-gray-500">Additional deduction</p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Deduction</p>
            <p className="text-2xl font-bold text-purple-600">
              {(fnpfConfig.employeePercentage + fnpfConfig.personalContributionPercentage).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">From your salary</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h5 className="font-medium text-amber-900 mb-2">Example Calculation</h5>
          <div className="text-sm text-amber-700">
            <p>If your gross salary is $1,000:</p>
            <ul className="mt-2 space-y-1 ml-4">
              <li>• Employee FNPF: ${((1000 * fnpfConfig.employeePercentage) / 100).toFixed(2)}</li>
              <li>• Personal contribution: ${((1000 * fnpfConfig.personalContributionPercentage) / 100).toFixed(2)}</li>
              <li>• Total deductions: ${((1000 * (fnpfConfig.employeePercentage + fnpfConfig.personalContributionPercentage)) / 100).toFixed(2)}</li>
              <li>• Net salary: ${(1000 - ((1000 * (fnpfConfig.employeePercentage + fnpfConfig.personalContributionPercentage)) / 100)).toFixed(2)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Settings Configuration</h1>
        <p className="text-gray-600">Configure wallets and FNPF settings</p>
        
        {/* Save Status */}
        <div className="mt-4 flex items-center justify-center space-x-2">
          {saveStatus === 'saving' && (
            <>
              <Clock className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-600">Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-emerald-600">All changes saved</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">Error saving changes</span>
            </>
          )}
          {saveStatus === 'idle' && (
            <>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-600">Auto-save enabled</span>
            </>
          )}
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="flex space-x-1 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {activeSection === 'wallets' && renderWalletManagement()}
        {activeSection === 'fnpf' && renderFNPFConfiguration()}
      </div>

      {/* Manual Save Button */}
      <div className="flex justify-center">
        <button
          onClick={saveConfigurations}
          disabled={saveStatus === 'saving'}
          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-6 w-6" />
          <span className="text-lg font-semibold">
            {saveStatus === 'saving' ? 'Saving...' : 'Save All Configurations'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default FinancialSettingsTab;