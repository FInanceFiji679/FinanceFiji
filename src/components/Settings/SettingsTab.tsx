import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, DollarSign, Percent, Calculator, CheckCircle, Target, Trophy, Star, Calendar, Flag, AlertCircle, BookOpen } from 'lucide-react';
import { useFinanceStore } from '../../hooks/useFinanceStore';
import BudgetHeader from '../Shared/BudgetHeader';
import EducationalSection from '../Educational/EducationalSection';

const SettingsTab: React.FC = () => {
  const { 
    budgetSettings, 
    updateBudgetSettings, 
    addFixedExpense, 
    deleteFixedExpense,
    addGoal,
    deleteGoal,
    updateGoal,
    goals,
    resetMonth 
  } = useFinanceStore();

  const [formData, setFormData] = useState({
    monthlyIncome: budgetSettings.monthlyIncome.toString(),
    needsPercentage: budgetSettings.needsPercentage.toString(),
    wantsPercentage: budgetSettings.wantsPercentage.toString(),
    responsibilitiesPercentage: budgetSettings.responsibilitiesPercentage.toString()
  });

  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });
  const [newGoal, setNewGoal] = useState({ 
    name: '', 
    targetAmount: '', 
    description: '', 
    category: 'short-term' as const,
    priority: 'medium' as const,
    targetDate: ''
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('budget');

  // Update form data when budget settings change
  useEffect(() => {
    setFormData({
      monthlyIncome: budgetSettings.monthlyIncome.toString(),
      needsPercentage: budgetSettings.needsPercentage.toString(),
      wantsPercentage: budgetSettings.wantsPercentage.toString(),
      responsibilitiesPercentage: budgetSettings.responsibilitiesPercentage.toString()
    });
  }, [budgetSettings]);

  // Auto-save when form data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.monthlyIncome !== budgetSettings.monthlyIncome.toString() ||
          formData.needsPercentage !== budgetSettings.needsPercentage.toString() ||
          formData.wantsPercentage !== budgetSettings.wantsPercentage.toString() ||
          formData.responsibilitiesPercentage !== budgetSettings.responsibilitiesPercentage.toString()) {
        
        const totalPercentage = parseFloat(formData.needsPercentage) + parseFloat(formData.wantsPercentage) + parseFloat(formData.responsibilitiesPercentage);
        if (Math.abs(totalPercentage - 100) < 0.1) {
          updateBudgetSettings({
            monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
            needsPercentage: parseFloat(formData.needsPercentage) || 0,
            wantsPercentage: parseFloat(formData.wantsPercentage) || 0,
            responsibilitiesPercentage: parseFloat(formData.responsibilitiesPercentage) || 0
          });
        }
      }
    }, 1000); // Auto-save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [formData, budgetSettings, updateBudgetSettings]);

  const handlePercentageChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    let newFormData = { ...formData, [field]: value };

    // Auto-adjust other percentages to maintain 100% total
    if (field === 'needsPercentage') {
      const remaining = 100 - numValue;
      const wantsRatio = parseFloat(formData.wantsPercentage) / (parseFloat(formData.wantsPercentage) + parseFloat(formData.responsibilitiesPercentage)) || 0.5;
      newFormData.wantsPercentage = Math.round(remaining * wantsRatio).toString();
      newFormData.responsibilitiesPercentage = (remaining - Math.round(remaining * wantsRatio)).toString();
    } else if (field === 'wantsPercentage') {
      const remaining = 100 - parseFloat(formData.needsPercentage);
      const adjustedValue = Math.min(numValue, remaining);
      newFormData.wantsPercentage = adjustedValue.toString();
      newFormData.responsibilitiesPercentage = (remaining - adjustedValue).toString();
    } else if (field === 'responsibilitiesPercentage') {
      const remaining = 100 - parseFloat(formData.needsPercentage);
      const adjustedValue = Math.min(numValue, remaining);
      newFormData.responsibilitiesPercentage = adjustedValue.toString();
      newFormData.wantsPercentage = (remaining - adjustedValue).toString();
    }

    setFormData(newFormData);
  };

  const handleSaveAll = () => {
    const newSettings = {
      monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
      needsPercentage: parseFloat(formData.needsPercentage) || 0,
      wantsPercentage: parseFloat(formData.wantsPercentage) || 0,
      responsibilitiesPercentage: parseFloat(formData.responsibilitiesPercentage) || 0
    };
    
    updateBudgetSettings(newSettings);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount) {
      addFixedExpense({
        name: newExpense.name,
        amount: parseFloat(newExpense.amount)
      });
      setNewExpense({ name: '', amount: '' });
    }
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount) {
      addGoal({
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        description: newGoal.description,
        category: newGoal.category,
        priority: newGoal.priority,
        targetDate: newGoal.targetDate || undefined,
        currentAmount: 0
      });
      setNewGoal({ 
        name: '', 
        targetAmount: '', 
        description: '', 
        category: 'short-term',
        priority: 'medium',
        targetDate: ''
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'short-term': return 'bg-blue-100 text-blue-800';
      case 'medium-term': return 'bg-purple-100 text-purple-800';
      case 'long-term': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPercentage = parseFloat(formData.needsPercentage) + parseFloat(formData.wantsPercentage) + parseFloat(formData.responsibilitiesPercentage);
  const isValidPercentage = Math.abs(totalPercentage - 100) < 0.1;

  const tabs = [
    { id: 'budget', label: 'Budget Settings', icon: DollarSign },
    { id: 'goals', label: 'Financial Goals', icon: Target },
    { id: 'education', label: 'Learn & Grow', icon: BookOpen },
    { id: 'advanced', label: 'Advanced', icon: Calculator }
  ];

  const renderBudgetSettings = () => (
    <div className="space-y-8">
      {/* Save All Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSaveAll}
          disabled={!isValidPercentage}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
            saveSuccess 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              : isValidPercentage
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="h-6 w-6" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-6 w-6" />
              <span>Save All Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Monthly Income */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Monthly Income</h2>
        </div>
        
        <div className="max-w-md">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Total Monthly Salary/Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              step="0.01"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Changes are automatically saved</p>
        </div>
      </div>

      {/* Budget Allocation */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Percent className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Budget Allocation</h2>
        </div>

        <div className="space-y-6">
          {/* Needs */}
          <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-800">Needs</h3>
                <p className="text-sm text-emerald-600">Essential expenses (housing, food, utilities)</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.needsPercentage}
                    onChange={(e) => handlePercentageChange('needsPercentage', e.target.value)}
                    className="w-20 px-3 py-2 text-center border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-emerald-700 font-medium">%</span>
                </div>
                <p className="text-sm text-emerald-600 mt-1">
                  ${((parseFloat(formData.monthlyIncome) || 0) * (parseFloat(formData.needsPercentage) || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.needsPercentage}
              onChange={(e) => handlePercentageChange('needsPercentage', e.target.value)}
              className="w-full h-3 bg-emerald-200 rounded-lg appearance-none cursor-pointer slider-emerald"
            />
          </div>

          {/* Wants */}
          <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Wants</h3>
                <p className="text-sm text-amber-600">Entertainment, dining out, hobbies</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max={100 - parseFloat(formData.needsPercentage)}
                    value={formData.wantsPercentage}
                    onChange={(e) => handlePercentageChange('wantsPercentage', e.target.value)}
                    className="w-20 px-3 py-2 text-center border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-amber-700 font-medium">%</span>
                </div>
                <p className="text-sm text-amber-600 mt-1">
                  ${((parseFloat(formData.monthlyIncome) || 0) * (parseFloat(formData.wantsPercentage) || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={100 - parseFloat(formData.needsPercentage)}
              value={formData.wantsPercentage}
              onChange={(e) => handlePercentageChange('wantsPercentage', e.target.value)}
              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer slider-amber"
            />
          </div>

          {/* Responsibilities */}
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Responsibilities</h3>
                <p className="text-sm text-blue-600">Savings, investments, debt payments</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max={100 - parseFloat(formData.needsPercentage)}
                    value={formData.responsibilitiesPercentage}
                    onChange={(e) => handlePercentageChange('responsibilitiesPercentage', e.target.value)}
                    className="w-20 px-3 py-2 text-center border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-blue-700 font-medium">%</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  ${((parseFloat(formData.monthlyIncome) || 0) * (parseFloat(formData.responsibilitiesPercentage) || 0) / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max={100 - parseFloat(formData.needsPercentage)}
              value={formData.responsibilitiesPercentage}
              onChange={(e) => handlePercentageChange('responsibilitiesPercentage', e.target.value)}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider-blue"
            />
          </div>

          {/* Total Validation */}
          <div className={`p-4 rounded-xl border-2 ${
            isValidPercentage ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${
                isValidPercentage ? 'text-emerald-800' : 'text-red-800'
              }`}>
                Total Allocation:
              </span>
              <span className={`text-xl font-bold ${
                isValidPercentage ? 'text-emerald-800' : 'text-red-800'
              }`}>
                {Math.round(totalPercentage)}%
              </span>
            </div>
            {!isValidPercentage && (
              <p className="text-sm text-red-600 mt-1">
                Adjust percentages to reach exactly 100%
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Monthly Responsibilities */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Calculator className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Fixed Monthly Responsibilities</h2>
        </div>

        {/* Add New Fixed Expense */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
          <input
            type="text"
            value={newExpense.name}
            onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Expense name (e.g., Cat Food)"
          />
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0.00"
            />
          </div>
          <button
            onClick={handleAddExpense}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Add</span>
          </button>
        </div>

        {/* Fixed Expenses List */}
        <div className="space-y-3">
          {budgetSettings.fixedExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <h4 className="font-medium text-slate-800">{expense.name}</h4>
                <p className="text-sm text-slate-600">Fixed monthly expense</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold text-slate-800">
                  ${expense.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => deleteFixedExpense(expense.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          {budgetSettings.fixedExpenses.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>No fixed expenses configured yet</p>
              <p className="text-sm">Add recurring monthly expenses above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderGoalsManagement = () => (
    <div className="space-y-8">
      {/* Add New Goal */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Target className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Add Financial Goal</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
          <div className="space-y-4">
            <input
              type="text"
              value={newGoal.name}
              onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Goal name (e.g., Emergency Fund)"
            />
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                step="0.01"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Target amount"
              />
            </div>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="Goal description (optional)"
              rows={2}
            />
          </div>
          
          <div className="space-y-4">
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="short-term">Short-term (0-1 year)</option>
              <option value="medium-term">Medium-term (1-5 years)</option>
              <option value="long-term">Long-term (5+ years)</option>
            </select>
            
            <select
              value={newGoal.priority}
              onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            
            <button
              onClick={handleAddGoal}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Add Goal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-6">Your Financial Goals</h3>
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            
            return (
              <div key={goal.id} className={`p-6 rounded-xl border-2 transition-all ${
                isCompleted 
                  ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-300' 
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-slate-800">{goal.name}</h4>
                      {isCompleted && <Trophy className="h-5 w-5 text-emerald-600" />}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
                        {goal.priority} priority
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-slate-600 mb-2">{goal.description}</p>
                    )}
                    {goal.targetDate && (
                      <div className="flex items-center space-x-1 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-800">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600">{Math.round(progress)}% complete</p>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="mt-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                
                {isCompleted && (
                  <div className="flex items-center space-x-2 text-emerald-600 font-medium">
                    <Star className="h-4 w-4" />
                    <span>Goal Achieved! Congratulations! 🎉</span>
                  </div>
                )}
              </div>
            );
          })}
          
          {goals.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <Target className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <p>No financial goals set yet</p>
              <p className="text-sm">Add your first goal above to start tracking your progress</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAdvanced = () => (
    <div className="space-y-8">
      {/* Month Reset */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-red-100 rounded-xl">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Monthly Reset</h2>
        </div>
        
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 mb-6">
          <h4 className="font-medium text-amber-900 mb-2">What happens when you reset?</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• All current month transactions are archived</li>
            <li>• Unspent wants money is added to your Want Wallet</li>
            <li>• Monthly remainder is added to your Bank balance</li>
            <li>• Transaction counters reset to zero</li>
            <li>• Your budget settings and goals remain unchanged</li>
          </ul>
        </div>
        
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200"
          >
            Reset Month
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <p className="text-red-600 font-medium">Are you sure? This cannot be undone.</p>
            <button
              onClick={() => {
                resetMonth();
                setShowResetConfirm(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Yes, Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Data Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Auto-Save</h4>
            <p className="text-sm text-blue-700 mb-3">
              All your data is automatically saved to your browser's local storage. 
              No account required, complete privacy.
            </p>
            <div className="flex items-center space-x-2 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Data Persistence</h4>
            <p className="text-sm text-purple-700 mb-3">
              Your financial data persists between sessions and browser restarts. 
              Clear browser data to reset everything.
            </p>
            <div className="flex items-center space-x-2 text-emerald-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Budget Header */}
      <BudgetHeader />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings & Configuration</h1>
        <p className="text-slate-600">Customize your financial tracking experience</p>
        <div className="mt-2 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-emerald-600 font-medium">Auto-saving enabled</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 p-2">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'budget' && renderBudgetSettings()}
      {activeTab === 'goals' && renderGoalsManagement()}
      {activeTab === 'education' && <EducationalSection />}
      {activeTab === 'advanced' && renderAdvanced()}
    </div>
  );
};

export default SettingsTab;