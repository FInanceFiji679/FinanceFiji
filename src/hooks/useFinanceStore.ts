import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  category: 'need' | 'want';
  bankAccount: string;
  date: string;
  description: string;
  supportingDocument?: string;
  createdAt: string;
}

export interface Allocation {
  needs: number;
  wants: number;
  savings: number;
  isLocked: boolean;
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'bank' | 'mpaisa';
}

const STORAGE_KEY = 'finance-tracker-data';

const defaultAllocations: Allocation = {
  needs: 50,
  wants: 30,
  savings: 20,
  isLocked: false
};

const defaultBankAccounts: BankAccount[] = [
  { id: 'anz', name: 'ANZ Bank', type: 'bank' },
  { id: 'bob', name: 'Bank of Baroda', type: 'bank' },
  { id: 'bsp', name: 'Bank of South Pacific (BSP)', type: 'bank' },
  { id: 'bred', name: 'Bred Bank', type: 'bank' },
  { id: 'hfc', name: 'HFC Bank', type: 'bank' },
  { id: 'westpac', name: 'Westpac Banking Corporation', type: 'bank' },
  { id: 'mpaisa', name: 'MPaisa Wallet', type: 'mpaisa' }
];

export const useFinanceStore = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allocations, setAllocations] = useState<Allocation>(defaultAllocations);
  const [bankAccounts] = useState<BankAccount[]>(defaultBankAccounts);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setTransactions(data.transactions || []);
        setAllocations(data.allocations || defaultAllocations);
        setMonthlyIncome(data.monthlyIncome || 0);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      transactions,
      allocations,
      monthlyIncome
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [transactions, allocations, monthlyIncome]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateAllocations = (newAllocations: Omit<Allocation, 'isLocked'>) => {
    setAllocations(prev => ({
      ...newAllocations,
      isLocked: prev.isLocked
    }));
  };

  const lockAllocations = () => {
    setAllocations(prev => ({ ...prev, isLocked: true }));
  };

  const unlockAllocations = () => {
    setAllocations(prev => ({ ...prev, isLocked: false }));
  };

  // Calculate spending by category
  const needsSpent = transactions
    .filter(t => t.category === 'need')
    .reduce((sum, t) => sum + t.amount, 0);

  const wantsSpent = transactions
    .filter(t => t.category === 'want')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = needsSpent + wantsSpent;

  // Calculate allocated amounts
  const needsAllocated = (monthlyIncome * allocations.needs) / 100;
  const wantsAllocated = (monthlyIncome * allocations.wants) / 100;
  const savingsAllocated = (monthlyIncome * allocations.savings) / 100;

  // Calculate remaining amounts
  const needsRemaining = needsAllocated - needsSpent;
  const wantsRemaining = wantsAllocated - wantsSpent;
  const actualSavings = savingsAllocated + needsRemaining + wantsRemaining;

  return {
    transactions,
    allocations,
    bankAccounts,
    monthlyIncome,
    needsSpent,
    wantsSpent,
    totalSpent,
    needsAllocated,
    wantsAllocated,
    savingsAllocated,
    needsRemaining,
    wantsRemaining,
    actualSavings,
    addTransaction,
    deleteTransaction,
    updateAllocations,
    lockAllocations,
    unlockAllocations,
    setMonthlyIncome
  };
};