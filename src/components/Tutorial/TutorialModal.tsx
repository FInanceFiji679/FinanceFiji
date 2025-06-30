import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle, Target, PiggyBank, DollarSign, TrendingUp, Building2, FileText } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Finance Fiji! 🇫🇯",
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🏝️</div>
          <p className="text-lg text-gray-700">
            Your simple and efficient personal finance management system designed specifically for Fiji. 
            Take control of your money with precision and cultural relevance.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Why Finance Fiji?</strong> Built with Fiji's financial landscape in mind, 
              including FNPF calculations, local banking integration, and the proven 50/30/20 budgeting rule.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Simple 5-Tab System",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Everything You Need in 5 Tabs</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="p-2 bg-blue-500 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Dashboard</h4>
                <p className="text-sm text-blue-700">Your financial overview at a glance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-900">Income</h4>
                <p className="text-sm text-emerald-700">Set income and budget allocations</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="p-2 bg-purple-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Transactions</h4>
                <p className="text-sm text-purple-700">Track all your spending in one place</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
              <div className="p-2 bg-pink-500 rounded-lg">
                <PiggyBank className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-pink-900">Want Wallet</h4>
                <p className="text-sm text-pink-700">Your automatic savings from unspent wants</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-900">Reports</h4>
                <p className="text-sm text-indigo-700">Monthly summaries and insights</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Smart FNPF Integration 🏛️",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Building2 className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Automatic FNPF Calculations</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">How it Works:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Employee contribution: 8.5% automatically deducted</li>
                <li>• Employer contribution: 8.5% tracked separately</li>
                <li>• Personal contributions: Optional additional savings</li>
                <li>• Real-time net salary calculations</li>
              </ul>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2">Benefits:</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Accurate take-home pay calculations</li>
                <li>• FNPF contribution tracking and projections</li>
                <li>• Retirement planning insights</li>
                <li>• Tax-efficient financial planning</li>
              </ul>
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Secret Savings Weapon</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h4 className="font-semibold text-pink-800 mb-2">Automatic Rewards:</h4>
              <p className="text-sm text-pink-700">
                Every dollar you don't spend from your "wants" budget automatically goes into your Want Wallet. 
                Skip that expensive lunch? Money saved. Choose home entertainment over cinema? More savings!
              </p>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-800 mb-2">Real Fiji Example:</h4>
              <p className="text-sm text-emerald-700">
                Monthly wants budget: $400. Spend only $320 on entertainment and dining. 
                That extra $80 goes straight to your Want Wallet - $960 saved per year!
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Goal Achievement:</h4>
              <p className="text-sm text-blue-700">
                Use your Want Wallet to fund specific goals: vacation to Mamanuca Islands, 
                new car, house deposit, or emergency fund. Your discipline becomes your dreams!
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
          <h3 className="text-xl font-semibold text-gray-900">Bula! Welcome to Financial Freedom</h3>
          <p className="text-lg text-gray-700">
            You now understand how Finance Fiji works. Remember:
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-lg border border-blue-200">
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-700">Start with Income tab to set your monthly income</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-700">Use Transactions tab to record all spending</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-700">Watch your Want Wallet grow with smart choices</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-700">FNPF contributions are automatically calculated</span>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800 font-medium">
              🏝️ Start by setting up your income, then begin tracking your first transaction!
            </p>
          </div>
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
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Finance Fiji Tutorial</h2>
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
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 transition-all"
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