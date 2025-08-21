"use client";

import { useEffect, useState } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { Button } from '@/components/ui';
import { 
  SparklesIcon,
  DocumentTextIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const SUMMARY_TIPS = [
  "Keep it concise - aim for 2-4 sentences",
  "Highlight your most relevant experience and skills",
  "Include specific achievements with numbers when possible",
  "Tailor it to match the job you're applying for",
  "Use action words and avoid generic phrases",
];

const SUMMARY_EXAMPLES = [
  "Experienced software engineer with 5+ years developing scalable web applications. Led a team of 4 developers to deliver a customer portal that increased user engagement by 40%. Expertise in React, Node.js, and cloud architecture.",
  "Marketing professional with 7 years of experience driving growth for B2B SaaS companies. Increased lead generation by 150% through data-driven campaigns and marketing automation. Skilled in digital marketing, analytics, and team leadership.",
  "Recent computer science graduate with strong foundation in algorithms and data structures. Completed 3 internships at tech companies, contributing to mobile app development and machine learning projects. Passionate about creating user-friendly software solutions.",
];

export default function SummaryStep() {
  const { cvData, updateSummary, updateStepCompletion } = useCVBuilderStore();
  const [summary, setSummary] = useState(cvData.summary || '');
  const [showTips, setShowTips] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Update store when summary changes
  useEffect(() => {
    updateSummary(summary);
    updateStepCompletion('summary', true); // Summary is optional, so always mark as completed
    
    // Update word count
    const words = summary.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [summary]);

  const handleSummaryChange = (value: string) => {
    setSummary(value);
  };

  const insertExample = (example: string) => {
    setSummary(example);
    setShowExamples(false);
  };

  const generateAISummary = async () => {
    const validExperience = cvData.experience?.filter(exp => exp.title && exp.company) || [];
    if (validExperience.length === 0) {
      setAiError('Please add work experience with job title and company first');
      return;
    }

    setIsGenerating(true);
    setAiError(null);

    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experience: cvData.experience?.filter(exp => exp.title && exp.company).map(exp => ({
            title: exp.title,
            company: exp.company,
            years: Math.max(1, exp.endDate ? 
              new Date(exp.endDate).getFullYear() - new Date(exp.startDate).getFullYear() : 
              new Date().getFullYear() - new Date(exp.startDate).getFullYear()),
            skills: exp.skills || ['Professional skills'],
          })) || [],
          targetRole: cvData.experience?.[0]?.title || 'Professional',
          industry: 'Technology',
          level: 'mid',
          tone: 'professional',
          planType: 'FREE'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      if (data.success && data.data?.summary) {
        setSummary(data.data.summary);
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('AI Summary generation error:', error);
      setAiError(error instanceof Error ? error.message : 'Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const getWordCountColor = () => {
    if (wordCount === 0) return 'text-gray-500';
    if (wordCount < 20) return 'text-amber-600';
    if (wordCount <= 80) return 'text-green-600';
    return 'text-red-600';
  };

  const getWordCountMessage = () => {
    if (wordCount === 0) return 'Start writing your summary';
    if (wordCount < 20) return 'Consider adding more detail';
    if (wordCount <= 80) return 'Good length for a professional summary';
    return 'Consider making it more concise';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Summary</h2>
        <p className="text-gray-600">
          Write a brief overview of your professional background and key achievements. This section appears at the top of your CV and gives employers a quick snapshot of your qualifications.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Summary Input */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Professional Summary
              <span className="text-gray-500 font-normal ml-1">(Optional)</span>
            </label>
            <div className="flex items-center space-x-4">
              <span className={`text-sm ${getWordCountColor()}`}>
                {wordCount} words
              </span>
              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <LightBulbIcon className="h-4 w-4" />
                <span>Tips</span>
              </button>
            </div>
          </div>

          <textarea
            value={summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write a compelling summary that highlights your experience, skills, and career achievements. For example: 'Experienced software engineer with 5+ years developing scalable web applications...'"
          />

          <div className="flex items-center justify-between mt-2">
            <p className={`text-sm ${getWordCountColor()}`}>
              {getWordCountMessage()}
            </p>
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <SparklesIcon className="h-4 w-4" />
              <span>See examples</span>
            </button>
          </div>
        </div>

        {/* Tips Section */}
        {showTips && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
              <LightBulbIcon className="h-4 w-4 mr-2" />
              Writing Tips
            </h3>
            <ul className="space-y-2">
              {SUMMARY_TIPS.map((tip, index) => (
                <li key={index} className="text-sm text-blue-800 flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples Section */}
        {showExamples && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-medium text-green-900 mb-3 flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              Example Summaries
            </h3>
            <div className="space-y-4">
              {SUMMARY_EXAMPLES.map((example, index) => (
                <div key={index} className="p-3 bg-white rounded border border-green-200">
                  <p className="text-sm text-gray-700 mb-3">{example}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => insertExample(example)}
                  >
                    Use this example
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-xs text-green-700 mt-3">
              These are examples to inspire you. Customize them with your own experience and achievements.
            </p>
          </div>
        )}

        {/* AI Summary Generation */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <SparklesIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-700 mb-1">AI-Powered Summary Generation</h3>
            <p className="text-xs text-gray-600 mb-3">
              Get personalized summary suggestions based on your work experience
            </p>
            {aiError && (
              <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-700">
                {aiError}
              </div>
            )}
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={generateAISummary}
              disabled={isGenerating || !cvData.experience || cvData.experience.length === 0}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Generate with AI
                </>
              )}
            </Button>
            {(!cvData.experience || cvData.experience.length === 0) && (
              <p className="text-xs text-amber-600 mt-2">
                Add work experience first to enable AI generation
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-green-600">
            {summary.trim() ? `Summary completed (${wordCount} words)` : 'Summary is optional but recommended'}
          </span>
        </div>
      </div>
    </div>
  );
}