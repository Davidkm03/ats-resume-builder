"use client";

import { useState } from 'react';
import { Sparkles, Wand2, Copy, RefreshCw, Check, Lightbulb, Code, Trophy } from 'lucide-react';
import { Button } from '@/components/ui';
import { Project } from '@/types/cv';

interface AIProjectGeneratorProps {
  project: Project;
  onUpdate: (updatedProject: Project) => void;
  className?: string;
}

interface GeneratedContent {
  description?: string;
  technologies?: string[];
  achievements?: string[];
  keyFeatures?: string[];
}

export default function AIProjectGenerator({ 
  project, 
  onUpdate, 
  className 
}: AIProjectGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'technologies' | 'achievements' | 'features'>('description');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const generateProjectContent = async () => {
    if (!project.name) {
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const content = await generateAIContent(project);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating project content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIContent = async (proj: Project): Promise<GeneratedContent> => {
    const projectName = proj.name.toLowerCase();
    const existingDescription = proj.description?.toLowerCase() || '';
    const existingTechnologies = proj.technologies || [];
    
    let description = '';
    let technologies: string[] = [];
    let achievements: string[] = [];
    let keyFeatures: string[] = [];

    // Generate content based on project name and existing info
    if (projectName.includes('ecommerce') || projectName.includes('shop') || projectName.includes('store')) {
      description = `Full-stack e-commerce platform featuring user authentication, product catalog management, shopping cart functionality, and secure payment processing. Implemented responsive design with modern UI/UX principles and integrated third-party APIs for enhanced functionality. Deployed with scalable architecture supporting high traffic loads.`;
      technologies = ['React', 'Node.js', 'MongoDB', 'Stripe API', 'JWT', 'Express.js', 'Tailwind CSS', 'AWS'];
      achievements = [
        'Achieved 99.9% uptime with optimized database queries',
        'Reduced page load times by 40% through code splitting',
        'Processed 10,000+ transactions with zero security incidents',
        'Implemented automated testing with 95% code coverage'
      ];
      keyFeatures = [
        'Real-time inventory management',
        'Advanced search and filtering',
        'Multi-payment gateway integration',
        'Admin dashboard with analytics',
        'Mobile-responsive design',
        'Email notification system'
      ];
    } else if (projectName.includes('dashboard') || projectName.includes('admin') || projectName.includes('analytics')) {
      description = `Interactive dashboard application providing real-time data visualization and analytics. Features comprehensive reporting tools, user management system, and customizable widgets. Built with modern frontend frameworks and integrated with multiple data sources for comprehensive business intelligence.`;
      technologies = ['React', 'TypeScript', 'D3.js', 'Chart.js', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'];
      achievements = [
        'Improved data processing speed by 60% with optimized queries',
        'Reduced manual reporting time from hours to minutes',
        'Served 500+ concurrent users without performance degradation',
        'Achieved 98% user satisfaction in usability testing'
      ];
      keyFeatures = [
        'Real-time data visualization',
        'Customizable dashboard widgets',
        'Advanced filtering and search',
        'Export functionality (PDF, Excel)',
        'Role-based access control',
        'Automated report generation'
      ];
    } else if (projectName.includes('mobile') || projectName.includes('app') || projectName.includes('ios') || projectName.includes('android')) {
      description = `Cross-platform mobile application delivering seamless user experience across iOS and Android devices. Implemented native-like performance with offline capabilities, push notifications, and intuitive user interface. Integrated with cloud services for data synchronization and real-time updates.`;
      technologies = ['React Native', 'TypeScript', 'Firebase', 'Redux', 'Expo', 'AsyncStorage', 'Push Notifications'];
      achievements = [
        'Achieved 4.8/5 star rating on app stores',
        'Reached 50,000+ downloads in first 6 months',
        'Reduced app crash rate to less than 0.1%',
        'Implemented offline-first architecture'
      ];
      keyFeatures = [
        'Cross-platform compatibility',
        'Offline data synchronization',
        'Push notification system',
        'Biometric authentication',
        'Social media integration',
        'In-app messaging'
      ];
    } else if (projectName.includes('api') || projectName.includes('backend') || projectName.includes('service')) {
      description = `Robust RESTful API service designed for scalability and performance. Implemented comprehensive authentication, rate limiting, and data validation. Features extensive documentation, automated testing, and monitoring capabilities. Deployed with containerization for easy scaling and maintenance.`;
      technologies = ['Node.js', 'Express.js', 'PostgreSQL', 'Redis', 'Docker', 'JWT', 'Swagger', 'Jest'];
      achievements = [
        'Handled 1M+ API requests per day with 99.9% uptime',
        'Reduced response times by 50% through caching strategies',
        'Implemented comprehensive security measures (OWASP)',
        'Achieved 100% API documentation coverage'
      ];
      keyFeatures = [
        'RESTful API architecture',
        'Comprehensive authentication system',
        'Rate limiting and throttling',
        'Automated API documentation',
        'Health monitoring and logging',
        'Horizontal scaling capabilities'
      ];
    } else if (projectName.includes('ai') || projectName.includes('ml') || projectName.includes('machine learning')) {
      description = `Machine learning project implementing advanced algorithms for data analysis and prediction. Features data preprocessing pipelines, model training and evaluation, and deployment infrastructure. Achieved high accuracy rates through feature engineering and hyperparameter optimization.`;
      technologies = ['Python', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Jupyter', 'Docker', 'AWS SageMaker'];
      achievements = [
        'Achieved 95% accuracy in model predictions',
        'Reduced processing time by 70% with optimized algorithms',
        'Processed 1TB+ of training data successfully',
        'Deployed model serving 10,000+ predictions daily'
      ];
      keyFeatures = [
        'Advanced data preprocessing',
        'Multiple ML algorithm implementation',
        'Model performance monitoring',
        'Automated retraining pipeline',
        'Real-time prediction API',
        'Comprehensive evaluation metrics'
      ];
    } else {
      // Generic project content
      description = `Comprehensive software project demonstrating full-stack development capabilities. Implemented modern development practices including version control, testing, and deployment automation. Features user-friendly interface, robust backend architecture, and scalable database design.`;
      technologies = ['JavaScript', 'HTML/CSS', 'Node.js', 'Express.js', 'MongoDB', 'Git', 'Heroku'];
      achievements = [
        'Successfully delivered project on time and within budget',
        'Implemented responsive design for all screen sizes',
        'Achieved 90%+ code coverage with automated tests',
        'Optimized performance for fast loading times'
      ];
      keyFeatures = [
        'User authentication system',
        'Responsive web design',
        'Database integration',
        'API development',
        'Version control with Git',
        'Deployment automation'
      ];
    }

    // Merge with existing technologies if any
    if (existingTechnologies.length > 0) {
      const combinedTech = [...existingTechnologies, ...technologies];
      technologies = Array.from(new Set(combinedTech));
    }

    return {
      description,
      technologies: technologies.slice(0, 8), // Limit to 8 technologies
      achievements: achievements.slice(0, 4), // Limit to 4 achievements
      keyFeatures: keyFeatures.slice(0, 6) // Limit to 6 features
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

    let updatedProject = { ...project };

    switch (field) {
      case 'description':
        updatedProject = { ...updatedProject, description: value as string };
        break;
      case 'technologies':
        updatedProject = { ...updatedProject, technologies: value as string[] };
        break;
      case 'achievements':
        // Store achievements in description if no separate field exists
        const achievementText = (value as string[]).map(a => `• ${a}`).join('\n');
        updatedProject = { 
          ...updatedProject, 
          description: updatedProject.description 
            ? `${updatedProject.description}\n\nKey Achievements:\n${achievementText}`
            : `Key Achievements:\n${achievementText}`
        };
        break;
      case 'keyFeatures':
        // Store features in description if no separate field exists
        const featureText = (value as string[]).map(f => `• ${f}`).join('\n');
        updatedProject = { 
          ...updatedProject, 
          description: updatedProject.description 
            ? `${updatedProject.description}\n\nKey Features:\n${featureText}`
            : `Key Features:\n${featureText}`
        };
        break;
    }

    onUpdate(updatedProject);
  };

  const regenerateContent = async (field: keyof GeneratedContent) => {
    if (!project.name) return;

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newContent = await generateAIContent(project);
      setGeneratedContent(prev => prev ? { ...prev, [field]: newContent[field] } : newContent);
    } catch (error) {
      console.error('Error regenerating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = project.name;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wand2 className="w-5 h-5 text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Project Content Generator
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Generate descriptions, technologies, and achievements for your project
            </p>
          </div>
        </div>
        
        <Button
          onClick={generateProjectContent}
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
            Please add your project name first to generate AI content.
          </p>
        </div>
      )}

      {generatedContent && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            {[
              { id: 'description', label: 'Description', icon: <Lightbulb className="w-4 h-4" /> },
              { id: 'technologies', label: 'Technologies', icon: <Code className="w-4 h-4" /> },
              { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
              { id: 'features', label: 'Features', icon: <Sparkles className="w-4 h-4" /> }
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
                {tab.icon}
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

            {activeTab === 'technologies' && generatedContent.technologies && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Suggested Technologies</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerateContent('technologies')}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.technologies!.join(', '), 'technologies')}
                    >
                      {copiedField === 'technologies' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => applyGenerated('technologies')}
                  className="w-full"
                >
                  Apply Technologies
                </Button>
              </div>
            )}

            {activeTab === 'achievements' && generatedContent.achievements && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Key Achievements</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerateContent('achievements')}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.achievements!.join('\n• '), 'achievements')}
                    >
                      {copiedField === 'achievements' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <ul className="space-y-2">
                    {generatedContent.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Trophy className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => applyGenerated('achievements')}
                  className="w-full"
                >
                  Add to Description
                </Button>
              </div>
            )}

            {activeTab === 'features' && generatedContent.keyFeatures && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">Key Features</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerateContent('keyFeatures')}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.keyFeatures!.join('\n• '), 'features')}
                    >
                      {copiedField === 'features' ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <ul className="space-y-2">
                    {generatedContent.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() => applyGenerated('keyFeatures')}
                  className="w-full"
                >
                  Add to Description
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 dark:text-green-200 mb-2">
              🚀 Project Enhancement Tips
            </h4>
            <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
              <li>• Generated content is based on your project name and context</li>
              <li>• Customize the suggestions to match your specific implementation</li>
              <li>• Use achievements and features to highlight your impact</li>
              <li>• Include relevant technologies that demonstrate your skills</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
