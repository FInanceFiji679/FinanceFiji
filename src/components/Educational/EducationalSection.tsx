import React, { useState } from 'react';
import { BookOpen, TrendingUp, Target, PiggyBank, Lightbulb, CheckCircle, ArrowRight, Star, Trophy, DollarSign } from 'lucide-react';

const EducationalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('getting-started');

  const tabs = [
    { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
    { id: 'want-wallet', label: 'Want Wallet Magic', icon: PiggyBank },
    { id: 'goals', label: 'Goal Setting', icon: Target },
    { id: 'tips', label: 'Pro Tips', icon: Lightbulb }
  ];

  const successStories = [
    {
      name: "Sarah's Emergency Fund",
      story: "By saving just $30/month from her wants budget, Sarah built a $1,000 emergency fund in under 3 years.",
      savings: "$1,000",
      timeframe: "2.8 years"
    },
    {
      name: "Mike's Vacation Dream",
      story: "Mike wanted a $2,500 Bali trip. By cutting back on dining out, he saved $80/month and reached his goal.",
      savings: "$2,500",
      timeframe: "2.6 years"
    },
    {
      name: "Lisa's Car Down Payment",
      story: "Lisa saved $5,000 for a car down payment by being mindful of her entertainment spending.",
      savings: "$5,000",
      timeframe: "4.2 years"
    }
  ];

  const renderGettingStarted = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Smart Budgeting! 🎯</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          FinanceFlow makes budgeting simple, rewarding, and effective. Here's how to get the most out of your financial journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-blue-900">Step 1: Set Your Income</h4>
          </div>
          <p className="text-blue-700 text-sm mb-4">
            Go to Settings and enter your monthly take-home pay. This is the foundation of your budget.
          </p>
          <div className="bg-blue-200 p-3 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>Tip:</strong> Use your net income (after taxes) for the most accurate budgeting.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-emerald-900">Step 2: Adjust Your Budget</h4>
          </div>
          <p className="text-emerald-700 text-sm mb-4">
            The 50/30/20 rule is a starting point. Adjust percentages based on your lifestyle and goals.
          </p>
          <div className="bg-emerald-200 p-3 rounded-lg">
            <p className="text-xs text-emerald-800">
              <strong>Example:</strong> If you have high rent, increase needs to 60% and reduce wants to 20%.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-purple-900">Step 3: Track & Save</h4>
          </div>
          <p className="text-purple-700 text-sm mb-4">
            Log your expenses and watch your Want Wallet grow with every dollar you don't spend.
          </p>
          <div className="bg-purple-200 p-3 rounded-lg">
            <p className="text-xs text-purple-800">
              <strong>Magic:</strong> Unspent wants money automatically becomes savings!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">The 50/30/20 Rule Explained</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">50%</span>
            </div>
            <h5 className="font-semibold text-gray-900 mb-2">Needs</h5>
            <p className="text-sm text-gray-600">
              Essential expenses you can't avoid: rent, groceries, utilities, transportation, minimum debt payments.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">30%</span>
            </div>
            <h5 className="font-semibold text-gray-900 mb-2">Wants</h5>
            <p className="text-sm text-gray-600">
              Lifestyle choices: dining out, entertainment, hobbies, subscriptions, shopping for non-essentials.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">20%</span>
            </div>
            <h5 className="font-semibold text-gray-900 mb-2">Responsibilities</h5>
            <p className="text-sm text-gray-600">
              Future you: emergency fund, retirement savings, investments, extra debt payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWantWallet = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">The Want Wallet Revolution ✨</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Traditional budgeting punishes you for overspending. FinanceFlow rewards you for underspending!
        </p>
      </div>

      <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-xl border border-pink-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">How Want Wallet Works</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-emerald-500 rounded-lg mt-1">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Automatic Rewards</h5>
                <p className="text-sm text-gray-600">
                  Every dollar you don't spend from your wants budget automatically goes to your Want Wallet. 
                  No manual transfers needed!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-500 rounded-lg mt-1">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Goal-Driven Savings</h5>
                <p className="text-sm text-gray-600">
                  Set specific goals and watch your Want Wallet fund them. See exactly how your discipline 
                  translates to achieving your dreams.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-purple-500 rounded-lg mt-1">
                <PiggyBank className="h-5 w-5 text-white" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Overspend Protection</h5>
                <p className="text-sm text-gray-600">
                  If you overspend on wants, it's automatically deducted from your Want Wallet. 
                  No budget violations, just smart money management.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-4">Real Example: Coffee Savings</h5>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly wants budget:</span>
                <span className="font-medium">$300</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Skip 2 coffee shop visits/week:</span>
                <span className="font-medium text-emerald-600">-$40</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Want Wallet boost:</span>
                <span className="font-bold text-emerald-600">+$40</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-600">Annual savings:</span>
                <span className="font-bold text-emerald-600">$480</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
              <p className="text-xs text-emerald-700">
                <strong>Result:</strong> In 2 years, you'd have $960 just from making coffee at home twice a week!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {successStories.map((story, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-2 mb-3">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h5 className="font-semibold text-gray-900">{story.name}</h5>
            </div>
            <p className="text-sm text-gray-600 mb-4">{story.story}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-emerald-50 rounded-lg">
                <p className="text-xs text-emerald-600 font-medium">Saved</p>
                <p className="text-lg font-bold text-emerald-700">{story.savings}</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Time</p>
                <p className="text-lg font-bold text-blue-700">{story.timeframe}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Master Goal Setting 🎯</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your Want Wallet savings into specific, achievable financial goals.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">SMART Goal Framework</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { letter: 'S', word: 'Specific', desc: 'Clear and well-defined' },
            { letter: 'M', word: 'Measurable', desc: 'Track your progress' },
            { letter: 'A', word: 'Achievable', desc: 'Realistic and attainable' },
            { letter: 'R', word: 'Relevant', desc: 'Meaningful to you' },
            { letter: 'T', word: 'Time-bound', desc: 'Has a deadline' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl font-bold text-white">{item.letter}</span>
              </div>
              <h5 className="font-semibold text-gray-900 mb-1">{item.word}</h5>
              <p className="text-xs text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Goal Categories</h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">Short-term (0-1 year)</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Emergency fund ($1,000)</li>
                <li>• Vacation or holiday</li>
                <li>• New phone or laptop</li>
                <li>• Course or certification</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h5 className="font-medium text-purple-900 mb-2">Medium-term (1-5 years)</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Car down payment</li>
                <li>• Wedding expenses</li>
                <li>• Home renovation</li>
                <li>• Business startup fund</li>
              </ul>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h5 className="font-medium text-indigo-900 mb-2">Long-term (5+ years)</h5>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li>• House down payment</li>
                <li>• Children's education</li>
                <li>• Early retirement fund</li>
                <li>• Investment portfolio</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Goal Setting Tips</h4>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-900">Start Small</h5>
                <p className="text-sm text-gray-600">
                  Begin with a $500 emergency fund before tackling larger goals. Success builds momentum.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-900">Prioritize Wisely</h5>
                <p className="text-sm text-gray-600">
                  Emergency fund first, then high-interest debt, then fun goals. Financial security enables dreams.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-900">Make it Visual</h5>
                <p className="text-sm text-gray-600">
                  Use photos and descriptions. The more real your goal feels, the more motivated you'll be.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-900">Celebrate Milestones</h5>
                <p className="text-sm text-gray-600">
                  Acknowledge progress at 25%, 50%, and 75%. Small celebrations maintain motivation.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <h5 className="font-medium text-emerald-900 mb-2">Pro Tip: The 1% Rule</h5>
            <p className="text-sm text-emerald-700">
              Improve your savings rate by just 1% each month. Small, consistent improvements 
              compound into massive results over time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTips = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro Money Management Tips 💡</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Advanced strategies to maximize your savings and accelerate your financial goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Spending Optimization</h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h5 className="font-medium text-emerald-900 mb-2">The 24-Hour Rule</h5>
              <p className="text-sm text-emerald-700">
                For any non-essential purchase over $50, wait 24 hours. You'll be surprised how often 
                the urge passes, boosting your Want Wallet instead.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-2">Subscription Audit</h5>
              <p className="text-sm text-blue-700">
                Review all subscriptions monthly. Cancel unused ones and negotiate better rates. 
                Even $10/month saved adds $120 to your Want Wallet annually.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h5 className="font-medium text-purple-900 mb-2">The Envelope Method</h5>
              <p className="text-sm text-purple-700">
                Use cash for wants spending. When the envelope is empty, you're done for the month. 
                Leftover cash goes straight to your Want Wallet.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900">Savings Acceleration</h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h5 className="font-medium text-amber-900 mb-2">Windfall Strategy</h5>
              <p className="text-sm text-amber-700">
                Put 50% of any unexpected money (tax refunds, bonuses, gifts) into your Want Wallet. 
                Use the other 50% for something fun to stay motivated.
              </p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h5 className="font-medium text-red-900 mb-2">The Savings Challenge</h5>
              <p className="text-sm text-red-700">
                Try the 52-week challenge: Save $1 in week 1, $2 in week 2, etc. 
                By year-end, you'll have $1,378 in your Want Wallet!
              </p>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h5 className="font-medium text-indigo-900 mb-2">Automate Everything</h5>
              <p className="text-sm text-indigo-700">
                Set up automatic transfers to savings accounts. Pay yourself first, 
                then live on what's left. Your future self will thank you.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">Monthly Money Habits Checklist</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'Review and categorize all transactions',
            'Check progress on financial goals',
            'Audit subscriptions and recurring charges',
            'Calculate Want Wallet growth rate',
            'Plan next month\'s spending priorities',
            'Celebrate financial wins and milestones',
            'Adjust budget percentages if needed',
            'Research ways to increase income',
            'Review and optimize investment accounts'
          ].map((habit, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{habit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-8 rounded-xl border border-emerald-200">
        <h4 className="text-xl font-semibold text-gray-900 mb-4">Remember: Progress, Not Perfection</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 mb-4">
              Financial success isn't about being perfect every month. It's about making consistently 
              better choices over time. Even small improvements compound into life-changing results.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Bad months happen - learn and move forward</li>
              <li>• Focus on trends, not individual transactions</li>
              <li>• Celebrate small wins along the way</li>
              <li>• Adjust your system as life changes</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h5 className="font-semibold text-gray-900 mb-3">Your Financial Journey</h5>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Month 1-3: Building habits</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Month 4-6: Seeing results</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Month 7-12: Momentum building</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Year 2+: Financial freedom</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Education Center</h1>
        <p className="text-gray-600">Master your money with proven strategies and expert guidance</p>
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
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {activeTab === 'getting-started' && renderGettingStarted()}
        {activeTab === 'want-wallet' && renderWantWallet()}
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'tips' && renderTips()}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white p-8 rounded-xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Finances? 🚀</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            You now have all the knowledge you need to succeed. The only thing left is to take action. 
            Start small, stay consistent, and watch your financial dreams become reality.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-blue-100">Your journey to financial freedom starts now</span>
            <ArrowRight className="h-5 w-5 text-blue-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalSection;