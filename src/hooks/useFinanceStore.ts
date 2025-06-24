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
  wantWalletBalance: number;
  bankBalance: number;
}

export interface WantWalletTransaction {
  id: string;
  amount: number;
  type: 'accumulation' | 'withdrawal';
  description: string;
  date: string;
  fromMonth?: string;
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
  const [wantWalletBalance, setWantWalletBalance] = useState<number>(0);
  const [wantWalletTransactions, setWantWalletTransactions] = useState<WantWalletTransaction[]>([]);
  const [bankBalance, setBankBalance] = useState<number>(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const data = JSON.parse(savedData);
      setBudgetSettings(data.budgetSettings || defaultBudgetSettings);
      setTransactions(data.transactions || []);
      setMonthlyArchive(data.monthlyArchive || []);
      setWantWalletBalance(data.wantWalletBalance || 0);
      setWantWalletTransactions(data.wantWalletTransactions || []);
      setBankBalance(data.bankBalance || 0);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      budgetSettings,
      transactions,
      monthlyArchive,
      wantWalletBalance,
      wantWalletTransactions,
      bankBalance
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [budgetSettings, transactions, monthlyArchive, wantWalletBalance, wantWalletTransactions, bankBalance]);

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

    // Handle want wallet logic for wants category
    if (transaction.category === 'wants') {
      const wantsBudget = (budgetSettings.monthlyIncome * budgetSettings.wantsPercentage) / 100;
      const currentWantsSpent = transactions
        .filter(t => t.category === 'wants')
        .reduce((sum, t) => sum + t.amount, 0) + transaction.amount;

      if (currentWantsSpent > wantsBudget) {
        const overspend = currentWantsSpent - wantsBudget;
        if (wantWalletBalance >= overspend) {
          // Deduct from want wallet
          setWantWalletBalance(prev => prev - overspend);
          const withdrawalTransaction: WantWalletTransaction = {
            id: Date.now().toString() + '_withdrawal',
            amount: overspend,
            type: 'withdrawal',
            description: `Overspend on: ${transaction.description}`,
            date: new Date().toISOString()
          };
          setWantWalletTransactions(prev => [withdrawalTransaction, ...prev]);
        }
      }
    }
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

  const processMonthEnd = () => {
    // Calculate unspent wants money and add to want wallet
    const wantsBudget = (budgetSettings.monthlyIncome * budgetSettings.wantsPercentage) / 100;
    const wantsSpent = transactions.filter(t => t.category === 'wants').reduce((sum, t) => sum + t.amount, 0);
    const unspentWants = Math.max(0, wantsBudget - wantsSpent);

    if (unspentWants > 0) {
      setWantWalletBalance(prev => prev + unspentWants);
      const accumulationTransaction: WantWalletTransaction = {
        id: Date.now().toString() + '_accumulation',
        amount: unspentWants,
        type: 'accumulation',
        description: `Unspent wants budget`,
        date: new Date().toISOString(),
        fromMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
      };
      setWantWalletTransactions(prev => [accumulationTransaction, ...prev]);
    }

    // Calculate and update bank balance
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const fixedExpensesTotal = budgetSettings.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlyRemainder = budgetSettings.monthlyIncome - totalSpent - fixedExpensesTotal;
    setBankBalance(prev => prev + monthlyRemainder);
  };

  const resetMonth = () => {
    // Process month end calculations first
    processMonthEnd();

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
      remainingSalary,
      wantWalletBalance,
      bankBalance
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

  // Calculate total allocated budget
  const totalAllocated = needsBudget + wantsBudget + responsibilitiesBudget + fixedExpensesTotal;

  return {
    budgetSettings,
    transactions,
    monthlyArchive,
    wantWalletBalance,
    wantWalletTransactions,
    bankBalance,
    updateBudgetSettings,
    addTransaction,
    deleteTransaction,
    addFixedExpense,
    deleteFixedExpense,
    resetMonth,
    setWantWalletBalance,
    setWantWalletTransactions,
    setBankBalance,
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
    remainingSalary,
    totalAllocated
  };
};