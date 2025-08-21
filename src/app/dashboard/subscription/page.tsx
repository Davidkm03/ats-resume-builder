"use client";

import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { CheckIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with basic CV creation',
    features: [
      '3 CV templates',
      'Basic CV builder',
      'PDF export',
      'Basic ATS optimization',
      'Email support',
    ],
    limitations: [
      'Limited to 2 CVs',
      'Basic templates only',
      'No AI features',
      'No premium templates',
    ],
    current: true,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    description: 'Advanced features for serious job seekers',
    features: [
      'Unlimited CVs',
      '15+ premium templates',
      'AI-powered content suggestions',
      'Advanced ATS optimization',
      'Multiple export formats (PDF, Word, LaTeX)',
      'LinkedIn integration',
      'Cover letter generator',
      'Industry-specific templates',
      'Priority support',
      'Analytics and insights',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29.99',
    period: 'per month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Brand customization',
      'Bulk operations',
      'Advanced analytics',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Training sessions',
    ],
  },
];

export default function SubscriptionPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentPlan = user.subscriptionTier || 'free';

  const handleUpgrade = (planName: string) => {
    // This would integrate with Stripe or another payment processor
    console.log(`Upgrading to ${planName}`);
    alert(`Upgrade to ${planName} - Payment integration coming soon!`);
  };

  const handleManageSubscription = () => {
    // This would redirect to Stripe customer portal or similar
    console.log('Managing subscription');
    alert('Subscription management - Coming soon!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of your job search with our premium features.
            Start with our free plan and upgrade anytime.
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentPlan !== 'free' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-blue-900 capitalize">
                  Current Plan: {currentPlan}
                </h3>
                <p className="text-blue-700">
                  {user.subscriptionExpiresAt && (
                    <>Expires on {new Date(user.subscriptionExpiresAt).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              <button
                onClick={handleManageSubscription}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-lg shadow-lg border-2 ${
                plan.popular
                  ? 'border-blue-500'
                  : plan.current
                  ? 'border-green-500'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 text-sm font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {plan.current && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 text-sm font-medium rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Limitations:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={plan.current}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    plan.current
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access to premium features until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express) and PayPal through our secure payment processor.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Our free plan gives you access to basic features forever. You can upgrade to Pro anytime to unlock advanced features.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you&apos;re not satisfied with our service, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}