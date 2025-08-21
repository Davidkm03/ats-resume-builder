"use client";

import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { BarChart3, Users, Eye, Download, TrendingUp, Crown } from 'lucide-react';
import { Button, LinkButton } from '@/components/ui';

export default function AnalyticsPage() {
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

  const isPremium = user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro';

  // Mock analytics data for demo
  const analyticsData = {
    totalViews: 1234,
    uniqueVisitors: 567,
    downloads: 89,
    shareClicks: 23,
    avgViewTime: '2:34',
    topSources: [
      { source: 'Direct Link', count: 45 },
      { source: 'LinkedIn', count: 32 },
      { source: 'Email', count: 18 },
      { source: 'Other', count: 12 }
    ],
    weeklyViews: [12, 19, 8, 25, 17, 31, 22]
  };

  if (!isPremium) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your CV performance and get insights on views, downloads, and engagement.</p>
          </div>

          {/* Premium Feature Lock */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <BarChart3 className="h-16 w-16 text-blue-400" />
                <Crown className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Analytics</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get detailed insights into how your CV is performing. Track views, downloads, share clicks, and more with premium analytics.
            </p>
            
            {/* Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 opacity-60 pointer-events-none">
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                  </div>
                  <Download className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Unique Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">567</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            <LinkButton href="/dashboard/subscription" className="inline-flex items-center">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </LinkButton>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your CV performance and engagement metrics.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% from last month</span>
                </div>
              </div>
              <Eye className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueVisitors}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8% from last month</span>
                </div>
              </div>
              <Users className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.downloads}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+15% from last month</span>
                </div>
              </div>
              <Download className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Share Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.shareClicks}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+3% from last month</span>
                </div>
              </div>
              <BarChart3 className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
            <div className="space-y-4">
              {analyticsData.topSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{source.source}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(source.count / 50) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{source.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average View Time</span>
                <span className="text-sm font-medium text-gray-900">{analyticsData.avgViewTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <span className="text-sm font-medium text-gray-900">23%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Return Visitors</span>
                <span className="text-sm font-medium text-gray-900">34%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mobile Views</span>
                <span className="text-sm font-medium text-gray-900">67%</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Insight:</strong> Your CV is performing well with good engagement metrics. 
                Consider optimizing for mobile users who make up the majority of your traffic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}