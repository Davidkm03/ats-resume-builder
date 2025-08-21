"use client";

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  FileText,
  Sparkles,
  ArrowLeft,
  ClipboardCheck,
  Tag,
  Briefcase,
  Info
} from 'lucide-react';
import { Button, LinkButton } from '@/components/ui';

interface JobAnalysisResult {
  keywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  industryTerms: string[];
  companyInfo: {
    name?: string;
    industry?: string;
    size?: string;
  };
  roleLevel: 'entry' | 'mid' | 'senior' | 'executive';
  suggestions: string[];
}

export default function JobAnalysisPage() {
  const { user, isLoading } = useRequireAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<JobAnalysisResult | null>(null);
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

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
          planType: user.subscriptionTier?.toUpperCase() || 'FREE',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze job description');
      }

      setResult(data.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
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
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Job Description Analysis</h1>
                  <p className="text-sm text-gray-500">
                    Extract keywords, skills, and insights from job postings to optimize your CV
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Job Description Input</h3>
                  <p className="text-sm text-gray-500">Paste the complete job description below</p>
                </div>
                <div className="p-6">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here...

Example:
Senior Software Engineer - Full Stack
Company: TechCorp
Location: San Francisco, CA

We are seeking an experienced Senior Software Engineer to join our dynamic team...

Requirements:
- 5+ years of experience with React, Node.js
- Experience with cloud platforms (AWS, GCP)
- Strong problem-solving skills..."
                    className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex">
                        <Info className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {jobDescription.length} characters
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !jobDescription.trim()}
                      className="flex items-center"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze Job Description
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-3">💡 Tips for Better Analysis</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Include the complete job posting with requirements and responsibilities</li>
                  <li>• Copy company information and job title for better insights</li>
                  <li>• Include both required and preferred qualifications</li>
                  <li>• Add salary range and benefits if mentioned</li>
                </ul>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Company Info */}
                  {(result.companyInfo.name || result.companyInfo.industry) && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <Briefcase className="h-5 w-5 text-gray-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-2">
                          {result.companyInfo.name && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Company:</span>
                              <span className="ml-2 text-gray-900">{result.companyInfo.name}</span>
                            </div>
                          )}
                          {result.companyInfo.industry && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Industry:</span>
                              <span className="ml-2 text-gray-900">{result.companyInfo.industry}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-medium text-gray-500">Role Level:</span>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {result.roleLevel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Required Skills */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">Required Skills</h3>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyToClipboard(result.requiredSkills.join(', '))}
                        >
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2">
                        {result.requiredSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preferred Skills */}
                  {result.preferredSkills.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">Preferred Skills</h3>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => copyToClipboard(result.preferredSkills.join(', '))}
                          >
                            <ClipboardCheck className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                          {result.preferredSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Keywords */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tag className="h-5 w-5 text-gray-600 mr-2" />
                          <h3 className="text-lg font-medium text-gray-900">Key Terms & Keywords</h3>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyToClipboard(result.keywords.join(', '))}
                        >
                          <ClipboardCheck className="h-4 w-4 mr-1" />
                          Copy All
                        </Button>
                      </div>
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

                  {/* Industry Terms */}
                  {result.industryTerms.length > 0 && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Industry-Specific Terms</h3>
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                          {result.industryTerms.map((term, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">CV Optimization Suggestions</h3>
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
                </>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Analysis Yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter a job description and click "Analyze" to get detailed insights
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