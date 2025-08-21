"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Sparkles,
  FileText,
  Zap,
  BarChart3,
  Briefcase,
  Copy,
  Cpu,
  Star,
  Info,
  Brain,
  GraduationCap,
  Code,
  Shield
} from 'lucide-react';
import { Button, LinkButton } from '@/components/ui';
import Link from 'next/link';

interface UsageStats {
  usage: {
    dailyUsed: number;
    monthlyUsed: number;
    dailyLimit: number;
    monthlyLimit: number;
  };
  stats: {
    totalTokens: number;
    totalCost: number;
    totalRequests: number;
  };
  warnings: {
    dailyWarning: boolean;
    monthlyWarning: boolean;
    dailyPercentage: number;
    monthlyPercentage: number;
  };
}

export default function AIPage() {
  const { user, isLoading } = useRequireAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const loadUsageStats = useCallback(async () => {
    if (usageStats) return; // Prevent multiple loads
    
    setIsLoadingStats(true);
    
    try {
      const response = await fetch('/api/ai/usage');
      if (response.ok) {
        const stats = await response.json();
        setUsageStats(stats);
      } else {
        console.error('Failed to load usage stats:', response.status);
        // Fallback to basic stats on error
        setUsageStats({
          usage: { dailyUsed: 0, monthlyUsed: 0, dailyLimit: 5, monthlyLimit: 50 },
          stats: { totalTokens: 0, totalCost: 0, totalRequests: 0 },
          warnings: { dailyWarning: false, monthlyWarning: false, dailyPercentage: 0, monthlyPercentage: 0 }
        });
      }
    } catch (error) {
      console.error('Error loading usage stats:', error);
      // Fallback stats
      setUsageStats({
        usage: { dailyUsed: 0, monthlyUsed: 0, dailyLimit: 5, monthlyLimit: 50 },
        stats: { totalTokens: 0, totalCost: 0, totalRequests: 0 },
        warnings: { dailyWarning: false, monthlyWarning: false, dailyPercentage: 0, monthlyPercentage: 0 }
      });
    } finally {
      setIsLoadingStats(false);
    }
  }, [usageStats]);

  useEffect(() => {
    if (user) {
      loadUsageStats();
    }
  }, [user, loadUsageStats]);

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

  const isPremium = user.subscriptionTier === 'premium' || user.subscriptionTier === 'enterprise';
  const planType = user.subscriptionTier?.toUpperCase() || 'FREE';

  const freeFeatures = [
    {
      id: 'job-analysis',
      name: 'Job Description Analysis',
      description: 'Analyze job postings to extract keywords and requirements',
      icon: FileText,
      href: '/dashboard/ai/job-analysis',
      available: true,
    },
    {
      id: 'bullet-generator',
      name: 'Bullet Point Generator',
      description: 'Generate ATS-optimized bullet points for your experience',
      icon: Zap,
      href: '/dashboard/ai/bullet-generator',
      available: true,
    },
    {
      id: 'summary-generator',
      name: 'Professional Summary',
      description: 'Create compelling professional summaries',
      icon: Copy,
      href: '/dashboard/ai/summary-generator',
      available: true,
    },
    {
      id: 'skills-suggestions',
      name: 'AI Skills Suggestions',
      description: 'Get intelligent skill recommendations based on your experience',
      icon: Brain,
      href: '/dashboard/cvs/builder?step=skills',
      available: true,
    },
    {
      id: 'education-generator',
      name: 'Education Content Generator',
      description: 'Generate descriptions, courses, and honors for your education',
      icon: GraduationCap,
      href: '/dashboard/cvs/builder?step=education',
      available: true,
    },
    {
      id: 'project-generator',
      name: 'Project Content Generator',
      description: 'Create compelling project descriptions and achievements',
      icon: Code,
      href: '/dashboard/cvs/builder?step=projects',
      available: true,
    },
    {
      id: 'ats-analysis',
      name: 'ATS Compatibility Analysis',
      description: 'Comprehensive ATS optimization and compatibility check',
      icon: Shield,
      href: '/dashboard/cvs/builder?tab=ats',
      available: true,
    },
  ];

  const premiumFeatures = [
    {
      id: 'industry-analysis',
      name: 'Industry Analysis',
      description: 'Deep industry insights and market trends',
      icon: BarChart3,
      href: '/dashboard/ai/industry-analysis',
      available: isPremium,
    },
    {
      id: 'cover-letter',
      name: 'Cover Letter Generator',
      description: 'AI-powered personalized cover letters',
      icon: FileText,
      href: '/dashboard/ai/cover-letter',
      available: isPremium,
    },
    {
      id: 'cv-benchmark',
      name: 'CV Benchmarking',
      description: 'Compare against industry standards',
      icon: Star,
      href: '/dashboard/ai/benchmark',
      available: isPremium,
    },
  ];

  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Usage Stats */}
      {isLoadingStats ? (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Usage Statistics</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      ) : usageStats ? (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Usage Statistics</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {usageStats.stats.totalRequests}
                </div>
                <div className="text-sm text-gray-500">Total Requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {usageStats.stats.totalTokens.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Tokens Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${usageStats.stats.totalCost.toFixed(4)}
                </div>
                <div className="text-sm text-gray-500">Total Cost</div>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Daily Usage</span>
                  <span>{usageStats.usage.dailyUsed.toLocaleString()} / {usageStats.usage.dailyLimit.toLocaleString()}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${usageStats.warnings.dailyWarning ? 'bg-red-600' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(usageStats.warnings.dailyPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Monthly Usage</span>
                  <span>{usageStats.usage.monthlyUsed.toLocaleString()} / {usageStats.usage.monthlyLimit.toLocaleString()}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${usageStats.warnings.monthlyWarning ? 'bg-red-600' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(usageStats.warnings.monthlyPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {(usageStats.warnings.dailyWarning || usageStats.warnings.monthlyWarning) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <Info className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Approaching Usage Limit
                    </h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      You're approaching your usage limits. Consider upgrading for higher limits.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Usage Statistics</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Usage Stats Unavailable</h4>
              <p className="text-sm text-gray-500 mb-4">
                Unable to load usage statistics at the moment. This doesn't affect your ability to use AI features.
              </p>
              <Button 
                onClick={loadUsageStats}
                variant="secondary"
                size="sm"
              >
                Retry Loading Stats
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Status */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Current Plan: {planType}</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {isPremium ? 
                  'You have access to all AI features including premium capabilities.' :
                  'Upgrade to unlock premium AI features and higher usage limits.'
                }
              </p>
            </div>
            {!isPremium && (
              <LinkButton 
                href="/dashboard/subscription"
                className="ml-4"
              >
                Upgrade Plan
              </LinkButton>
            )}
          </div>
        </div>
      </div>

      {/* Free Features */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Core AI Features</h3>
          <p className="text-sm text-gray-500">Available on all plans</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {freeFeatures.map((feature) => (
              <div key={feature.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <feature.icon className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  <div className="ml-4 flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{feature.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                    <LinkButton 
                      href={feature.href}
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                    >
                      Use Feature
                    </LinkButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Premium Features */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Premium AI Features</h3>
          </div>
          <p className="text-sm text-gray-500">Advanced capabilities for premium users</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {premiumFeatures.map((feature) => (
              <div key={feature.id} className={`border rounded-lg p-4 ${feature.available ? 'border-gray-200 hover:shadow-md' : 'border-gray-200 bg-gray-50'} transition-shadow`}>
                <div className="flex items-start">
                  <feature.icon className={`h-8 w-8 flex-shrink-0 ${feature.available ? 'text-yellow-600' : 'text-gray-400'}`} />
                  <div className="ml-4 flex-1">
                    <h4 className={`text-lg font-medium ${feature.available ? 'text-gray-900' : 'text-gray-500'}`}>
                      {feature.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                    {feature.available ? (
                      <LinkButton 
                        href={feature.href}
                        variant="secondary"
                        size="sm"
                        className="mt-3"
                      >
                        Use Feature
                      </LinkButton>
                    ) : (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Premium Only
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center">
                <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
                  <p className="text-sm text-gray-500">
                    Powerful AI tools to optimize your CV and accelerate your job search
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 lg:px-8">
          {activeTab === 'overview' && <OverviewTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}