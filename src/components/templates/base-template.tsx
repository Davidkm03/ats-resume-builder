"use client";

import React, { useMemo } from 'react';
import { TemplateRenderProps } from '@/types/template';
import { CVData } from '@/types/cv';
import { templateEngine } from '@/lib/template-engine';
import { cn } from '@/lib/utils';

interface BaseTemplateProps extends TemplateRenderProps {
  children: React.ReactNode;
}

export default function BaseTemplate({ 
  config, 
  data, 
  mode, 
  scale = 1, 
  className, 
  children 
}: BaseTemplateProps) {
  // Generate CSS variables from template configuration
  const cssVariables = useMemo(() => 
    templateEngine.generateCSSVariables(config), 
    [config]
  );

  // Get base classes based on layout and mode
  const baseClasses = useMemo(() => {
    const classes = [
      'template-base',
      `template-layout-${config.layout.type}`,
      `template-mode-${mode}`,
      config.category && `template-category-${config.category}`,
    ].filter(Boolean);

    return classes.join(' ');
  }, [config.layout.type, config.category, mode]);

  // Generate responsive styles
  const responsiveStyles = useMemo(() => {
    if (mode === 'preview' && scale !== 1) {
      return {
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      };
    }
    return {};
  }, [mode, scale]);

  // Create inline styles for CSS variables to avoid styled-jsx issues
  const templateStyles = {
    ...cssVariables,
    ...responsiveStyles,
    fontFamily: 'var(--template-font-family)',
    fontSize: 'var(--template-font-size-base)',
    lineHeight: 'var(--template-line-height)',
    color: 'var(--template-color-text)',
    backgroundColor: 'var(--template-color-background)',
  } as React.CSSProperties;

  return (
    <div 
      className={cn(baseClasses, className)}
      style={templateStyles}
      data-template-id={config.id}
      data-template-version={config.version}
    >
      {children}
    </div>
  );
}

// Section wrapper component
interface TemplateSectionProps {
  title?: string;
  config: any;
  className?: string;
  children: React.ReactNode;
}

export function TemplateSection({ title, config, className, children }: TemplateSectionProps) {
  if (!config.enabled) {
    return null;
  }

  const sectionClasses = cn(
    'section',
    `section-style-${config.style}`,
    config.columns && config.columns > 1 && `section-columns-${config.columns}`,
    className
  );

  const sectionStyle = {
    order: config.order,
    marginBottom: 'var(--template-spacing-section)',
  };

  const titleStyle = config.style === 'highlighted' ? {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: 'calc(var(--template-spacing-element) * 0.5) var(--template-spacing-element)',
    marginLeft: 'calc(var(--template-spacing-margin) * -0.5)',
    marginRight: 'calc(var(--template-spacing-margin) * -0.5)',
  } : config.style === 'minimal' ? {
    fontSize: 'var(--template-font-size-base)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: 'var(--template-font-weight-normal)',
    color: 'var(--color-secondary)',
  } : {};

  const contentStyle = config.columns && config.columns > 1 ? {
    display: 'grid',
    gridTemplateColumns: config.columns === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
    gap: 'var(--template-spacing-element)',
  } : {};

  const containerStyle = config.style === 'bordered' ? {
    border: 'var(--template-border-width) var(--template-border-style) var(--color-border)',
    borderRadius: 'var(--template-border-radius)',
    padding: 'var(--template-spacing-padding)',
  } : {};

  return (
    <section className={sectionClasses} style={{ ...sectionStyle, ...containerStyle }}>
      {title && (
        <h2 className="section-title" style={titleStyle}>
          {config.title || title}
        </h2>
      )}
      <div className="section-content" style={contentStyle}>
        {children}
      </div>
    </section>
  );
}

// Contact info component
interface TemplateContactProps {
  contact: CVData['contact'];
  config: any;
}

