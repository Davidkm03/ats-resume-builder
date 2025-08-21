"use client";

import { useState, useEffect, KeyboardEvent } from 'react';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { Button } from '@/components/ui';
import { 
  PlusIcon, 
  XMarkIcon,
  SparklesIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import AISkillsSuggestions from '../ai-skills-suggestions';

const SKILL_CATEGORIES = {
  technical: {
    title: 'Technical Skills',
    icon: CodeBracketIcon,
    placeholder: 'JavaScript, Python, React...',
    suggestions: ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'SQL', 'MongoDB', 'AWS'],
  },
  tools: {
    title: 'Tools & Software',
    icon: WrenchScrewdriverIcon,
    placeholder: 'Git, Docker, Figma...',
    suggestions: ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'Figma', 'Adobe Creative Suite', 'Jira', 'Slack', 'VS Code', 'IntelliJ'],
  },
  soft: {
    title: 'Soft Skills',
    icon: ChatBubbleLeftRightIcon,
    placeholder: 'Leadership, Communication...',
    suggestions: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Critical Thinking', 'Adaptability', 'Time Management'],
  },
};

export default function SkillsStep() {
  const { cvData, updateSkills, updateStepCompletion } = useCVBuilderStore();
  const [skills, setSkills] = useState<string[]>(cvData.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof SKILL_CATEGORIES>('technical');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update store when skills change
  useEffect(() => {
    updateSkills(skills);
    updateStepCompletion('skills', skills.length > 0);
  }, [skills]);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills(prev => [...prev, trimmedSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(newSkill);
    } else if (e.key === ',') {
      e.preventDefault();
      addSkill(newSkill);
    }
  };

  const addSuggestedSkill = (skill: string) => {
    addSkill(skill);
    setShowSuggestions(false);
  };

  const getSkillsByCategory = () => {
    // This is a simple categorization - in a real app, you might want to store categories
    const technical = skills.filter(skill => 
      ['javascript', 'python', 'react', 'node', 'typescript', 'java', 'c++', 'sql', 'mongodb', 'aws', 'html', 'css', 'angular', 'vue', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin'].some(tech => 
        skill.toLowerCase().includes(tech)
      )
    );
    
    const tools = skills.filter(skill => 
      ['git', 'docker', 'kubernetes', 'jenkins', 'figma', 'adobe', 'jira', 'slack', 'vscode', 'intellij', 'photoshop', 'illustrator'].some(tool => 
        skill.toLowerCase().includes(tool)
      )
    );
    
    const soft = skills.filter(skill => 
      !technical.includes(skill) && !tools.includes(skill)
    );

    return { technical, tools, soft };
  };

  const categorizedSkills = getSkillsByCategory();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills</h2>
        <p className="text-gray-600">
          List your technical skills, programming languages, tools, and other relevant abilities.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
        {/* Add Skills Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Skills</h3>
          
          {/* Category Tabs */}
          <div className="flex space-x-1 mb-4 bg-gray-100 p-1 rounded-lg">
            {Object.entries(SKILL_CATEGORIES).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as keyof typeof SKILL_CATEGORIES)}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                    selectedCategory === key
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.title}</span>
                </button>
              );
            })}
          </div>

          {/* Skill Input */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={SKILL_CATEGORIES[selectedCategory].placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Press Enter or comma to add a skill
                </p>
              </div>
              <Button
                type="button"
                onClick={() => addSkill(newSkill)}
                disabled={!newSkill.trim()}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Suggestions */}
            <div>
              <button
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <SparklesIcon className="h-4 w-4" />
                <span>Show suggestions for {SKILL_CATEGORIES[selectedCategory].title.toLowerCase()}</span>
              </button>

              {showSuggestions && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {SKILL_CATEGORIES[selectedCategory].suggestions
                      .filter(suggestion => !skills.includes(suggestion))
                      .map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => addSuggestedSkill(suggestion)}
                          className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
                        >
                          + {suggestion}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Display */}
        {skills.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Skills ({skills.length})</h3>
            
            {/* All Skills */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">All Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Categorized Skills Preview */}
              {(categorizedSkills.technical.length > 0 || categorizedSkills.tools.length > 0 || categorizedSkills.soft.length > 0) && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Skills by Category</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categorizedSkills.technical.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-600 mb-2 flex items-center">
                          <CodeBracketIcon className="h-3 w-3 mr-1" />
                          Technical ({categorizedSkills.technical.length})
                        </h5>
                        <div className="space-y-1">
                          {categorizedSkills.technical.map((skill) => (
                            <span key={skill} className="block text-sm text-gray-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {categorizedSkills.tools.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-600 mb-2 flex items-center">
                          <WrenchScrewdriverIcon className="h-3 w-3 mr-1" />
                          Tools ({categorizedSkills.tools.length})
                        </h5>
                        <div className="space-y-1">
                          {categorizedSkills.tools.map((skill) => (
                            <span key={skill} className="block text-sm text-gray-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {categorizedSkills.soft.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-600 mb-2 flex items-center">
                          <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                          Soft Skills ({categorizedSkills.soft.length})
                        </h5>
                        <div className="space-y-1">
                          {categorizedSkills.soft.map((skill) => (
                            <span key={skill} className="block text-sm text-gray-700">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Validation Status */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
          {skills.length > 0 ? (
            <>
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">
                {skills.length} skill{skills.length !== 1 ? 's' : ''} added
              </span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-amber-600">Please add at least one skill</span>
            </>
          )}
        </div>
      </div>

      {/* AI Skills Suggestions */}
      <AISkillsSuggestions className="mt-6" />
    </div>
  );
}