"use client";

import React from 'react';
import { CVData, TemplateType } from '@/types/cv';
import { templateEngine } from '@/lib/template-engine';
import { getTemplateComponent } from '@/lib/template-engine/registry';
import { TemplateRenderProps } from '@/types/template';
import { cn } from '@/lib/utils';

interface TemplatePreviewGeneratorProps {
  templateId: string;
  data?: CVData;
  className?: string;
  scale?: number;
  mode?: 'preview' | 'thumbnail' | 'export';
}

// Sample data for previews
const SAMPLE_CV_DATA: CVData = {
  id: 'sample',
  name: 'Sample CV',
  template: 'modern',
  contact: {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'alexjohnson.dev',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
  },
  summary: 'Experienced Software Engineer with 5+ years developing scalable web applications using modern technologies. Passionate about creating user-centric solutions and mentoring junior developers.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2022-01',
      endDate: undefined,
      isPresent: true,
      description: 'Lead development of microservices architecture serving 1M+ users daily. Mentored team of 4 junior developers and improved deployment efficiency by 40%.',
      bullets: [
        'Built scalable microservices handling 1M+ daily users',
        'Reduced deployment time by 40% through CI/CD optimization',
        'Mentored 4 junior developers, improving team productivity by 25%',
        'Led migration from monolith to microservices architecture'
      ]
    },
    {
      title: 'Software Engineer',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      startDate: '2020-06',
      endDate: '2022-01',
      isPresent: false,
      description: 'Developed full-stack applications using React and Node.js. Collaborated with product team to deliver features used by 100K+ users.',
      bullets: [
        'Built React applications serving 100K+ active users',
        'Implemented REST APIs with 99.9% uptime',
        'Collaborated with cross-functional teams on product features',
        'Optimized database queries improving response time by 60%'
      ]
    }
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      institution: 'Stanford University',
      location: 'Stanford, CA',
      startDate: '2016-09-01',
      endDate: '2020-06-15',
      gpa: '3.8',
      honors: 'Magna Cum Laude',
      relevantCourses: ['Data Structures', 'Algorithms', 'Software Engineering']
    }
  ],
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL',
    'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST APIs', 'Git'
  ],
  projects: [
    {
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce platform with payment integration',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      startDate: '2023-01',
      endDate: '2023-06',
      url: 'https://github.com/alexjohnson/ecommerce',
      highlights: [
        'Built responsive frontend with React and Tailwind CSS',
        'Implemented secure payment processing with Stripe',
        'Achieved 95% test coverage with Jest and Cypress'
      ]
    }
  ],
  certifications: [],
  languages: [],
  awards: [],
  publications: [],
  volunteerWork: [],
  customSections: []
};

export default function TemplatePreviewGenerator({
  templateId,
  data = SAMPLE_CV_DATA,
  className,
  scale = 0.3,
  mode = 'preview'
}: TemplatePreviewGeneratorProps) {
  const template = templateEngine.getTemplate(templateId);
  const TemplateComponent = getTemplateComponent(templateId);

  if (!template || !TemplateComponent) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg",
        className
      )}>
        <div className="text-center text-gray-500 p-4">
          <div className="text-lg mb-2">📄</div>
          <div className="text-sm">Template not found</div>
          <div className="text-xs text-gray-400">{templateId}</div>
        </div>
      </div>
    );
  }

  const templateProps: TemplateRenderProps = {
    config: template.config,
    data: data,
    mode: mode === 'thumbnail' ? 'preview' : mode as 'preview' | 'print' | 'export',
    scale: scale,
    className: "w-full h-full",
  };

  return (
    <div className={cn(
      "template-preview-container bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm",
      mode === 'thumbnail' && "cursor-pointer hover:shadow-md transition-shadow",
      className
    )}>
      <div 
        className="template-preview-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
      >
        <div className="template-content bg-white min-h-[297mm] w-[210mm] p-4">
          <TemplateComponent {...templateProps} />
        </div>
      </div>
      
      {mode === 'thumbnail' && (
        <div className="absolute inset-0 bg-transparent" />
      )}
    </div>
  );
}

// Hook for generating template previews
export function useTemplatePreview(templateId: string, customData?: CVData) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadTemplate = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const template = templateEngine.getTemplate(templateId);
        if (!template) {
          throw new Error(`Template not found: ${templateId}`);
        }
        
        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  return { isLoading, error };
}

// Utility function to capture template as image
export async function captureTemplateAsImage(
  templateId: string, 
  data: CVData = SAMPLE_CV_DATA,
  options: {
    width?: number;
    height?: number;
    scale?: number;
    format?: 'png' | 'jpeg';
    quality?: number;
  } = {}
): Promise<string | null> {
  const {
    width = 800,
    height = 1000,
    scale = 0.5,
    format = 'png',
    quality = 0.9
  } = options;

  try {
    // This would require html2canvas or similar library in a real implementation
    // For now, we'll return a placeholder
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw a simple preview representation
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(20, 20, width - 40, 60); // Header
    
    ctx.fillStyle = '#e5e7eb';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(20, 100 + i * 40, width - 40, 20);
    }

    return canvas.toDataURL(`image/${format}`, quality);
  } catch (error) {
    console.error('Failed to capture template as image:', error);
    return null;
  }
}