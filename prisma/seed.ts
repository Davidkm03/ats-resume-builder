import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default templates
  const templates = [
    // Free templates
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean and contemporary design perfect for tech and creative roles',
      previewUrl: '/templates/modern-preview.png',
      isPremium: false,
      category: 'general',
      config: {
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#0ea5e9'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        },
        layout: {
          columns: 1,
          spacing: 'normal',
          headerStyle: 'centered'
        }
      }
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional professional layout ideal for corporate and finance roles',
      previewUrl: '/templates/classic-preview.png',
      isPremium: false,
      category: 'corporate',
      config: {
        colors: {
          primary: '#1f2937',
          secondary: '#6b7280',
          accent: '#374151'
        },
        fonts: {
          heading: 'Times New Roman',
          body: 'Times New Roman'
        },
        layout: {
          columns: 1,
          spacing: 'compact',
          headerStyle: 'left-aligned'
        }
      }
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple and elegant design that focuses on content over decoration',
      previewUrl: '/templates/minimal-preview.png',
      isPremium: false,
      category: 'general',
      config: {
        colors: {
          primary: '#000000',
          secondary: '#666666',
          accent: '#333333'
        },
        fonts: {
          heading: 'Helvetica',
          body: 'Helvetica'
        },
        layout: {
          columns: 1,
          spacing: 'wide',
          headerStyle: 'minimal'
        }
      }
    },
    // Premium templates
    {
      id: 'executive',
      name: 'Executive',
      description: 'Sophisticated design for senior-level positions and C-suite roles',
      previewUrl: '/templates/executive-preview.png',
      isPremium: true,
      category: 'executive',
      config: {
        colors: {
          primary: '#1e40af',
          secondary: '#475569',
          accent: '#dc2626'
        },
        fonts: {
          heading: 'Playfair Display',
          body: 'Source Sans Pro'
        },
        layout: {
          columns: 2,
          spacing: 'normal',
          headerStyle: 'executive'
        }
      }
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and artistic design perfect for designers and creative professionals',
      previewUrl: '/templates/creative-preview.png',
      isPremium: true,
      category: 'creative',
      config: {
        colors: {
          primary: '#7c3aed',
          secondary: '#a855f7',
          accent: '#ec4899'
        },
        fonts: {
          heading: 'Montserrat',
          body: 'Open Sans'
        },
        layout: {
          columns: 2,
          spacing: 'creative',
          headerStyle: 'artistic'
        }
      }
    },
    {
      id: 'tech',
      name: 'Tech Professional',
      description: 'Modern technical design optimized for software engineers and developers',
      previewUrl: '/templates/tech-preview.png',
      isPremium: true,
      category: 'technology',
      config: {
        colors: {
          primary: '#059669',
          secondary: '#047857',
          accent: '#10b981'
        },
        fonts: {
          heading: 'JetBrains Mono',
          body: 'Inter'
        },
        layout: {
          columns: 2,
          spacing: 'compact',
          headerStyle: 'tech'
        }
      }
    },
    {
      id: 'academic',
      name: 'Academic',
      description: 'Scholarly design perfect for researchers and academic positions',
      previewUrl: '/templates/academic-preview.png',
      isPremium: true,
      category: 'academic',
      config: {
        colors: {
          primary: '#1f2937',
          secondary: '#4b5563',
          accent: '#6366f1'
        },
        fonts: {
          heading: 'Crimson Text',
          body: 'Crimson Text'
        },
        layout: {
          columns: 1,
          spacing: 'academic',
          headerStyle: 'formal'
        }
      }
    },
    {
      id: 'healthcare',
      name: 'Healthcare Professional',
      description: 'Clean medical design for healthcare and medical professionals',
      previewUrl: '/templates/healthcare-preview.png',
      isPremium: true,
      category: 'healthcare',
      config: {
        colors: {
          primary: '#0369a1',
          secondary: '#0284c7',
          accent: '#dc2626'
        },
        fonts: {
          heading: 'Lato',
          body: 'Lato'
        },
        layout: {
          columns: 1,
          spacing: 'normal',
          headerStyle: 'professional'
        }
      }
    },
    {
      id: 'finance',
      name: 'Finance Professional',
      description: 'Conservative and trustworthy design for banking and finance roles',
      previewUrl: '/templates/finance-preview.png',
      isPremium: true,
      category: 'finance',
      config: {
        colors: {
          primary: '#1e3a8a',
          secondary: '#1e40af',
          accent: '#059669'
        },
        fonts: {
          heading: 'Georgia',
          body: 'Georgia'
        },
        layout: {
          columns: 1,
          spacing: 'compact',
          headerStyle: 'conservative'
        }
      }
    },
    {
      id: 'marketing',
      name: 'Marketing Professional',
      description: 'Dynamic and engaging design for marketing and sales professionals',
      previewUrl: '/templates/marketing-preview.png',
      isPremium: true,
      category: 'marketing',
      config: {
        colors: {
          primary: '#ea580c',
          secondary: '#f97316',
          accent: '#eab308'
        },
        fonts: {
          heading: 'Poppins',
          body: 'Nunito Sans'
        },
        layout: {
          columns: 2,
          spacing: 'dynamic',
          headerStyle: 'bold'
        }
      }
    },
    {
      id: 'consulting',
      name: 'Consulting Professional',
      description: 'Strategic and analytical design for consulting and business roles',
      previewUrl: '/templates/consulting-preview.png',
      isPremium: true,
      category: 'consulting',
      config: {
        colors: {
          primary: '#374151',
          secondary: '#4b5563',
          accent: '#0ea5e9'
        },
        fonts: {
          heading: 'Source Sans Pro',
          body: 'Source Sans Pro'
        },
        layout: {
          columns: 2,
          spacing: 'strategic',
          headerStyle: 'analytical'
        }
      }
    },
    {
      id: 'startup',
      name: 'Startup Professional',
      description: 'Innovative and agile design for startup and entrepreneurial roles',
      previewUrl: '/templates/startup-preview.png',
      isPremium: true,
      category: 'startup',
      config: {
        colors: {
          primary: '#7c2d12',
          secondary: '#ea580c',
          accent: '#16a34a'
        },
        fonts: {
          heading: 'Space Grotesk',
          body: 'Inter'
        },
        layout: {
          columns: 2,
          spacing: 'innovative',
          headerStyle: 'startup'
        }
      }
    }
  ];

  console.log('📝 Creating templates...');
  
  for (const template of templates) {
    await prisma.template.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
    console.log(`✅ Created template: ${template.name}`);
  }

  console.log('🎉 Database seed completed successfully!');
  console.log(`📊 Created ${templates.length} templates (${templates.filter(t => !t.isPremium).length} free, ${templates.filter(t => t.isPremium).length} premium)`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });