"use client";

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  BarChart3,
  ArrowLeft,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Info,
  Sparkles
} from 'lucide-react';
import { Button, LinkButton } from '@/components/ui';

interface IndustryAnalysisResult {
  industryOverview: {
    name: string;
    marketSize: string;
    growthRate: string;
    maturityLevel: 'emerging' | 'growth' | 'mature' | 'declining';
    outlook: string;
  };
  salaryInsights: {
    averageSalary: string;
    salaryRange: {
      entry: string;
      mid: string;
      senior: string;
      executive: string;
    };
    topPayingCities: string[];
    salaryGrowth: string;
  };
  skillsTrends: {
    inDemand: string[];
    emerging: string[];
    declining: string[];
    futureSkills: string[];
  };
  keyPlayers: {
    companies: Array<{
      name: string;
      type: 'enterprise' | 'startup' | 'consulting';
      description: string;
    }>;
    investmentTrends: string;
  };
  opportunities: {
    jobMarketHealth: 'excellent' | 'good' | 'moderate' | 'challenging';
    growthAreas: string[];
    challenges: string[];
    recommendations: string[];
  };
  competitiveAnalysis: {
    barriers: string[];
    advantages: string[];
    positioning: string[];
  };
}

export default function IndustryAnalysisPage() {
  const { user, isLoading } = useRequireAuth();
  const [formData, setFormData] = useState({
    industry: '',
    role: '',
    location: '',
    experienceLevel: 'mid' as 'entry' | 'mid' | 'senior' | 'executive',
    interests: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<IndustryAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (!isPremium) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <div className="flex items-center">
                  <LinkButton
                    href="/dashboard/ai"
                    variant="secondary"
                    size="sm"
                    className="mr-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to AI Dashboard
                  </LinkButton>
                  <BarChart3 className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Industry Analysis</h1>
                    <p className="text-sm text-gray-500">
                      Deep industry insights and market trends
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <Star className="mx-auto h-16 w-16 text-yellow-600 mb-4" />
              <h3 className="text-xl font-medium text-yellow-900 mb-2">Premium Feature</h3>
              <p className="text-yellow-800 mb-4">
                Industry Analysis provides deep market insights, salary trends, and competitive intelligence 
                to help you make informed career decisions.
              </p>
              <LinkButton href="/dashboard/subscription">
                Upgrade to Premium
              </LinkButton>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleAnalyze = async () => {
    if (!formData.industry.trim()) {
      setError('Please enter an industry to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze-industry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          planType: user.subscriptionTier?.toUpperCase() || 'PREMIUM',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze industry');
      }

      setResult(data.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMaturityColor = (level: string) => {
    switch (level) {
      case 'emerging': return 'bg-green-100 text-green-800';
      case 'growth': return 'bg-blue-100 text-blue-800';
      case 'mature': return 'bg-gray-100 text-gray-800';
      case 'declining': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center">
                <LinkButton
                  href="/dashboard/ai"
                  variant="secondary"
                  size="sm"
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to AI Dashboard
                </LinkButton>
                <BarChart3 className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Industry Analysis</h1>
                  <p className="text-sm text-gray-500">
                    Deep industry insights, market trends, and competitive intelligence
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Premium
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Analysis Parameters</h3>
                  <p className="text-sm text-gray-500">Specify what you want to analyze</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g. Technology, FinTech, Healthcare, E-commerce"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g. Software Engineer, Product Manager, Data Scientist"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. San Francisco, New York, Remote"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value as any }))}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid Level (3-7 years)</option>
                      <option value="senior">Senior Level (8-15 years)</option>
                      <option value="executive">Executive Level (15+ years)</option>
                    </select>
                  </div>

                  {/* Specific Interests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Interests (Optional)
                    </label>
                    <textarea
                      value={formData.interests}
                      onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                      placeholder="What specific aspects are you most interested in? e.g. emerging technologies, startup ecosystem, enterprise opportunities, remote work trends..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex">
                        <Info className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full flex items-center justify-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing Industry...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Industry
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Industry Overview */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Industry Overview</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Market Size</span>
                          <div className="text-lg font-semibold text-gray-900">{result.industryOverview.marketSize}</div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Growth Rate</span>
                          <div className="text-lg font-semibold text-green-600">{result.industryOverview.growthRate}</div>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-2">Maturity Level</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMaturityColor(result.industryOverview.maturityLevel)}`}>
                          {result.industryOverview.maturityLevel.charAt(0).toUpperCase() + result.industryOverview.maturityLevel.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-2">Outlook</span>
                        <p className="text-gray-700">{result.industryOverview.outlook}</p>
                      </div>
                    </div>
                  </div>

                  {/* Salary Insights */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Salary Insights</h3>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{result.salaryInsights.averageSalary}</div>
                        <div className="text-sm text-gray-500">Average Salary</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(result.salaryInsights.salaryRange).map(([level, salary]) => (
                          <div key={level} className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="font-semibold text-gray-900">{salary}</div>
                            <div className="text-sm text-gray-500 capitalize">{level}</div>
                          </div>
                        ))}
                      </div>
                      {result.salaryInsights.topPayingCities.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-500 block mb-2">Top Paying Cities</span>
                          <div className="flex flex-wrap gap-2">
                            {result.salaryInsights.topPayingCities.map((city, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                {city}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills Trends */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Skills Trends</h3>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      {result.skillsTrends.inDemand.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-green-700 mb-2">In-Demand Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.skillsTrends.inDemand.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.skillsTrends.emerging.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-blue-700 mb-2">Emerging Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.skillsTrends.emerging.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {result.skillsTrends.futureSkills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-purple-700 mb-2">Future Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.skillsTrends.futureSkills.map((skill, index) => (
                              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Opportunities */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Market Opportunities</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-2">Job Market Health</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(result.opportunities.jobMarketHealth)}`}>
                          {result.opportunities.jobMarketHealth.charAt(0).toUpperCase() + result.opportunities.jobMarketHealth.slice(1)}
                        </span>
                      </div>
                      {result.opportunities.growthAreas.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Growth Areas</h4>
                          <ul className="space-y-1">
                            {result.opportunities.growthAreas.map((area, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <span className="h-2 w-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.opportunities.recommendations.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Career Recommendations</h4>
                          <ul className="space-y-1">
                            {result.opportunities.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-start text-sm text-gray-600">
                                <span className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                {recommendation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-12 text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Analysis Yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter an industry and click "Analyze" to get comprehensive market insights
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}