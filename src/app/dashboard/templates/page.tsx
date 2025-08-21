"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui';
import { 
  LayoutTemplate, 
  Eye, 
  Crown,
  Check,
  Star,
  Grid3X3,
  List
} from 'lucide-react';
import Link from 'next/link';
import TemplatePreviewGenerator from '@/components/cv-builder/template-preview-generator';
import { templateEngine } from '@/lib/template-engine';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  isPremium: boolean;
  previewImage: string;
  features: string[];
  rating: number;
  downloads: number;
}

// Get templates from the template engine
const getTemplates = () => {
  try {
    const engineTemplates = templateEngine.getTemplates();
    
    // Add the new templates that were implemented
    const additionalTemplates: Template[] = [
      {
        id: 'executive',
        name: 'Executive Professional',
        description: 'Premium design for senior executives and C-level positions',
        category: 'modern',
        isPremium: false,
        previewImage: '/templates/executive-preview.jpg',
        features: ['Executive Layout', 'Leadership Focus', 'Premium Design'],
        rating: 4.9,
        downloads: 8420
      },
      {
        id: 'creative',
        name: 'Creative Designer',
        description: 'Eye-catching template for creative professionals and designers',
        category: 'creative',
        isPremium: false,
        previewImage: '/templates/creative-preview.jpg',
        features: ['Creative Layout', 'Visual Impact', 'Portfolio Focus'],
        rating: 4.8,
        downloads: 7230
      },
      {
        id: 'technical',
        name: 'Technical Expert',
        description: 'Optimized for developers, engineers, and technical roles',
        category: 'modern',
        isPremium: false,
        previewImage: '/templates/technical-preview.jpg',
        features: ['Tech Focused', 'Skills Highlight', 'Project Showcase'],
        rating: 4.9,
        downloads: 9540
      },
      {
        id: 'academic',
        name: 'Academic Scholar',
        description: 'Traditional design perfect for academic and research positions',
        category: 'classic',
        isPremium: false,
        previewImage: '/templates/academic-preview.jpg',
        features: ['Academic Format', 'Research Focus', 'Publication Ready'],
        rating: 4.7,
        downloads: 5670
      },
      {
        id: 'sales',
        name: 'Sales Professional',
        description: 'Results-driven template highlighting achievements and metrics',
        category: 'modern',
        isPremium: false,
        previewImage: '/templates/sales-preview.jpg',
        features: ['Achievement Focus', 'Metrics Highlight', 'Results Driven'],
        rating: 4.8,
        downloads: 6890
      },
      {
        id: 'premium-executive',
        name: 'Executive Elite',
        description: 'Ultra-premium template with advanced styling for top executives',
        category: 'modern',
        isPremium: true,
        previewImage: '/templates/premium-executive-preview.jpg',
        features: ['Ultra Premium', 'Executive Branding', 'Luxury Design'],
        rating: 5.0,
        downloads: 3240
      },
      {
        id: 'premium-creative',
        name: 'Creative Master',
        description: 'Advanced creative template with portfolio integration',
        category: 'creative',
        isPremium: true,
        previewImage: '/templates/premium-creative-preview.jpg',
        features: ['Portfolio Integration', 'Advanced Layout', 'Creative Freedom'],
        rating: 4.9,
        downloads: 2890
      }
    ];

    // Convert template engine entries to our format
    const convertedTemplates: Template[] = engineTemplates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category as 'modern' | 'classic' | 'creative' | 'minimal',
      isPremium: template.isPremium,
      previewImage: template.preview || `/templates/${template.id}-preview.jpg`,
      features: template.config.metadata.tags.slice(0, 3),
      rating: Math.round((Math.random() * 0.5 + 4.5) * 10) / 10, // Random rating 4.5-5.0
      downloads: Math.floor(Math.random() * 10000) + 5000 // Random downloads
    }));

    return [...convertedTemplates, ...additionalTemplates];
  } catch (error) {
    console.error('Failed to load templates from engine:', error);
    // Fallback to static templates
    return [
      {
        id: 'modern-v2',
        name: 'Modern Professional',
        description: 'Clean, modern design perfect for tech and creative industries',
        category: 'modern',
        isPremium: false,
        previewImage: '/templates/modern-preview.jpg',
        features: ['ATS Optimized', 'Clean Layout', 'Modern Typography'],
        rating: 4.9,
        downloads: 15420
      },
      {
        id: 'classic',
        name: 'Classic Traditional',
        description: 'Traditional format ideal for corporate and formal positions',
        category: 'classic',
        isPremium: false,
        previewImage: '/templates/classic-preview.jpg',
        features: ['Traditional Layout', 'Professional', 'Industry Standard'],
        rating: 4.7,
        downloads: 12180
      },
      {
        id: 'minimal',
        name: 'Minimal Clean',
        description: 'Minimalist design that highlights your content',
        category: 'minimal',
        isPremium: false,
        previewImage: '/templates/minimal-preview.jpg',
        features: ['Ultra Clean', 'Content Focused', 'Easy to Read'],
        rating: 4.8,
        downloads: 9850
      }
    ];
  }
};