export function TemplateContact({ contact, config }: TemplateContactProps) {
  if (!contact) return null;

  const contactNameStyle = {
    color: 'var(--color-primary)',
    marginBottom: 'var(--template-spacing-element)',
  };

  const contactDetailsStyle = {
    marginBottom: 'var(--template-spacing-element)',
  };

  const contactItemStyle = {
    display: 'flex',
    gap: 'calc(var(--template-spacing-element) * 0.5)',
    marginBottom: 'calc(var(--template-spacing-element) * 0.25)',
  };

  const contactLabelStyle = {
    fontWeight: 'var(--template-font-weight-bold)',
    minWidth: '80px',
  };

  const contactLinksStyle = {
    display: 'flex',
    gap: 'var(--template-spacing-element)',
    flexWrap: 'wrap' as const,
  };

  const contactLinkStyle = {
    color: 'var(--color-accent)',
    textDecoration: 'none',
    fontWeight: 'var(--template-font-weight-bold)',
  };

  return (
    <TemplateSection title="Contact" config={config} className="contact-section">
      <div className="contact-info">
        <h1 className="contact-name" style={contactNameStyle}>{contact.name}</h1>
        
        <div className="contact-details" style={contactDetailsStyle}>
          {contact.email && (
            <div className="contact-item" style={contactItemStyle}>
              <span className="contact-label" style={contactLabelStyle}>Email:</span>
              <span className="contact-value">{contact.email}</span>
            </div>
          )}
          
          {contact.phone && (
            <div className="contact-item" style={contactItemStyle}>
              <span className="contact-label" style={contactLabelStyle}>Phone:</span>
              <span className="contact-value">{contact.phone}</span>
            </div>
          )}
          
          {contact.location && (
            <div className="contact-item" style={contactItemStyle}>
              <span className="contact-label" style={contactLabelStyle}>Location:</span>
              <span className="contact-value">{contact.location}</span>
            </div>
          )}
        </div>
        
        {(contact.website || contact.linkedin || contact.github) && (
          <div className="contact-links" style={contactLinksStyle}>
            {contact.website && (
              <a href={contact.website} className="contact-link" style={contactLinkStyle}>
                Website
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} className="contact-link" style={contactLinkStyle}>
                LinkedIn
              </a>
            )}
            {contact.github && (
              <a href={contact.github} className="contact-link" style={contactLinkStyle}>
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </TemplateSection>
  );
}

// Experience item component
interface TemplateExperienceItemProps {
  experience: CVData['experience'][0];
  config: any;
}

export function TemplateExperienceItem({ experience, config }: TemplateExperienceItemProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    } catch {
      return dateString;
    }
  };

  const dateRange = experience.isPresent 
    ? `${formatDate(experience.startDate)} - Present`
    : `${formatDate(experience.startDate)} - ${formatDate(experience.endDate)}`;

  const itemStyle = {
    marginBottom: 'var(--template-spacing-section)',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--template-spacing-element)',
  };

  const titleStyle = {
    color: 'var(--color-primary)',
    fontSize: 'calc(var(--template-font-size-base) * 1.1)',
    marginBottom: 'calc(var(--template-spacing-element) * 0.25)',
    margin: 0,
  };

  const companyStyle = {
    color: 'var(--color-secondary)',
    fontWeight: 'var(--template-font-weight-bold)',
    marginBottom: 'calc(var(--template-spacing-element) * 0.25)',
    margin: 0,
  };

  const locationStyle = {
    color: 'var(--color-text)',
    fontSize: 'var(--template-font-size-small)',
    margin: 0,
  };

  const datesStyle = {
    color: 'var(--color-secondary)',
    fontSize: 'var(--template-font-size-small)',
    textAlign: 'right' as const,
    whiteSpace: 'nowrap' as const,
  };

  const descriptionStyle = {
    fontStyle: 'italic' as const,
    marginBottom: 'var(--template-spacing-element)',
  };

  const bulletsStyle = {
    margin: 'var(--template-spacing-element) 0',
    paddingLeft: '1.5em',
  };

  const skillsStyle = {
    fontSize: 'var(--template-font-size-small)',
    color: 'var(--color-secondary)',
    marginTop: 'var(--template-spacing-element)',
  };

  return (
    <div className="experience-item" style={itemStyle}>
      <div className="experience-header" style={headerStyle}>
        <div className="experience-main">
          <h3 className="experience-title" style={titleStyle}>{experience.title}</h3>
          <h4 className="experience-company" style={companyStyle}>{experience.company}</h4>
          <p className="experience-location" style={locationStyle}>{experience.location}</p>
        </div>
        <div className="experience-dates" style={datesStyle}>
          {dateRange}
        </div>
      </div>
      
      {experience.description && (
        <p className="experience-description" style={descriptionStyle}>{experience.description}</p>
      )}
      
      {experience.bullets && experience.bullets.length > 0 && (
        <ul className="experience-bullets" style={bulletsStyle}>
          {experience.bullets.map((bullet, index) => (
            <li key={index} style={{ marginBottom: 'calc(var(--template-spacing-element) * 0.5)' }}>
              {bullet}
            </li>
          ))}
        </ul>
      )}
      
      {experience.skills && experience.skills.length > 0 && (
        <div className="experience-skills" style={skillsStyle}>
          <strong>Skills:</strong> {experience.skills.join(', ')}
        </div>
      )}
    </div>
  );
}