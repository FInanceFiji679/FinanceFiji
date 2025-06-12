import { Transaction, Wallet, Loan, FNPFData, MonthlyContribution } from '../types/finance';

export const calculateFNPFContributions = (grossSalary: number) => {
  const employeeContribution = grossSalary * 0.08;
  const employerContribution = grossSalary * 0.08;
  const netSalary = grossSalary - employeeContribution;
  
  return {
    employeeContribution,
    employerContribution,
    netSalary,
    totalContribution: employeeContribution + employerContribution
  };
};

export const calculateLoanPayment = (principal: number, interestRate: number, termMonths: number) => {
  const monthlyRate = interestRate / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                  (Math.pow(1 + monthlyRate, termMonths) - 1);
  return payment;
};

export const calculateRemainingBalance = (loan: Loan, paymentsMade: number) => {
  const monthlyRate = loan.interestRate / 100 / 12;
  if (monthlyRate === 0) return loan.principal - (loan.monthlyPayment * paymentsMade);
  
  const remainingTerm = loan.termMonths - paymentsMade;
  if (remainingTerm <= 0) return 0;
  
  const balance = loan.monthlyPayment * (1 - Math.pow(1 + monthlyRate, -remainingTerm)) / monthlyRate;
  return Math.max(0, balance);
};

export const calculateWalletBalance = (wallet: Wallet, transactions: Transaction[]) => {
  const walletTransactions = transactions.filter(t => 
    t.sourceWallet === wallet.id || t.destinationWallet === wallet.id
  );
  
  let balance = wallet.balance;
  
  walletTransactions.forEach(transaction => {
    if (transaction.sourceWallet === wallet.id) {
      balance -= transaction.amount;
    }
    if (transaction.destinationWallet === wallet.id) {
      balance += transaction.amount;
    }
  });
  
  return balance;
};

export const calculateMonthlySpending = (transactions: Transaction[], category?: string) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                           transactionDate.getFullYear() === currentYear;
      const isExpense = t.type === 'expense';
      const matchesCategory = category ? t.category === category : true;
      
      return isCurrentMonth && isExpense && matchesCategory;
    })
    .reduce((total, t) => total + t.amount, 0);
};

export const calculateBudgetProgress = (allocated: number, spent: number) => {
  if (allocated === 0) return 0;
  return Math.min((spent / allocated) * 100, 100);
};

export const formatCurrency = (amount: number, currency: string = 'FJD') => {
  return new Intl.NumberFormat('en-FJ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculateTotalFNPF = (fnpfData: FNPFData) => {
  return fnpfData.employeeContribution + 
         fnpfData.employerContribution + 
         fnpfData.voluntaryContribution;
};

export const generatePaymentSchedule = (loan: Loan) => {
  const schedule = [];
  let remainingBalance = loan.principal;
  const monthlyRate = loan.interestRate / 100 / 12;
  
  for (let month = 1; month <= loan.termMonths; month++) {
    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = loan.monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;
    
    schedule.push({
      month,
      payment: loan.monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, remainingBalance)
    });
  }
  
  return schedule;
};