const categories = [
  { id: 'all', name: 'All Templates', icon: Grid3X3 },
  { id: 'modern', name: 'Modern', icon: LayoutTemplate },
  { id: 'classic', name: 'Classic', icon: List },
  { id: 'creative', name: 'Creative', icon: Star },
  { id: 'minimal', name: 'Minimal', icon: Eye }
];

export default function TemplatesPage() {
  const { user, isLoading, isPremium } = useRequireAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [templates] = useState(() => getTemplates());

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

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  const selectTemplate = (templateId: string) => {
    // Navigate to CV builder with selected template using Next.js router
    router.push(`/dashboard/cvs/builder?template=${templateId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CV Templates</h1>
            <p className="text-sm text-gray-600 mt-1">
              Choose from professionally designed templates optimized for ATS systems
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {category.id === 'all' 
                      ? templates.length 
                      : templates.filter(t => t.category === category.id).length
                    }
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredTemplates.map((template) => (
            <div key={template.id} className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
              viewMode === 'list' ? 'flex items-center p-6' : 'overflow-hidden'
            }`}>
              {/* Template Preview */}
              <div className={viewMode === 'list' ? 'w-24 h-32 flex-shrink-0 mr-6' : 'aspect-[3/4] bg-gray-100 relative overflow-hidden'}>
                {/* Check if template exists in engine, if not show placeholder */}
                {templateEngine.getTemplate(template.id) ? (
                  <TemplatePreviewGenerator
                    templateId={template.id}
                    className="w-full h-full"
                    scale={viewMode === 'list' ? 0.15 : 0.25}
                    mode="thumbnail"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <LayoutTemplate className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-xs text-gray-500 block">{template.name}</span>
                      {template.isPremium && (
                        <Crown className="h-4 w-4 text-yellow-500 mx-auto mt-1" />
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className={viewMode === 'list' ? 'flex-1' : 'p-6'}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      {template.name}
                      {template.isPremium && (
                        <Crown className="h-4 w-4 text-yellow-500 ml-2" />
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.features.map((feature, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Check className="h-3 w-3 mr-1" />
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {template.rating}
                  </div>
                  <div>{template.downloads.toLocaleString()} downloads</div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => selectTemplate(template.id)}
                    disabled={template.isPremium && !isPremium}
                    className="flex-1"
                  >
                    {template.isPremium && !isPremium ? (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Premium Required
                      </>
                    ) : (
                      'Use Template'
                    )}
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {template.isPremium && !isPremium && (
                  <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                    <p className="text-sm text-yellow-800">
                      This is a premium template. 
                      <Link href="/dashboard/subscription" className="font-medium underline">
                        Upgrade to access
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Premium Upsell */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Unlock Premium Templates</h3>
                <p className="text-blue-100">
                  Get access to exclusive premium templates and advanced features
                </p>
              </div>
              <Link href="/dashboard/subscription">
                <Button variant="secondary">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{templates.length}</div>
              <div className="text-sm text-gray-500">Total Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {templates.filter(t => !t.isPremium).length}
              </div>
              <div className="text-sm text-gray-500">Free Templates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {templates.filter(t => t.isPremium).length}
              </div>
              <div className="text-sm text-gray-500">Premium Templates</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}