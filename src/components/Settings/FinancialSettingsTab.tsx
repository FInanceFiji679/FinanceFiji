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

interface IncomeConfig {
  id: string;
  type: 'primary' | 'additional';
  name: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  amount: number;
  paymentDates: string[];
  autoRecord: boolean;
  category?: 'project' | 'freelance' | 'gift' | 'other';
  expectedFrequency?: 'regular' | 'one-time';
  notes?: string;
}

interface FNPFConfig {
  employeeBaseRate: number;
  employeeVoluntaryContribution: number;
  contributionStartDate: string;
  employerBaseRate: number;
  trackAdditionalBenefits: boolean;
  showOnDashboard: boolean;
  includeInReports: boolean;
  emailNotifications: boolean;
}

const FinancialSettingsTab: React.FC = () => {
  const { wallets, addWallet, updateWallet } = useFinanceData();
  
  const [walletConfigs, setWalletConfigs] = useState<WalletConfig[]>([]);
  const [incomeConfigs, setIncomeConfigs] = useState<IncomeConfig[]>([]);
  const [fnpfConfig, setFnpfConfig] = useState<FNPFConfig>({
    employeeBaseRate: 8.5,
    employeeVoluntaryContribution: 0,
    contributionStartDate: new Date().toISOString().split('T')[0],
    employerBaseRate: 8.5,
    trackAdditionalBenefits: false,
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
    const savedIncomeConfigs = localStorage.getItem('income-configs');
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

    if (savedIncomeConfigs) {
      setIncomeConfigs(JSON.parse(savedIncomeConfigs));
    }

    if (savedFnpfConfig) {
      setFnpfConfig(JSON.parse(savedFnpfConfig));
    }
  }, [wallets]);

  // Auto-save functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (walletConfigs.length > 0 || incomeConfigs.length > 0) {
        saveConfigurations();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [walletConfigs, incomeConfigs, fnpfConfig]);

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
      localStorage.setItem('income-configs', JSON.stringify(incomeConfigs));
      localStorage.setItem('fnpf-config', JSON.stringify(fnpfConfig));

      // Create daily backup
      const backupData = {
        walletConfigs,
        incomeConfigs,
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

    // Validate income configurations
    incomeConfigs.forEach((config, index) => {
      if (!config.name.trim()) {
        errors[`income-${index}-name`] = 'Income source name is required';
      }
      if (config.amount <= 0) {
        errors[`income-${index}-amount`] = 'Amount must be greater than 0';
      }
      if (config.paymentDates.length === 0) {
        errors[`income-${index}-dates`] = 'At least one payment date is required';
      }
    });

    // Validate FNPF configuration
    if (fnpfConfig.employeeVoluntaryContribution < 0) {
      errors['fnpf-voluntary'] = 'Voluntary contribution cannot be negative';
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

  const addIncomeConfig = (type: 'primary' | 'additional') => {
    const newConfig: IncomeConfig = {
      id: Date.now().toString(),
      type,
      name: type === 'primary' ? 'Primary Salary' : '',
      frequency: 'monthly',
      amount: 0,
      paymentDates: [new Date().toISOString().split('T')[0]],
      autoRecord: false,
      ...(type === 'additional' && {
        category: 'other',
        expectedFrequency: 'regular',
        notes: ''
      })
    };
    setIncomeConfigs([...incomeConfigs, newConfig]);
  };

  const updateIncomeConfig = (id: string, updates: Partial<IncomeConfig>) => {
    setIncomeConfigs(configs => 
      configs.map(config => 
        config.id === id ? { ...config, ...updates } : config
      )
    );
  };

  const deleteIncomeConfig = (id: string) => {
    setIncomeConfigs(configs => configs.filter(config => config.id !== id));
  };

  const sections = [
    { id: 'wallets', label: 'Wallet Management', icon: Wallet },
    { id: 'income', label: 'Income Configuration', icon: DollarSign },
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

  const renderIncomeConfiguration = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Income Configuration</h3>
        <p className="text-sm text-gray-600">Set up your primary salary and additional income sources</p>
      </div>

      {/* Primary Salary Section */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-emerald-900">Primary Salary</h4>
          <button
            onClick={() => addIncomeConfig('primary')}
            className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Primary</span>
          </button>
        </div>

        <div className="space-y-4">
          {incomeConfigs.filter(config => config.type === 'primary').map((config, index) => (
            <div key={config.id} className="bg-white border border-emerald-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Frequency
                  </label>
                  <select
                    value={config.frequency}
                    onChange={(e) => updateIncomeConfig(config.id, { frequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Salary (FJD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={config.amount}
                      onChange={(e) => updateIncomeConfig(config.id, { amount: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={config.paymentDates[0] || ''}
                    onChange={(e) => updateIncomeConfig(config.id, { paymentDates: [e.target.value] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.autoRecord}
                      onChange={(e) => updateIncomeConfig(config.id, { autoRecord: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className="text-sm text-gray-700">Auto-record</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => deleteIncomeConfig(config.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Income Sources */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-blue-900">Additional Income Sources</h4>
          <button
            onClick={() => addIncomeConfig('additional')}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Source</span>
          </button>
        </div>

        <div className="space-y-4">
          {incomeConfigs.filter(config => config.type === 'additional').map((config, index) => (
            <div key={config.id} className="bg-white border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source Name
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => updateIncomeConfig(config.id, { name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Freelance Work"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={config.category}
                    onChange={(e) => updateIncomeConfig(config.id, { category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="project">Project</option>
                    <option value="freelance">Freelance</option>
                    <option value="gift">Gift</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Frequency
                  </label>
                  <select
                    value={config.expectedFrequency}
                    onChange={(e) => updateIncomeConfig(config.id, { expectedFrequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="regular">Regular</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (FJD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={config.amount}
                      onChange={(e) => updateIncomeConfig(config.id, { amount: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={config.notes}
                    onChange={(e) => updateIncomeConfig(config.id, { notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={2}
                    placeholder="Additional details about this income source..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => deleteIncomeConfig(config.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}

          {incomeConfigs.filter(config => config.type === 'additional').length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <DollarSign className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p>No additional income sources configured</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFNPFConfiguration = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">FNPF Configuration</h3>
        <p className="text-sm text-gray-600">Configure your FNPF contribution settings and preferences</p>
      </div>

      {/* Employee Contribution */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-md font-semibold text-blue-900 mb-4">Employee Contribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={fnpfConfig.employeeBaseRate}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Fixed rate</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Voluntary Contribution
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={fnpfConfig.employeeVoluntaryContribution}
                onChange={(e) => setFnpfConfig({ ...fnpfConfig, employeeVoluntaryContribution: parseFloat(e.target.value) || 0 })}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors['fnpf-voluntary'] ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {validationErrors['fnpf-voluntary'] && (
              <p className="text-red-500 text-xs mt-1">{validationErrors['fnpf-voluntary']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Start Date
            </label>
            <input
              type="date"
              value={fnpfConfig.contributionStartDate}
              onChange={(e) => setFnpfConfig({ ...fnpfConfig, contributionStartDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Employer Contribution */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <h4 className="text-md font-semibold text-emerald-900 mb-4">Employer Contribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Rate
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={fnpfConfig.employerBaseRate}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Fixed rate</p>
          </div>

          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={fnpfConfig.trackAdditionalBenefits}
                onChange={(e) => setFnpfConfig({ ...fnpfConfig, trackAdditionalBenefits: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
            <span className="text-sm text-gray-700">Track Additional Benefits</span>
          </div>
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
              Show on dashboard
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
              Include in monthly reports
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
              Email notifications for contributions
            </label>
          </div>
        </div>
      </div>

      {/* FNPF Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">FNPF Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Employee Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {fnpfConfig.employeeBaseRate}%
            </p>
            <p className="text-xs text-gray-500">Base contribution</p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Voluntary Contribution</p>
            <p className="text-2xl font-bold text-emerald-600">
              ${fnpfConfig.employeeVoluntaryContribution.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Monthly additional</p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total Employer Rate</p>
            <p className="text-2xl font-bold text-purple-600">
              {fnpfConfig.employerBaseRate}%
            </p>
            <p className="text-xs text-gray-500">Employer contribution</p>
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
        <p className="text-gray-600">Configure wallets, income sources, and FNPF settings</p>
        
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
        {activeSection === 'income' && renderIncomeConfiguration()}
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