"use client";

import { useState } from 'react';
import { Sparkles, Wand2, Copy, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui';
import { Education } from '@/types/cv';

interface AIEducationGeneratorProps {
  education: Education;
  onUpdate: (updatedEducation: Education) => void;
  className?: string;
}

interface GeneratedContent {
  description?: string;
  relevantCourses?: string[];
  honors?: string;
}

export default function AIEducationGenerator({ 
  education, 
  onUpdate, 
  className 
}: AIEducationGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'courses' | 'honors'>('description');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateEducationContent = async () => {
    if (!education.degree || !education.institution) {
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const content = await generateAIContent(education);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating education content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIContent = async (edu: Education): Promise<GeneratedContent> => {
    // Mock AI-generated content based on degree and institution
    const degreeType = edu.degree.toLowerCase();
    const institution = edu.institution;
    
    let description = '';
    let relevantCourses: string[] = [];
    let honors = '';

    // Generate description based on degree type
    if (degreeType.includes('computer science') || degreeType.includes('cs')) {
      description = `Comprehensive study in computer science fundamentals including algorithms, data structures, software engineering, and system design. Gained practical experience in multiple programming languages and development methodologies. Completed capstone projects involving real-world software solutions.`;
      relevantCourses = [
        'Data Structures and Algorithms',
        'Software Engineering',
        'Database Systems',
        'Computer Networks',
        'Operating Systems',
        'Machine Learning',
        'Web Development',
        'Mobile App Development'
      ];
    } else if (degreeType.includes('business') || degreeType.includes('mba')) {
      description = `Comprehensive business education covering strategic management, finance, marketing, and operations. Developed analytical and leadership skills through case studies, group projects, and real-world business simulations. Focus on data-driven decision making and organizational leadership.`;
      relevantCourses = [
        'Strategic Management',
        'Financial Analysis',
        'Marketing Strategy',
        'Operations Management',
        'Business Analytics',
        'Leadership and Ethics',
        'International Business',
        'Entrepreneurship'
      ];
    } else if (degreeType.includes('engineering')) {
      description = `Rigorous engineering program emphasizing problem-solving, analytical thinking, and technical design. Hands-on experience with industry-standard tools and methodologies. Completed design projects demonstrating practical application of engineering principles.`;
      relevantCourses = [
        'Engineering Mathematics',
        'Physics and Chemistry',
        'Materials Science',
        'Thermodynamics',
        'Circuit Analysis',
        'Control Systems',
        'Project Management',
        'Engineering Ethics'
      ];
    } else if (degreeType.includes('design') || degreeType.includes('art')) {
      description = `Creative and technical education in design principles, visual communication, and digital media. Developed proficiency in industry-standard design software and methodologies. Portfolio includes diverse projects demonstrating creative problem-solving abilities.`;
      relevantCourses = [
        'Design Fundamentals',
        'Digital Media',
        'Typography',
        'Color Theory',
        'User Experience Design',
        'Brand Identity',
        'Portfolio Development',
        'Design History'
      ];
    } else {
      description = `Well-rounded academic program providing strong foundation in critical thinking, research, and communication. Developed analytical and problem-solving skills applicable across various professional contexts. Active participation in academic and extracurricular activities.`;
      relevantCourses = [
        'Research Methods',
        'Critical Thinking',
        'Communication Skills',
        'Statistics',
        'Project Management',
        'Ethics',
        'Leadership',
        'Interdisciplinary Studies'
      ];
    }

    // Generate honors based on GPA or existing honors
    if (edu.gpa && parseFloat(edu.gpa) >= 3.7) {
      honors = 'Dean\'s List, Magna Cum Laude';
    } else if (edu.gpa && parseFloat(edu.gpa) >= 3.5) {
      honors = 'Dean\'s List';
    } else if (edu.honors) {
      honors = edu.honors;
    }

    return {
      description,
      relevantCourses: relevantCourses.slice(0, 6), // Limit to 6 courses
      honors
    };
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const applyGenerated = (field: keyof GeneratedContent) => {
    if (!generatedContent) return;

    const value = generatedContent[field];
    if (!value) return;

    let updatedEducation = { ...education };

    switch (field) {
      case 'description':
        updatedEducation = { ...updatedEducation, description: value as string };
        break;
      case 'relevantCourses':
        updatedEducation = { ...updatedEducation, relevantCourses: value as string[] };
        break;
      case 'honors':
        updatedEducation = { ...updatedEducation, honors: value as string };
        break;
    }

    onUpdate(updatedEducation);
  };

  const regenerateContent = async (field: keyof GeneratedContent) => {
    if (!education.degree || !education.institution) return;

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newContent = await generateAIContent(education);
      setGeneratedContent(prev => prev ? { ...prev, [field]: newContent[field] } : newContent);
    } catch (error) {
      console.error('Error regenerating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = education.degree && education.institution;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wand2 className="w-5 h-5 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Education Content Generator
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Generate descriptions, courses, and honors for your education
            </p>
          </div>
        </div>
        
        <Button
          onClick={generateEducationContent}
          disabled={!canGenerate || isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>

      {!canGenerate && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Wand2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">
            Please add your degree and institution first to generate AI content.
          </p>
        </div>
      )}

      {generatedContent && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {[
              { id: 'description', label: 'Description', icon: '📝' },
              { id: 'courses', label: 'Relevant Courses', icon: '📚' },
              { id: 'honors', label: 'Honors', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-4">
            {activeTab === 'description' && generatedContent.description && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Generated Description</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerateContent('description')}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.description!, 'description')}
                    >
                      {copiedField === 'description' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {generatedContent.description}
                  </p>
                </div>
                <Button
                  onClick={() => applyGenerated('description')}
                  className="w-full"
                >
                  Apply Description
                </Button>
              </div>
            )}

            {activeTab === 'courses' && generatedContent.relevantCourses && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Relevant Courses</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerateContent('relevantCourses')}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.relevantCourses!.join(', '), 'courses')}
                    >
                      {copiedField === 'courses' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    {generatedContent.relevantCourses.map((course, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-700 dark:text-gray-300 p-2 bg-white dark:bg-gray-600 rounded border"
                      >
                        {course}
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => applyGenerated('relevantCourses')}
                  className="w-full"
                >
                  Apply Courses
                </Button>
              </div>
            )}

            {activeTab === 'honors' && generatedContent.honors && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Honors & Achievements</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerateContent('honors')}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.honors!, 'honors')}
                    >
                      {copiedField === 'honors' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {generatedContent.honors}
                  </p>
                </div>
                <Button
                  onClick={() => applyGenerated('honors')}
                  className="w-full"
                >
                  Apply Honors
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              💡 AI Content Tips
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Generated content is based on your degree and institution</li>
              <li>• Review and customize the content to match your specific experience</li>
              <li>• Use the regenerate button to get alternative suggestions</li>
              <li>• Copy individual sections to use in other applications</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
