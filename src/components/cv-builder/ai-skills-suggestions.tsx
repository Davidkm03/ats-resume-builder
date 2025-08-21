"use client";

import { useState } from 'react';
import { Sparkles, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCVBuilderStore } from '@/stores/cv-builder';

interface SkillSuggestion {
  skill: string;
  relevance: number;
  category: string;
}

interface AISkillsSuggestionsProps {
  className?: string;
}

export default function AISkillsSuggestions({ className }: AISkillsSuggestionsProps) {
  const { cvData, updateSkills } = useCVBuilderStore();
  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const generateSkillSuggestions = async () => {
    setIsLoading(true);
    try {
      // Extract context from CV data
      const jobTitles = cvData.experience?.map(exp => exp.title).join(', ') || '';
      const companies = cvData.experience?.map(exp => exp.company).join(', ') || '';
      const currentSkills = cvData.skills?.join(', ') || '';
      
      const prompt = `Based on the following professional profile, suggest 10-15 relevant technical and soft skills:
      
Job Titles: ${jobTitles}
Companies: ${companies}
Current Skills: ${currentSkills}
Industry Context: ${cvData.summary || 'Professional with diverse experience'}

Please provide skills that would be valuable for someone in these roles, avoiding duplicates with current skills. Focus on:
1. Technical skills relevant to the job titles
2. Industry-standard tools and technologies
3. Soft skills that complement the technical expertise
4. Emerging skills in the field

Format as JSON array with objects containing: skill, relevance (1-10), category (Technical/Soft/Tool/Certification)`;

      // Simulate AI API call (replace with actual AI service)
      const mockSuggestions: SkillSuggestion[] = [
        { skill: 'React.js', relevance: 9, category: 'Technical' },
        { skill: 'TypeScript', relevance: 8, category: 'Technical' },
        { skill: 'Node.js', relevance: 8, category: 'Technical' },
        { skill: 'AWS Cloud Services', relevance: 7, category: 'Technical' },
        { skill: 'Docker', relevance: 7, category: 'Tool' },
        { skill: 'Agile Methodologies', relevance: 8, category: 'Soft' },
        { skill: 'Team Leadership', relevance: 6, category: 'Soft' },
        { skill: 'Problem Solving', relevance: 9, category: 'Soft' },
        { skill: 'Git Version Control', relevance: 8, category: 'Tool' },
        { skill: 'REST API Development', relevance: 7, category: 'Technical' },
        { skill: 'Database Design', relevance: 6, category: 'Technical' },
        { skill: 'CI/CD Pipelines', relevance: 6, category: 'Technical' },
      ];

      // Filter out skills that already exist
      const existingSkillsLower = (cvData.skills || []).map(s => s.toLowerCase());
      const filteredSuggestions = mockSuggestions.filter(
        suggestion => !existingSkillsLower.includes(suggestion.skill.toLowerCase())
      );

      setSuggestions(filteredSuggestions.sort((a, b) => b.relevance - a.relevance));
      setIsVisible(true);
    } catch (error) {
      console.error('Error generating skill suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = (skill: string) => {
    const updatedSkills = [...(cvData.skills || []), skill];
    updateSkills(updatedSkills);
    
    // Remove the added skill from suggestions
    setSuggestions(prev => prev.filter(s => s.skill !== skill));
  };

  const removeSuggestion = (skillToRemove: string) => {
    setSuggestions(prev => prev.filter(s => s.skill !== skillToRemove));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Soft': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Tool': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Certification': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Skills Suggestions
          </h3>
        </div>
        
        <Button
          onClick={generateSkillSuggestions}
          disabled={isLoading}
          size="sm"
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isLoading ? 'Generating...' : 'Generate Suggestions'}
        </Button>
      </div>

      {!isVisible && !isLoading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">
            Click "Generate Suggestions" to get AI-powered skill recommendations
            <br />
            based on your experience and job titles.
          </p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Found {suggestions.length} relevant skills for your profile
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {suggestion.skill}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full mr-1 ${
                            i < Math.round(suggestion.relevance / 2)
                              ? 'bg-yellow-400'
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {suggestion.relevance}/10
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addSkill(suggestion.skill)}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSuggestion(suggestion.skill)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                // Add all remaining suggestions
                const skillsToAdd = suggestions.map(s => s.skill);
                const updatedSkills = [...(cvData.skills || []), ...skillsToAdd];
                updateSkills(updatedSkills);
                setSuggestions([]);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add All Suggestions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
