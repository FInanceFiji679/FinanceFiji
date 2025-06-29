import { Transaction } from '../hooks/useFinanceStore';

// FNPF Calculations for Fiji
export const calculateFNPFContributions = (grossSalary: number, employeeRate: number = 8.5, personalRate: number = 0) => {
  const employeeContribution = grossSalary * (employeeRate / 100);
  const employerContribution = grossSalary * 0.085; // Standard 8.5%
  const personalContribution = grossSalary * (personalRate / 100);
  const totalDeductions = employeeContribution + personalContribution;
  const netSalary = grossSalary - totalDeductions;
  
  return {
    grossSalary,
    employeeContribution,
    employerContribution,
    personalContribution,
    totalDeductions,
    netSalary,
    totalContribution: employeeContribution + employerContribution + personalContribution
  };
};

// Loan payment calculations
export const calculateLoanPayment = (principal: number, interestRate: number, termMonths: number) => {
  const monthlyRate = interestRate / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                  (Math.pow(1 + monthlyRate, termMonths) - 1);
  return payment;
};

// Budget calculations with validation
export const calculateBudgetAllocations = (monthlyIncome: number, needsPercent: number, wantsPercent: number, responsibilitiesPercent: number) => {
  // Validate percentages total 100%
  const total = needsPercent + wantsPercent + responsibilitiesPercent;
  if (Math.abs(total - 100) > 0.1) {
    throw new Error('Budget percentages must total 100%');
  }

  return {
    needs: (monthlyIncome * needsPercent) / 100,
    wants: (monthlyIncome * wantsPercent) / 100,
    responsibilities: (monthlyIncome * responsibilitiesPercent) / 100,
    total: monthlyIncome
  };
};

// Transaction categorization and spending calculations
export const calculateMonthlySpending = (transactions: Transaction[], category?: string) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const isCurrentMonth = transactionDate.getMonth() === currentMonth && 
                           transactionDate.getFullYear() === currentYear;
      const matchesCategory = category ? t.category === category : true;
      
      return isCurrentMonth && matchesCategory;
    })
    .reduce((total, t) => total + t.amount, 0);
};

// Budget progress calculations with alerts
export const calculateBudgetProgress = (allocated: number, spent: number) => {
  if (allocated === 0) return { percentage: 0, status: 'no-budget', remaining: 0 };
  
  const percentage = (spent / allocated) * 100;
  const remaining = allocated - spent;
  
  let status = 'good';
  if (percentage > 100) status = 'over-budget';
  else if (percentage > 90) status = 'warning';
  else if (percentage > 75) status = 'caution';
  
  return {
    percentage: Math.min(percentage, 100),
    status,
    remaining,
    overspend: Math.max(spent - allocated, 0)
  };
};

// Currency formatting for Fiji
export const formatCurrency = (amount: number, currency: string = 'FJD', showSymbol: boolean = true) => {
  const formatter = new Intl.NumberFormat('en-FJ', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(amount);
};

// Savings rate calculations
export const calculateSavingsRate = (totalIncome: number, totalSavings: number) => {
  if (totalIncome === 0) return 0;
  return (totalSavings / totalIncome) * 100;
};

// Emergency fund calculations
export const calculateEmergencyFundTarget = (monthlyExpenses: number, months: number = 6) => {
  return monthlyExpenses * months;
};

// Investment growth projections
export const calculateInvestmentGrowth = (principal: number, monthlyContribution: number, annualRate: number, years: number) => {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  
  // Future value of principal
  const principalFV = principal * Math.pow(1 + monthlyRate, totalMonths);
  
  // Future value of monthly contributions (annuity)
  const contributionsFV = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  
  return {
    totalValue: principalFV + contributionsFV,
    totalContributions: principal + (monthlyContribution * totalMonths),
    totalGrowth: (principalFV + contributionsFV) - (principal + (monthlyContribution * totalMonths))
  };
};

// Debt payoff calculations
export const calculateDebtPayoff = (balance: number, interestRate: number, monthlyPayment: number) => {
  if (monthlyPayment <= (balance * (interestRate / 100 / 12))) {
    return { months: Infinity, totalInterest: Infinity }; // Payment too low
  }
  
  const monthlyRate = interestRate / 100 / 12;
  const months = Math.ceil(-Math.log(1 - (balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate));
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - balance;
  
  return {
    months,
    totalInterest,
    totalPaid,
    payoffDate: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000)
  };
};

// Financial health score calculation
export const calculateFinancialHealthScore = (data: {
  savingsRate: number;
  debtToIncomeRatio: number;
  emergencyFundMonths: number;
  budgetVariance: number;
}) => {
  let score = 0;
  
  // Savings rate (0-30 points)
  if (data.savingsRate >= 20) score += 30;
  else if (data.savingsRate >= 15) score += 25;
  else if (data.savingsRate >= 10) score += 20;
  else if (data.savingsRate >= 5) score += 15;
  else score += Math.max(0, data.savingsRate * 3);
  
  // Debt to income ratio (0-25 points)
  if (data.debtToIncomeRatio <= 0.1) score += 25;
  else if (data.debtToIncomeRatio <= 0.2) score += 20;
  else if (data.debtToIncomeRatio <= 0.3) score += 15;
  else if (data.debtToIncomeRatio <= 0.4) score += 10;
  else score += Math.max(0, 25 - (data.debtToIncomeRatio * 50));
  
  // Emergency fund (0-25 points)
  if (data.emergencyFundMonths >= 6) score += 25;
  else if (data.emergencyFundMonths >= 3) score += 20;
  else if (data.emergencyFundMonths >= 1) score += 15;
  else score += Math.max(0, data.emergencyFundMonths * 15);
  
  // Budget adherence (0-20 points)
  const budgetScore = Math.max(0, 20 - Math.abs(data.budgetVariance * 2));
  score += budgetScore;
  
  return Math.min(100, Math.round(score));
};

// Tax calculations for Fiji
export const calculateFijiTax = (annualIncome: number) => {
  let tax = 0;
  
  // Fiji tax brackets (2024)
  if (annualIncome > 30000) {
    tax += (annualIncome - 30000) * 0.20; // 20% on income over $30,000
    annualIncome = 30000;
  }
  if (annualIncome > 16000) {
    tax += (annualIncome - 16000) * 0.18; // 18% on income $16,001 - $30,000
    annualIncome = 16000;
  }
  // First $16,000 is tax-free
  
  return {
    annualTax: tax,
    monthlyTax: tax / 12,
    effectiveRate: (tax / (annualIncome + tax)) * 100,
    marginalRate: annualIncome > 30000 ? 20 : annualIncome > 16000 ? 18 : 0
  };
};

// Utility function for data validation
export const validateFinancialData = (data: any) => {
  const errors: string[] = [];
  
  if (typeof data.amount !== 'number' || data.amount < 0) {
    errors.push('Amount must be a positive number');
  }
  
  if (data.percentage && (data.percentage < 0 || data.percentage > 100)) {
    errors.push('Percentage must be between 0 and 100');
  }
  
  if (data.date && isNaN(Date.parse(data.date))) {
    errors.push('Invalid date format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Mathematical consistency checker
export const ensureMathematicalConsistency = (budgetData: {
  income: number;
  needs: number;
  wants: number;
  responsibilities: number;
}) => {
  const total = budgetData.needs + budgetData.wants + budgetData.responsibilities;
  const tolerance = 0.01; // Allow for small rounding errors
  
  return {
    isConsistent: Math.abs(total - budgetData.income) <= tolerance,
    difference: total - budgetData.income,
    adjustmentNeeded: Math.abs(total - budgetData.income) > tolerance
  };
};