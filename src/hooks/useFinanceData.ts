import { useState, useEffect } from 'react';
import { Transaction, Wallet, Loan, Budget, FNPFData, FinancialGoal, IncomeSource } from '../types/finance';

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance-fiji-transactions',
  WALLETS: 'finance-fiji-wallets',
  LOANS: 'finance-fiji-loans',
  BUDGETS: 'finance-fiji-budgets',
  FNPF: 'finance-fiji-fnpf',
  GOALS: 'finance-fiji-goals',
  INCOME_SOURCES: 'finance-fiji-income-sources'
};

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [fnpfData, setFnpfData] = useState<FNPFData>({
    employeeContribution: 0,
    employerContribution: 0,
    voluntaryContribution: 0,
    totalBalance: 0,
    monthlyContributions: []
  });
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const loadedWallets = localStorage.getItem(STORAGE_KEYS.WALLETS);
    const loadedLoans = localStorage.getItem(STORAGE_KEYS.LOANS);
    const loadedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    const loadedFnpf = localStorage.getItem(STORAGE_KEYS.FNPF);
    const loadedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
    const loadedIncomeSources = localStorage.getItem(STORAGE_KEYS.INCOME_SOURCES);

    if (loadedTransactions) setTransactions(JSON.parse(loadedTransactions));
    if (loadedWallets) setWallets(JSON.parse(loadedWallets));
    if (loadedLoans) setLoans(JSON.parse(loadedLoans));
    if (loadedBudgets) setBudgets(JSON.parse(loadedBudgets));
    if (loadedFnpf) setFnpfData(JSON.parse(loadedFnpf));
    if (loadedGoals) setGoals(JSON.parse(loadedGoals));
    if (loadedIncomeSources) setIncomeSources(JSON.parse(loadedIncomeSources));

    // Initialize with default wallets if none exist
    if (!loadedWallets) {
      const defaultWallets: Wallet[] = [
        {
          id: '1',
          name: 'ANZ Current Account',
          type: 'bank',
          balance: 0,
          minimumBalance: 10,
          currency: 'FJD',
          isActive: true
        },
        {
          id: '2',
          name: 'MPAiSA Wallet',
          type: 'mpaisa',
          balance: 0,
          minimumBalance: 0,
          currency: 'FJD',
          isActive: true
        },
        {
          id: '3',
          name: 'Cash Wallet',
          type: 'cash',
          balance: 0,
          minimumBalance: 0,
          currency: 'FJD',
          isActive: true
        }
      ];
      setWallets(defaultWallets);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FNPF, JSON.stringify(fnpfData));
  }, [fnpfData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCOME_SOURCES, JSON.stringify(incomeSources));
  }, [incomeSources]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const addWallet = (wallet: Omit<Wallet, 'id'>) => {
    const newWallet: Wallet = {
      ...wallet,
      id: Date.now().toString()
    };
    setWallets(prev => [...prev, newWallet]);
  };

  const updateWallet = (id: string, updates: Partial<Wallet>) => {
    setWallets(prev => prev.map(wallet => 
      wallet.id === id ? { ...wallet, ...updates } : wallet
    ));
  };

  const addLoan = (loan: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loan,
      id: Date.now().toString()
    };
    setLoans(prev => [...prev, newLoan]);
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString()
    };
    setBudgets(prev => [...prev, newBudget]);
  };

  const addGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const addIncomeSource = (source: Omit<IncomeSource, 'id'>) => {
    const newSource: IncomeSource = {
      ...source,
      id: Date.now().toString()
    };
    setIncomeSources(prev => [...prev, newSource]);
  };

  return {
    transactions,
    wallets,
    loans,
    budgets,
    fnpfData,
    goals,
    incomeSources,
    addTransaction,
    addWallet,
    updateWallet,
    addLoan,
    addBudget,
    addGoal,
    addIncomeSource,
    setFnpfData
  };
};