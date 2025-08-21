"use client";

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Copy,
  ArrowLeft,
  ClipboardCheck,
  User,
  Briefcase,
  GraduationCap,
  Info,
  Sparkles
} from 'lucide-react';
import { Button, LinkButton } from '@/components/ui';

interface SummaryResult {
  summaries: {
    professional: string;
    executive: string;
    career_change: string;
  };
  keywords: string[];
  suggestions: string[];
  tone: 'professional' | 'conversational' | 'dynamic';
}

export default function SummaryGeneratorPage() {
  const { user, isLoading } = useRequireAuth();
  const [formData, setFormData] = useState({
    currentRole: '',
    experience: '',
    keySkills: '',
    achievements: '',
    targetRole: '',
    industry: '',
    careerGoals: '',
    tone: 'professional' as 'professional' | 'conversational' | 'dynamic',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<'professional' | 'executive' | 'career_change'>('professional');

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

  const handleGenerate = async () => {
    if (!formData.currentRole.trim() || !formData.experience.trim() || !formData.keySkills.trim()) {
      setError('Please fill in current role, experience, and key skills');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          planType: user.subscriptionTier?.toUpperCase() || 'FREE',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
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
                <Copy className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Professional Summary Generator</h1>
                  <p className="text-sm text-gray-500">
                    Create compelling professional summaries tailored to your career goals
                  </p>
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
                  <h3 className="text-lg font-medium text-gray-900">Professional Details</h3>
                  <p className="text-sm text-gray-500">Provide your career information for personalized summaries</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Role *
                      </label>
                      <input
                        type="text"
                        value={formData.currentRole}
                        onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <input
                        type="text"
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g. 5+ years"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Role/Industry
                      </label>
                      <input
                        type="text"
                        value={formData.targetRole}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                        placeholder="e.g. Engineering Manager"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="e.g. Technology, FinTech"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Key Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Skills *
                    </label>
                    <textarea
                      value={formData.keySkills}
                      onChange={(e) => setFormData(prev => ({ ...prev, keySkills: e.target.value }))}
                      placeholder="List your top technical and soft skills, separated by commas or new lines...

Example:
- JavaScript, React, Node.js, Python
- Team leadership, project management
- Agile development, CI/CD"
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                      placeholder="Highlight your most significant accomplishments with metrics...

Example:
- Led team of 8 developers, increased productivity by 40%
- Architected system serving 1M+ users with 99.9% uptime
- Reduced deployment time from 4 hours to 15 minutes"
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Career Goals */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Career Goals & Aspirations
                    </label>
                    <textarea
                      value={formData.careerGoals}
                      onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
                      placeholder="What are your career objectives and what you're looking for in your next role..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Tone Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Tone
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['professional', 'conversational', 'dynamic'] as const).map((tone) => (
                        <button
                          key={tone}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, tone }))}
                          className={`p-3 text-sm font-medium border rounded-md transition-colors ${
                            formData.tone === tone
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </button>
                      ))}
                    </div>
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
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Summaries...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Professional Summaries
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-3">💡 Tips for Great Summaries</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Be specific about your expertise and achievements</li>
                  <li>• Include quantifiable results and metrics</li>
                  <li>• Mention relevant technologies and methodologies</li>
                  <li>• Align your goals with the type of role you're seeking</li>
                  <li>• Keep it concise - summaries should be 2-4 sentences</li>
                </ul>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Summary Selector */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Generated Summaries</h3>
                      <p className="text-sm text-gray-500">Choose the style that best fits your needs</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { key: 'professional', label: 'Professional', icon: User, desc: 'Traditional, formal tone' },
                          { key: 'executive', label: 'Executive', icon: Briefcase, desc: 'Leadership-focused, strategic' },
                          { key: 'career_change', label: 'Career Change', icon: GraduationCap, desc: 'Transition-friendly' }
                        ].map(({ key, label, icon: Icon, desc }) => (
                          <button
                            key={key}
                            onClick={() => setSelectedSummary(key as any)}
                            className={`flex items-center p-4 text-left border rounded-lg transition-colors ${
                              selectedSummary === key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className={`h-5 w-5 mr-3 ${
                              selectedSummary === key ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                            <div className="flex-1">
                              <div className={`font-medium ${
                                selectedSummary === key ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {label}
                              </div>
                              <div className="text-sm text-gray-500">{desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Selected Summary */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedSummary.charAt(0).toUpperCase() + selectedSummary.slice(1).replace('_', ' ')} Summary
                        </h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyToClipboard(result.summaries[selectedSummary])}
                        >
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900 leading-relaxed">
                          {result.summaries[selectedSummary]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Key Terms Included</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Improvement Suggestions */}
                  {result.suggestions.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Personalization Tips</h3>
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
                    <Copy className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Summaries Generated</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill in your professional details and click "Generate" to create personalized summaries
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