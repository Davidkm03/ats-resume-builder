"use client";

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  DocumentTextIcon,
  ArrowLeftIcon,
  StarIcon,
  ClipboardDocumentCheckIcon,
  UserIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  InformationCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Button, LinkButton } from '@/components/ui';

interface CoverLetterResult {
  coverLetter: string;
  alternativeVersions: string[];
  keyPoints: string[];
  tone: 'professional' | 'conversational' | 'enthusiastic';
  suggestions: string[];
  matchScore: number;
}

export default function CoverLetterPage() {
  const { user, isLoading } = useRequireAuth();
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobDescription: '',
    yourName: '',
    currentRole: '',
    experience: '',
    keySkills: '',
    achievements: '',
    whyInterested: '',
    tone: 'professional' as 'professional' | 'conversational' | 'enthusiastic',
    customRequests: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<'main' | number>('main');

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
                  <DocumentTextIcon className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cover Letter Generator</h1>
                    <p className="text-sm text-gray-500">
                      AI-powered personalized cover letters
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
                Generate personalized, ATS-optimized cover letters that highlight your unique 
                qualifications and match specific job requirements.
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

  const handleGenerate = async () => {
    if (!formData.jobTitle.trim() || !formData.company.trim() || !formData.yourName.trim()) {
      setError('Please fill in job title, company, and your name');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-cover-letter', {
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
        throw new Error(data.error || 'Failed to generate cover letter');
      }

      setResult(data.data);
    } catch (error) {
      console.error('Generation failed:', error);
      setError(error instanceof Error ? error.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCurrentLetter = () => {
    if (!result) return '';
    if (selectedVersion === 'main') return result.coverLetter;
    return result.alternativeVersions[selectedVersion as number] || '';
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
                <DocumentTextIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Cover Letter Generator</h1>
                  <p className="text-sm text-gray-500">
                    Create personalized, compelling cover letters for any position
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
                  <h3 className="text-lg font-medium text-gray-900">Job & Personal Details</h3>
                  <p className="text-sm text-gray-500">Provide information for your personalized cover letter</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Job Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="e.g. TechCorp Inc."
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>

                  {/* Your Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.yourName}
                        onChange={(e) => setFormData(prev => ({ ...prev, yourName: e.target.value }))}
                        placeholder="e.g. John Smith"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Role
                      </label>
                      <input
                        type="text"
                        value={formData.currentRole}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
                        placeholder="e.g. Software Engineer at XYZ Corp"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="e.g. 5+ years in software development"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Description (Optional but Recommended)
                    </label>
                    <textarea
                      value={formData.jobDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                      placeholder="Paste the complete job description here to create a more targeted cover letter..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    />
                  </div>

                  {/* Key Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Skills & Technologies
                    </label>
                    <textarea
                      value={formData.keySkills}
                      onChange={(e) => setFormData(prev => ({ ...prev, keySkills: e.target.value }))}
                      placeholder="List your relevant skills, technologies, and expertise...

Example:
React, Node.js, Python, AWS, Docker, Kubernetes, Team Leadership, Agile Development"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    />
                  </div>

                  {/* Key Achievements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Achievements
                    </label>
                    <textarea
                      value={formData.achievements}
                      onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                      placeholder="Highlight your most relevant achievements with metrics...

Example:
- Led team of 8 developers, increased productivity by 40%
- Built system handling 1M+ requests/day with 99.9% uptime
- Reduced deployment time from 4 hours to 15 minutes"
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    />
                  </div>

                  {/* Why Interested */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Why Are You Interested? (Optional)
                    </label>
                    <textarea
                      value={formData.whyInterested}
                      onChange={(e) => setFormData(prev => ({ ...prev, whyInterested: e.target.value }))}
                      placeholder="What specifically interests you about this role or company..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    />
                  </div>

                  {/* Tone Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone & Style
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['professional', 'conversational', 'enthusiastic'] as const).map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, tone }))}
                          className={`p-3 text-sm font-medium border rounded-md transition-colors ${
                            formData.tone === tone
                              ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={formData.customRequests}
                      onChange={(e) => setFormData(prev => ({ ...prev, customRequests: e.target.value }))}
                      placeholder="Any specific points you want to emphasize or special requests for the cover letter..."
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
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
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Cover Letter...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Generate Cover Letter
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
                  {/* Match Score */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Match Score</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Job Alignment</span>
                            <span>{result.matchScore}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${
                                result.matchScore >= 80 ? 'bg-green-600' :
                                result.matchScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${result.matchScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            result.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                            result.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.matchScore >= 80 ? 'Excellent' :
                             result.matchScore >= 60 ? 'Good' : 'Needs Work'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Version Selector */}
                  {result.alternativeVersions.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Choose Version</h3>
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedVersion('main')}
                            className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
                              selectedVersion === 'main'
                                ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            Main Version
                          </button>
                          {result.alternativeVersions.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedVersion(index)}
                              className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
                                selectedVersion === index
                                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              Alternative {index + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cover Letter */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Your Cover Letter</h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyToClipboard(getCurrentLetter())}
                        >
                          <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
                          Copy Letter
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="whitespace-pre-line text-gray-900 leading-relaxed">
                          {getCurrentLetter()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Points */}
                  {result.keyPoints.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Key Points Highlighted</h3>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-2">
                          {result.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-start">
                              <span className="flex-shrink-0 h-2 w-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                              <span className="text-gray-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {result.suggestions.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Improvement Suggestions</h3>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-3">
                          {result.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                              <span className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                              <span className="text-gray-700">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-12 text-center">
                    <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Cover Letter Generated</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill in the job details and your information to create a personalized cover letter
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