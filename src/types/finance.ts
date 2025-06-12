export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: 'needs' | 'wants' | 'responsibilities';
  subcategory: string;
  description: string;
  sourceWallet: string;
  destinationWallet?: string;
  type: 'income' | 'expense' | 'transfer';
  receiptUrl?: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'bank' | 'mpaisa' | 'cash' | 'savings';
  balance: number;
  minimumBalance: number;
  currency: string;
  isActive: boolean;
}

export interface Loan {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  termMonths: number;
  startDate: string;
  monthlyPayment: number;
  remainingBalance: number;
  nextPaymentDate: string;
  payments: LoanPayment[];
}

export interface LoanPayment {
  id: string;
  date: string;
  amount: number;
  principalPortion: number;
  interestPortion: number;
  remainingBalance: number;
}

export interface Budget {
  id: string;
  name: string;
  monthlyIncome: number;
  needsPercentage: number;
  wantsPercentage: number;
  responsibilitiesPercentage: number;
  categories: BudgetCategory[];
  isActive: boolean;
}

export interface BudgetCategory {
  id: string;
  name: string;
  type: 'needs' | 'wants' | 'responsibilities';
  allocated: number;
  spent: number;
  description?: string;
}

export interface FNPFData {
  employeeContribution: number;
  employerContribution: number;
  voluntaryContribution: number;
  totalBalance: number;
  monthlyContributions: MonthlyContribution[];
}

export interface MonthlyContribution {
  month: string;
  year: number;
  employeeAmount: number;
  employerAmount: number;
  voluntaryAmount: number;
  grossSalary: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  description?: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'fortnightly' | 'monthly' | 'annually';
  isActive: boolean;
  destinationWallet: string;
  fnpfEligible: boolean;
}