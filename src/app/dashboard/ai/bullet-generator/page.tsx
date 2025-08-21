"use client";

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Zap,
  ArrowLeft,
  ClipboardCheck,
  Plus,
  Minus,
  Info,
  BarChart3
} from 'lucide-react';
import { Button, LinkButton } from '@/components/ui';

interface BulletPointResult {
  optimized: string[];
  alternatives: string[];
  keywords: string[];
  atsScore: number;
  suggestions: string[];
}

export default function BulletGeneratorPage() {
  const { user, isLoading } = useRequireAuth();
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    industry: '',
    responsibilities: [''],
    achievements: [''],
    skills: [''],
    context: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<BulletPointResult | null>(null);
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

  const addItem = (field: 'responsibilities' | 'achievements' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeItem = (field: 'responsibilities' | 'achievements' | 'skills', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (field: 'responsibilities' | 'achievements' | 'skills', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleGenerate = async () => {
    // Validation
    if (!formData.jobTitle.trim() || !formData.company.trim() || !formData.industry.trim()) {
      setError('Please fill in job title, company, and industry');
      return;
    }

    const responsibilities = formData.responsibilities.filter(r => r.trim());
    const achievements = formData.achievements.filter(a => a.trim());
    const skills = formData.skills.filter(s => s.trim());

    if (responsibilities.length === 0 || achievements.length === 0 || skills.length === 0) {
      setError('Please add at least one responsibility, achievement, and skill');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-bullets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle: formData.jobTitle.trim(),
          company: formData.company.trim(),
          industry: formData.industry.trim(),
          responsibilities,
          achievements,
          skills,
          context: formData.context.trim(),
          planType: user.subscriptionTier?.toUpperCase() || 'FREE',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate bullet points');
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

  const copyAllBullets = () => {
    if (result) {
      const allBullets = result.optimized.map(bullet => `• ${bullet}`).join('\n');
      copyToClipboard(allBullets);
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
                <Zap className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Bullet Point Generator</h1>
                  <p className="text-sm text-gray-500">
                    Create ATS-optimized, impactful bullet points for your experience
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
                  <h3 className="text-lg font-medium text-gray-900">Experience Details</h3>
                  <p className="text-sm text-gray-500">Provide details about your work experience</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
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
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g. Technology, Finance, Healthcare"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Key Responsibilities *
                      </label>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => addItem('responsibilities')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.responsibilities.map((responsibility, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={responsibility}
                            onChange={(e) => updateItem('responsibilities', index, e.target.value)}
                            placeholder="e.g. Led development of web applications using React"
                            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {formData.responsibilities.length > 1 && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => removeItem('responsibilities', index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Key Achievements *
                      </label>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => addItem('achievements')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.achievements.map((achievement, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => updateItem('achievements', index, e.target.value)}
                            placeholder="e.g. Increased system performance by 40%"
                            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {formData.achievements.length > 1 && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => removeItem('achievements', index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Key Skills Used *
                      </label>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => addItem('skills')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => updateItem('skills', index, e.target.value)}
                            placeholder="e.g. JavaScript, React, Node.js"
                            className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {formData.skills.length > 1 && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => removeItem('skills', index)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Context */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Context (Optional)
                    </label>
                    <textarea
                      value={formData.context}
                      onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                      placeholder="Any additional context about the role, team size, budget managed, etc."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Bullet Points...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Optimized Bullet Points
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-3">💡 Tips for Great Bullet Points</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Use specific numbers and metrics when possible</li>
                  <li>• Focus on achievements and impact, not just responsibilities</li>
                  <li>• Include relevant technical skills and tools</li>
                  <li>• Mention team size, budget, or scope when applicable</li>
                </ul>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* ATS Score */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">ATS Compatibility Score</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>ATS Score</span>
                            <span>{result.atsScore}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${
                                result.atsScore >= 80 ? 'bg-green-600' :
                                result.atsScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${result.atsScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            result.atsScore >= 80 ? 'bg-green-100 text-green-800' :
                            result.atsScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.atsScore >= 80 ? 'Excellent' :
                             result.atsScore >= 60 ? 'Good' : 'Needs Work'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optimized Bullet Points */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Optimized Bullet Points</h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={copyAllBullets}
                        >
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          Copy All
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {result.optimized.map((bullet, index) => (
                          <div key={index} className="flex items-start">
                            <span className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                            <div className="flex-1">
                              <p className="text-gray-900">{bullet}</p>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => copyToClipboard(bullet)}
                                className="mt-2"
                              >
                                <ClipboardCheck className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Alternative Versions */}
                  {result.alternatives.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Alternative Versions</h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {result.alternatives.map((bullet, index) => (
                            <div key={index} className="flex items-start">
                              <span className="flex-shrink-0 h-2 w-2 bg-gray-400 rounded-full mt-2 mr-3"></span>
                              <div className="flex-1">
                                <p className="text-gray-700">{bullet}</p>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => copyToClipboard(bullet)}
                                  className="mt-2"
                                >
                                  <ClipboardCheck className="h-3 w-3 mr-1" />
                                  Copy
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Keywords */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">ATS Keywords Included</h3>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

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
                              <span className="flex-shrink-0 h-2 w-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
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
                    <Zap className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Bullet Points Generated</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill in your experience details and click "Generate" to create optimized bullet points
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