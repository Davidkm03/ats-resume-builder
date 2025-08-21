"use client";

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  StarIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Button, LinkButton } from '@/components/ui';

interface BenchmarkResult {
  overallScore: number;
  categoryScores: {
    content: number;
    formatting: number;
    keywords: number;
    achievements: number;
    experience: number;
  };
  industryComparison: {
    percentile: number;
    industryAverage: number;
    topPerformers: number;
    yourScore: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    impact: string;
  }>;
  competitiveAnalysis: {
    versus: string;
    advantages: string[];
    gaps: string[];
  };
  improvementPlan: Array<{
    step: number;
    action: string;
    timeframe: string;
    expectedImprovement: string;
  }>;
}

export default function BenchmarkPage() {
  const { user, isLoading } = useRequireAuth();
  const [formData, setFormData] = useState({
    cvContent: '',
    targetRole: '',
    industry: '',
    experienceLevel: 'mid' as 'entry' | 'mid' | 'senior' | 'executive',
    location: '',
    salaryRange: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
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
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to AI Dashboard
                  </LinkButton>
                  <StarIcon className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">CV Benchmarking</h1>
                    <p className="text-sm text-gray-500">
                      Compare against industry standards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <StarIcon className="mx-auto h-16 w-16 text-yellow-600 mb-4" />
              <h3 className="text-xl font-medium text-yellow-900 mb-2">Premium Feature</h3>
              <p className="text-yellow-800 mb-4">
                Compare your CV against industry standards and top performers. Get detailed 
                benchmarking insights and a personalized improvement roadmap.
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
    if (!formData.cvContent.trim() || !formData.targetRole.trim() || !formData.industry.trim()) {
      setError('Please fill in CV content, target role, and industry');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/benchmark-cv', {
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
        throw new Error(data.error || 'Failed to benchmark CV');
      }

      setResult(data.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to AI Dashboard
                </LinkButton>
                <StarIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CV Benchmarking</h1>
                  <p className="text-sm text-gray-500">
                    Compare your CV against industry standards and get personalized improvement insights
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <StarIcon className="h-3 w-3 mr-1" />
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
                  <h3 className="text-lg font-medium text-gray-900">Benchmarking Details</h3>
                  <p className="text-sm text-gray-500">Provide your CV and context for accurate benchmarking</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* CV Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CV Content *
                    </label>
                    <textarea
                      value={formData.cvContent}
                      onChange={(e) => setFormData(prev => ({ ...prev, cvContent: e.target.value }))}
                      placeholder="Paste your complete CV content here...

Include all sections:
- Contact information
- Professional summary
- Work experience 
- Education
- Skills
- Certifications, etc."
                      rows={10}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    />
                    <div className="mt-2 text-sm text-gray-500">
                      {formData.cvContent.length} characters
                    </div>
                  </div>

                  {/* Target Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role *
                    </label>
                    <input
                      type="text"
                      value={formData.targetRole}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                      placeholder="e.g. Senior Software Engineer, Product Manager"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g. Technology, Finance, Healthcare"
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

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. San Francisco, Remote, New York"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Salary Range (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.salaryRange}
                      onChange={(e) => setFormData(prev => ({ ...prev, salaryRange: e.target.value }))}
                      placeholder="e.g. $120k-150k, €80k-100k"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex">
                        <InformationCircleIcon className="h-5 w-5 text-red-400" />
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
                        Benchmarking CV...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Benchmark My CV
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
                  {/* Overall Score */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <TrophyIcon className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Overall CV Score</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                          {result.overallScore}
                        </div>
                        <div className="text-xl text-gray-600 mt-2">out of 100</div>
                        <div className="mt-4">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                            result.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                            result.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.overallScore >= 80 ? '🏆 Excellent CV' :
                             result.overallScore >= 60 ? '👍 Good CV' : '⚠️ Needs Improvement'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Industry Comparison */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Industry Comparison</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{result.industryComparison.percentile}%</div>
                          <div className="text-sm text-gray-500">Percentile Rank</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-600">{result.industryComparison.industryAverage}</div>
                          <div className="text-sm text-gray-500">Industry Average</div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center">
                          {result.industryComparison.percentile >= 75 ? (
                            <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-2" />
                          ) : (
                            <ArrowTrendingDownIcon className="h-5 w-5 text-red-600 mr-2" />
                          )}
                          <span className="text-sm text-blue-800">
                            Your CV scores higher than {result.industryComparison.percentile}% of candidates in {formData.industry}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Scores */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Category Breakdown</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {Object.entries(result.categoryScores).map(([category, score]) => (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize font-medium">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={getScoreColor(score)}>{score}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getScoreBgColor(score)}`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Strengths & Areas for Improvement</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Strengths */}
                      {result.strengths.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Key Strengths
                          </h4>
                          <ul className="space-y-2">
                            {result.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 h-2 w-2 bg-green-600 rounded-full mt-2 mr-3"></span>
                                <span className="text-gray-700">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Weaknesses */}
                      {result.weaknesses.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-2">
                            {result.weaknesses.map((weakness, index) => (
                              <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 h-2 w-2 bg-red-600 rounded-full mt-2 mr-3"></span>
                                <span className="text-gray-700">{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Improvement Recommendations</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{rec.category}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                              {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{rec.suggestion}</p>
                          <div className="text-sm text-blue-600">
                            <strong>Expected Impact:</strong> {rec.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Improvement Plan */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Your Improvement Roadmap</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {result.improvementPlan.map((step, index) => (
                          <div key={index} className="flex">
                            <div className="flex-shrink-0">
                              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-medium">
                                {step.step}
                              </span>
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="font-medium text-gray-900">{step.action}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 text-sm text-gray-500">
                                <div>
                                  <strong>Timeline:</strong> {step.timeframe}
                                </div>
                                <div>
                                  <strong>Expected improvement:</strong> {step.expectedImprovement}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-12 text-center">
                    <StarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Benchmark Analysis Yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Upload your CV content and details to get comprehensive benchmarking insights
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