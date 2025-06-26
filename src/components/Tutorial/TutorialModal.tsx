import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle, Target, PiggyBank, Heart, ShoppingBag, Shield, TrendingUp } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to FinanceFlow! 🎉",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-lg text-gray-700">
            Your personal finance management system designed to help you take control of your money and achieve your financial goals.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Why FinanceFlow?</strong> Traditional budgeting apps are complex and overwhelming. 
              We use the proven 50/30/20 rule to make budgeting simple, effective, and rewarding.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "The 50/30/20 Budget Rule",
      content: (
        <div className="space-y-6">
          <p className="text-gray-700">FinanceFlow is built around the simple but powerful 50/30/20 budgeting rule:</p>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <Heart className="h-8 w-8 text-emerald-600" />
              <div>
                <h4 className="font-semibold text-emerald-800">50% - Needs</h4>
                <p className="text-sm text-emerald-600">Essential expenses like housing, food, utilities, and transportation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <ShoppingBag className="h-8 w-8 text-amber-600" />
              <div>
                <h4 className="font-semibold text-amber-800">30% - Wants</h4>
                <p className="text-sm text-amber-600">Entertainment, dining out, hobbies, and lifestyle choices</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-800">20% - Responsibilities</h4>
                <p className="text-sm text-blue-600">Savings, investments, debt payments, and emergency funds</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "The Magic of Want Wallet ✨",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <PiggyBank className="h-16 w-16 mx-auto text-pink-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Secret Weapon for Saving</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h4 className="font-semibold text-pink-800 mb-2">How it Works:</h4>
              <p className="text-sm text-pink-700">
                Every month, any money you don't spend from your "wants" budget automatically goes into your Want Wallet. 
                This rewards your discipline and builds savings effortlessly!
              </p>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-2">Real Example:</h4>
              <p className="text-sm text-emerald-700">
                If you have $300 for wants but only spend $250, that extra $50 goes straight to your Want Wallet. 
                Over a year, this could add up to $600 in savings!
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Use it for Goals:</h4>
              <p className="text-sm text-blue-700">
                Set financial goals and watch your Want Wallet help you achieve them faster. 
                Want a vacation? New laptop? Emergency fund? Your disciplined spending makes it happen!
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Setting Up Your Budget",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Target className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Let's Get You Started</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Step 1: Enter Your Monthly Income</h4>
              <p className="text-sm text-blue-700">
                Go to Settings and enter your total monthly income. This is your take-home pay after taxes.
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Step 2: Adjust Your Percentages</h4>
              <p className="text-sm text-purple-700">
                The 50/30/20 rule is a starting point. Adjust the percentages based on your lifestyle and goals. 
                The app will automatically ensure they add up to 100%.
              </p>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-2">Step 3: Add Fixed Expenses</h4>
              <p className="text-sm text-emerald-700">
                Add recurring monthly expenses like subscriptions, insurance, or loan payments. 
                These are automatically deducted from your responsibilities budget.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Tracking Your Spending",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 mx-auto text-emerald-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay on Track</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-2">Log Transactions</h4>
              <p className="text-sm text-emerald-700">
                Use the Needs, Wants, and Responsibilities tabs to log your spending. 
                Each transaction is automatically categorized and tracked against your budget.
              </p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">Visual Progress</h4>
              <p className="text-sm text-amber-700">
                See your progress with beautiful charts and progress bars. 
                Know exactly how much you have left in each category at any time.
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Monthly Reset</h4>
              <p className="text-sm text-blue-700">
                At the end of each month, reset your transactions and watch your Want Wallet grow 
                with any unspent wants money. Your data is archived for future reference.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're Ready to Start! 🚀",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900">Congratulations!</h3>
          <p className="text-lg text-gray-700">
            You now understand how FinanceFlow works. Remember:
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-lg border border-blue-200">
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-700">Every dollar you don't spend on wants becomes savings</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-700">Small changes in spending habits create big results</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-700">Your financial goals are now achievable and trackable</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-700">The app automatically saves and tracks everything</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600">
            Start by going to Settings to enter your monthly income, then begin tracking your first transaction!
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Getting Started</h2>
              <p className="text-blue-100">Step {currentStep + 1} of {tutorialSteps.length}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-96">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {tutorialSteps[currentStep].title}
          </h3>
          {tutorialSteps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 flex items-center justify-between border-t">
          <div className="flex space-x-3">
            <button
              onClick={skipTutorial}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip Tutorial
            </button>
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
            )}
            
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all"
            >
              <span>{currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;