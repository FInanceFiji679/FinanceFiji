import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: 'needs' | 'wants' | 'responsibilities';
  date: string;
  receiptUrl?: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
}

export interface BudgetSettings {
  monthlyIncome: number;
  needsPercentage: number;
  wantsPercentage: number;
  responsibilitiesPercentage: number;
  fixedExpenses: FixedExpense[];
}

export interface MonthlyData {
  month: string;
  year: number;
  transactions: Transaction[];
  budgetSettings: BudgetSettings;
  totalSpent: number;
  remainingSalary: number;
}

const STORAGE_KEY = 'financeflow-data';

const defaultBudgetSettings: BudgetSettings = {
  monthlyIncome: 0,
  needsPercentage: 50,
  wantsPercentage: 30,
  responsibilitiesPercentage: 20,
  fixedExpenses: []
};

export const useFinanceStore = () => {
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>(defaultBudgetSettings);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyArchive, setMonthlyArchive] = useState<MonthlyData[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const data = JSON.parse(savedData);
      setBudgetSettings(data.budgetSettings || defaultBudgetSettings);
      setTransactions(data.transactions || []);
      setMonthlyArchive(data.monthlyArchive || []);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      budgetSettings,
      transactions,
      monthlyArchive
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [budgetSettings, transactions, monthlyArchive]);

  const updateBudgetSettings = (newSettings: Partial<BudgetSettings>) => {
    setBudgetSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addFixedExpense = (expense: Omit<FixedExpense, 'id'>) => {
    const newExpense: FixedExpense = {
      ...expense,
      id: Date.now().toString()
    };
    setBudgetSettings(prev => ({
      ...prev,
      fixedExpenses: [...prev.fixedExpenses, newExpense]
    }));
  };

  const deleteFixedExpense = (id: string) => {
    setBudgetSettings(prev => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.filter(e => e.id !== id)
    }));
  };

  const resetMonth = () => {
    // Archive current month data
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const fixedExpensesTotal = budgetSettings.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingSalary = budgetSettings.monthlyIncome - totalSpent - fixedExpensesTotal;

    const monthlyData: MonthlyData = {
      month: currentMonth,
      year: currentYear,
      transactions: [...transactions],
      budgetSettings: { ...budgetSettings },
      totalSpent,
      remainingSalary
    };

    setMonthlyArchive(prev => [monthlyData, ...prev]);
    setTransactions([]);
  };

  // Calculate budget allocations
  const needsBudget = (budgetSettings.monthlyIncome * budgetSettings.needsPercentage) / 100;
  const wantsBudget = (budgetSettings.monthlyIncome * budgetSettings.wantsPercentage) / 100;
  const responsibilitiesBudget = (budgetSettings.monthlyIncome * budgetSettings.responsibilitiesPercentage) / 100;

  // Calculate spent amounts by category
  const needsSpent = transactions.filter(t => t.category === 'needs').reduce((sum, t) => sum + t.amount, 0);
  const wantsSpent = transactions.filter(t => t.category === 'wants').reduce((sum, t) => sum + t.amount, 0);
  const responsibilitiesSpent = transactions.filter(t => t.category === 'responsibilities').reduce((sum, t) => sum + t.amount, 0);

  // Calculate fixed expenses total
  const fixedExpensesTotal = budgetSettings.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate remaining amounts
  const needsRemaining = needsBudget - needsSpent;
  const wantsRemaining = wantsBudget - wantsSpent;
  const responsibilitiesRemaining = responsibilitiesBudget - responsibilitiesSpent - fixedExpensesTotal;

  // Calculate total remaining salary
  const totalSpent = needsSpent + wantsSpent + responsibilitiesSpent + fixedExpensesTotal;
  const remainingSalary = budgetSettings.monthlyIncome - totalSpent;

  return {
    budgetSettings,
    transactions,
    monthlyArchive,
    updateBudgetSettings,
    addTransaction,
    deleteTransaction,
    addFixedExpense,
    deleteFixedExpense,
    resetMonth,
    // Calculated values
    needsBudget,
    wantsBudget,
    responsibilitiesBudget,
    needsSpent,
    wantsSpent,
    responsibilitiesSpent,
    needsRemaining,
    wantsRemaining,
    responsibilitiesRemaining,
    fixedExpensesTotal,
    totalSpent,
    remainingSalary
  };
};