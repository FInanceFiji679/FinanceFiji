import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: 'needs' | 'wants' | 'responsibilities';
  account: string;
  date: string;
  documentUrl?: string;
}

export interface FixedExpense {
  id: string;
  name: string;
  amount: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  description: string;
  category: 'short-term' | 'medium-term' | 'long-term';
  targetDate?: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdDate: string;
}

export interface BudgetSettings {
  monthlyIncome: number;
  needsPercentage: number;
  wantsPercentage: number;
  responsibilitiesPercentage: number;
  fixedExpenses: FixedExpense[];
  allocationLocked?: boolean;
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
  type: 'accumulation' | 'withdrawal' | 'goal-contribution';
  description: string;
  date: string;
  fromMonth?: string;
  goalId?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate: string;
  type: 'savings' | 'goal' | 'streak' | 'milestone';
}

const STORAGE_KEY = 'financeflow-data';

const defaultBudgetSettings: BudgetSettings = {
  monthlyIncome: 0,
  needsPercentage: 50,
  wantsPercentage: 30,
  responsibilitiesPercentage: 20,
  fixedExpenses: [],
  allocationLocked: false
};

export const useFinanceStore = () => {
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>(defaultBudgetSettings);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyArchive, setMonthlyArchive] = useState<MonthlyData[]>([]);
  const [wantWalletBalance, setWantWalletBalance] = useState<number>(0);
  const [wantWalletTransactions, setWantWalletTransactions] = useState<WantWalletTransaction[]>([]);
  const [bankBalance, setBankBalance] = useState<number>(0);
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean>(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setBudgetSettings(data.budgetSettings || defaultBudgetSettings);
        setTransactions(data.transactions || []);
        setMonthlyArchive(data.monthlyArchive || []);
        setWantWalletBalance(data.wantWalletBalance || 0);
        setWantWalletTransactions(data.wantWalletTransactions || []);
        setBankBalance(data.bankBalance || 0);
        setGoals(data.goals || []);
        setAchievements(data.achievements || []);
        setHasSeenTutorial(data.hasSeenTutorial || false);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      budgetSettings,
      transactions,
      monthlyArchive,
      wantWalletBalance,
      wantWalletTransactions,
      bankBalance,
      goals,
      achievements,
      hasSeenTutorial
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [budgetSettings, transactions, monthlyArchive, wantWalletBalance, wantWalletTransactions, bankBalance, goals, achievements, hasSeenTutorial]);

  // CRITICAL: Fix budget settings update to ensure proper saving and validation
  const updateBudgetSettings = (newSettings: Partial<BudgetSettings>) => {
    setBudgetSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Ensure percentages always total 100% when all three are provided
      if (newSettings.needsPercentage !== undefined && 
          newSettings.wantsPercentage !== undefined && 
          newSettings.responsibilitiesPercentage !== undefined) {
        const total = updated.needsPercentage + updated.wantsPercentage + updated.responsibilitiesPercentage;
        if (Math.abs(total - 100) > 0.1) {
          console.warn('Budget percentages do not total 100%:', total);
          // Auto-correct to maintain 100% total
          const factor = 100 / total;
          updated.needsPercentage = Math.round(updated.needsPercentage * factor * 10) / 10;
          updated.wantsPercentage = Math.round(updated.wantsPercentage * factor * 10) / 10;
          updated.responsibilitiesPercentage = 100 - updated.needsPercentage - updated.wantsPercentage;
        }
      }
      
      return updated;
    });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
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
            description: `Overspend coverage: ${transaction.description}`,
            date: new Date().toISOString()
          };
          setWantWalletTransactions(prev => [withdrawalTransaction, ...prev]);
        }
      }
    }

    // Check for achievements
    checkForAchievements();
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

  const addGoal = (goal: Omit<FinancialGoal, 'id' | 'isCompleted' | 'createdDate'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: Date.now().toString(),
      isCompleted: false,
      createdDate: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<FinancialGoal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
    
    // Check if goal was completed
    const updatedGoal = goals.find(g => g.id === id);
    if (updatedGoal && updates.currentAmount && updates.currentAmount >= updatedGoal.targetAmount) {
      unlockAchievement({
        id: `goal_${id}`,
        name: 'Goal Achieved!',
        description: `Congratulations! You've reached your goal: ${updatedGoal.name}`,
        icon: '🎯',
        type: 'goal'
      });
    }
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const contributeToGoal = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || wantWalletBalance < amount) return;

    // Deduct from want wallet
    setWantWalletBalance(prev => prev - amount);
    
    // Add to goal
    const newAmount = goal.currentAmount + amount;
    const isCompleted = newAmount >= goal.targetAmount;
    
    updateGoal(goalId, { 
      currentAmount: newAmount,
      isCompleted
    });

    // Record transaction
    const contributionTransaction: WantWalletTransaction = {
      id: Date.now().toString() + '_contribution',
      amount,
      type: 'goal-contribution',
      description: `Contribution to: ${goal.name}`,
      date: new Date().toISOString(),
      goalId
    };
    setWantWalletTransactions(prev => [contributionTransaction, ...prev]);

    // Check for goal completion achievement
    if (isCompleted) {
      unlockAchievement({
        id: `goal_completed_${goalId}`,
        name: 'Goal Achieved! 🎯',
        description: `Congratulations! You've completed: ${goal.name}`,
        icon: '🏆',
        type: 'goal'
      });
    }
  };

  const unlockAchievement = (achievement: Omit<Achievement, 'unlockedDate'>) => {
    const existingAchievement = achievements.find(a => a.id === achievement.id);
    if (existingAchievement) return;

    const newAchievement: Achievement = {
      ...achievement,
      unlockedDate: new Date().toISOString()
    };
    setAchievements(prev => [...prev, newAchievement]);
  };

  const checkForAchievements = () => {
    // First transaction achievement
    if (transactions.length === 0) { // Will be 1 after the current transaction is added
      unlockAchievement({
        id: 'first_transaction',
        name: 'Getting Started',
        description: 'You\'ve logged your first transaction!',
        icon: '🌟',
        type: 'milestone'
      });
    }

    // Savings milestones
    if (wantWalletBalance >= 50 && !achievements.find(a => a.id === 'saver_50')) {
      unlockAchievement({
        id: 'saver_50',
        name: 'First Steps',
        description: 'You\'ve saved your first $50!',
        icon: '🌱',
        type: 'savings'
      });
    }

    if (wantWalletBalance >= 100 && !achievements.find(a => a.id === 'saver_100')) {
      unlockAchievement({
        id: 'saver_100',
        name: 'Smart Saver',
        description: 'You\'ve saved $100 in your Want Wallet!',
        icon: '💰',
        type: 'savings'
      });
    }

    if (wantWalletBalance >= 500 && !achievements.find(a => a.id === 'saver_500')) {
      unlockAchievement({
        id: 'saver_500',
        name: 'Savings Champion',
        description: 'Amazing! $500 saved in your Want Wallet!',
        icon: '🏆',
        type: 'savings'
      });
    }

    if (wantWalletBalance >= 1000 && !achievements.find(a => a.id === 'saver_1000')) {
      unlockAchievement({
        id: 'saver_1000',
        name: 'Master Saver',
        description: 'Incredible! You\'ve reached $1,000 in savings!',
        icon: '👑',
        type: 'savings'
      });
    }

    // Transaction milestones
    if (transactions.length === 9) { // Will be 10 after current transaction
      unlockAchievement({
        id: 'transactions_10',
        name: 'Tracking Pro',
        description: 'You\'ve logged 10 transactions!',
        icon: '📊',
        type: 'milestone'
      });
    }

    if (transactions.length === 49) { // Will be 50 after current transaction
      unlockAchievement({
        id: 'transactions_50',
        name: 'Data Master',
        description: 'You\'ve logged 50 transactions!',
        icon: '📈',
        type: 'milestone'
      });
    }
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

      // Check for savings achievements
      const newBalance = wantWalletBalance + unspentWants;
      if (newBalance >= 100 && wantWalletBalance < 100) {
        unlockAchievement({
          id: 'first_month_save',
          name: 'Month End Saver',
          description: 'You saved money from your wants budget!',
          icon: '🎉',
          type: 'savings'
        });
      }
    }

    // Calculate and update bank balance
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const fixedExpensesTotal = budgetSettings.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlyRemainder = budgetSettings.monthlyIncome - totalSpent - fixedExpensesTotal;
    setBankBalance(prev => prev + monthlyRemainder);

    // Check for consistency achievements
    if (monthlyArchive.length === 2) { // Will be 3 after archiving
      unlockAchievement({
        id: 'consistency_3',
        name: 'Building Habits',
        description: 'You\'ve tracked 3 months consistently!',
        icon: '🔥',
        type: 'streak'
      });
    }

    if (monthlyArchive.length === 5) { // Will be 6 after archiving
      unlockAchievement({
        id: 'consistency_6',
        name: 'Habit Master',
        description: 'Six months of consistent tracking!',
        icon: '⚡',
        type: 'streak'
      });
    }

    checkForAchievements();
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

  const markTutorialComplete = () => {
    setHasSeenTutorial(true);
  };

  // CRITICAL: Calculate budget allocations with proper precision
  const needsBudget = Math.round((budgetSettings.monthlyIncome * budgetSettings.needsPercentage) / 100 * 100) / 100;
  const wantsBudget = Math.round((budgetSettings.monthlyIncome * budgetSettings.wantsPercentage) / 100 * 100) / 100;
  const responsibilitiesBudget = Math.round((budgetSettings.monthlyIncome * budgetSettings.responsibilitiesPercentage) / 100 * 100) / 100;

  // CRITICAL: Calculate spent amounts by category with proper filtering
  const needsSpent = transactions
    .filter(t => t.category === 'needs')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const wantsSpent = transactions
    .filter(t => t.category === 'wants')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const responsibilitiesSpent = transactions
    .filter(t => t.category === 'responsibilities')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate fixed expenses total
  const fixedExpensesTotal = budgetSettings.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);

  // CRITICAL: Calculate remaining amounts with proper precision
  const needsRemaining = Math.round((needsBudget - needsSpent) * 100) / 100;
  const wantsRemaining = Math.round((wantsBudget - wantsSpent) * 100) / 100;
  const responsibilitiesRemaining = Math.round((responsibilitiesBudget - responsibilitiesSpent - fixedExpensesTotal) * 100) / 100;

  // Calculate total remaining salary
  const totalSpent = needsSpent + wantsSpent + responsibilitiesSpent + fixedExpensesTotal;
  const remainingSalary = Math.round((budgetSettings.monthlyIncome - totalSpent) * 100) / 100;

  // Calculate total allocated budget
  const totalAllocated = needsBudget + wantsBudget + responsibilitiesBudget;

  // Calculate savings rate
  const savingsRate = budgetSettings.monthlyIncome > 0 ? (wantWalletBalance / budgetSettings.monthlyIncome) * 100 : 0;

  return {
    budgetSettings,
    transactions,
    monthlyArchive,
    wantWalletBalance,
    wantWalletTransactions,
    bankBalance,
    goals,
    achievements,
    hasSeenTutorial,
    updateBudgetSettings,
    addTransaction,
    deleteTransaction,
    addFixedExpense,
    deleteFixedExpense,
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    resetMonth,
    markTutorialComplete,
    setWantWalletBalance,
    setWantWalletTransactions,
    setBankBalance,
    // CRITICAL: Calculated values with proper precision
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
    totalAllocated,
    savingsRate
  };
};