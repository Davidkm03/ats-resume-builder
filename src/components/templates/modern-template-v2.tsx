"use client";

import React from 'react';
import { CVData } from '@/types/cv';
import { TemplateRenderProps } from '@/types/template';
import BaseTemplate, { TemplateSection, TemplateContact, TemplateExperienceItem } from './base-template';
import { cn } from '@/lib/utils';

export default function ModernTemplateV2({ config, data, mode, scale, className }: TemplateRenderProps) {
  const cvData = data as CVData;

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

  const formatDateRange = (startDate?: string, endDate?: string, isPresent?: boolean) => {
    const start = formatDate(startDate);
    if (isPresent) return `${start} - Present`;
    const end = formatDate(endDate);
    return end ? `${start} - ${end}` : start;
  };

  return (
    <BaseTemplate config={config} data={data} mode={mode} scale={scale} className={cn('modern-template-v2', className)}>
      <div className="template-container">
        {/* Header Section with Gradient */}
        <header className="header-section">
          <div className="header-content">
            <h1 className="name">{cvData.contact?.name || 'Your Name'}</h1>
            
            {cvData.summary && (
              <p className="summary">{cvData.summary}</p>
            )}
            
            <div className="contact-info">
              {cvData.contact?.email && (
                <div className="contact-item">
                  <svg className="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>{cvData.contact.email}</span>
                </div>
              )}
              
              {cvData.contact?.phone && (
                <div className="contact-item">
                  <svg className="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{cvData.contact.phone}</span>
                </div>
              )}
              
              {cvData.contact?.location && (
                <div className="contact-item">
                  <svg className="contact-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{cvData.contact.location}</span>
                </div>
              )}
            </div>
            
            {/* Professional Links */}
            {(cvData.contact?.linkedin || cvData.contact?.github || cvData.contact?.website) && (
              <div className="professional-links">
                {cvData.contact.linkedin && (
                  <a href={cvData.contact.linkedin} className="professional-link">
                    LinkedIn
                  </a>
                )}
                {cvData.contact.github && (
                  <a href={cvData.contact.github} className="professional-link">
                    GitHub
                  </a>
                )}
                {cvData.contact.website && (
                  <a href={cvData.contact.website} className="professional-link">
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="content-grid">
          {/* Main Content */}
          <main className="main-content">
            {/* Experience Section */}
            {cvData.experience && cvData.experience.length > 0 && (
              <TemplateSection 
                title="Professional Experience" 
                config={config.sections.experience}
                className="experience-section"
              >
                <div className="timeline">
                  {cvData.experience.map((exp, index) => (
                    <div key={exp.id || index} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <TemplateExperienceItem experience={exp} config={config.sections.experience} />
                      </div>
                    </div>
                  ))}
                </div>
              </TemplateSection>
            )}

            {/* Projects Section */}
            {cvData.projects && cvData.projects.length > 0 && (
              <TemplateSection 
                title="Projects" 
                config={config.sections.projects}
                className="projects-section"
              >
                <div className="projects-grid">
                  {cvData.projects.map((project, index) => (
                    <div key={project.id || index} className="project-card">
                      <div className="project-header">
                        <h3 className="project-name">{project.name}</h3>
                        <div className="project-links">
                          {project.url && (
                            <a href={project.url} className="project-link">Live</a>
                          )}
                          {project.github && (
                            <a href={project.github} className="project-link">Code</a>
                          )}
                        </div>
                      </div>
                      
                      <p className="project-description">{project.description}</p>
                      
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="project-technologies">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="tech-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {project.highlights && project.highlights.length > 0 && (
                        <ul className="project-highlights">
                          {project.highlights.map((highlight, highlightIndex) => (
                            <li key={highlightIndex}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </TemplateSection>
            )}
          </main>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* Skills Section */}
            {cvData.skills && cvData.skills.length > 0 && (
              <TemplateSection 
                title="Skills" 
                config={config.sections.skills}
                className="skills-section"
              >
                <div className="skills-cloud">
                  {cvData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </TemplateSection>
            )}

            {/* Education Section */}
            {cvData.education && cvData.education.length > 0 && (
              <TemplateSection 
                title="Education" 
                config={config.sections.education}
                className="education-section"
              >
                <div className="education-list">
                  {cvData.education.map((edu, index) => (
                    <div key={edu.id || index} className="education-item">
                      <h4 className="education-degree">{edu.degree}</h4>
                      <p className="education-institution">{edu.institution}</p>
                      {edu.location && (
                        <p className="education-location">{edu.location}</p>
                      )}
                      <p className="education-dates">
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </p>
                      {edu.gpa && (
                        <p className="education-gpa">GPA: {edu.gpa}</p>
                      )}
                      {edu.honors && (
                        <p className="education-honors">{edu.honors}</p>
                      )}
                    </div>
                  ))}
                </div>
              </TemplateSection>
            )}

            {/* Certifications */}
            {cvData.certifications && cvData.certifications.length > 0 && (
              <TemplateSection 
                title="Certifications" 
                config={config.sections.certifications}
                className="certifications-section"
              >
                <div className="certifications-list">
                  {cvData.certifications.map((cert, index) => (
                    <div key={cert.id || index} className="certification-item">
                      <h4 className="certification-name">{cert.name}</h4>
                      <p className="certification-issuer">{cert.issuer}</p>
                      <p className="certification-date">{formatDate(cert.issueDate)}</p>
                    </div>
                  ))}
                </div>
              </TemplateSection>
            )}

            {/* Languages */}
            {cvData.languages && cvData.languages.length > 0 && (
              <TemplateSection 
                title="Languages" 
                config={config.sections.languages}
                className="languages-section"
              >
                <div className="languages-list">
                  {cvData.languages.map((lang, index) => (
                    <div key={lang.id || index} className="language-item">
                      <span className="language-name">{lang.name}</span>
                      <span className="language-level">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </TemplateSection>
            )}
          </aside>
        </div>
      </div>

      <style jsx>{`
        .modern-template-v2 {
          font-family: var(--template-font-family);
          line-height: var(--template-line-height);
          color: var(--template-color-text);
        }

        .template-container {
          max-width: 100%;
          margin: 0 auto;
        }

        .header-section {
          background: linear-gradient(135deg, var(--template-color-primary) 0%, var(--template-color-accent, var(--template-color-primary)) 100%);
          color: white;
          padding: calc(var(--template-spacing-padding) * 2);
          margin-bottom: var(--template-spacing-section);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .name {
          font-size: calc(var(--template-font-size-heading) * 1.5);
          font-weight: var(--template-font-weight-bold);
          margin-bottom: var(--template-spacing-element);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .summary {
          font-size: calc(var(--template-font-size-base) * 1.1);
          line-height: 1.6;
          margin-bottom: calc(var(--template-spacing-element) * 1.5);
          opacity: 0.95;
        }

        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: var(--template-spacing-element);
          margin-bottom: var(--template-spacing-element);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: calc(var(--template-spacing-element) * 0.5);
          font-size: var(--template-font-size-small);
        }

        .contact-icon {
          width: 16px;
          height: 16px;
          opacity: 0.8;
        }

        .professional-links {
          display: flex;
          gap: var(--template-spacing-element);
          flex-wrap: wrap;
        }

        .professional-link {
          color: white;
          text-decoration: none;
          font-weight: var(--template-font-weight-bold);
          padding: calc(var(--template-spacing-element) * 0.25) calc(var(--template-spacing-element) * 0.5);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--template-border-radius);
          transition: all 0.2s ease;
        }

        .professional-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: calc(var(--template-spacing-section) * 1.5);
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--template-spacing-padding);
        }

        .main-content {
          min-width: 0;
        }

        .sidebar {
          min-width: 0;
        }

        .timeline {
          position: relative;
          padding-left: calc(var(--template-spacing-element) * 2);
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--template-color-primary);
          opacity: 0.3;
        }

        .timeline-item {
          position: relative;
          margin-bottom: calc(var(--template-spacing-section) * 1.5);
        }

        .timeline-marker {
          position: absolute;
          left: calc(var(--template-spacing-element) * -2 + 4px);
          top: 8px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--template-color-primary);
          border: 3px solid var(--template-color-background);
          box-shadow: 0 0 0 2px var(--template-color-primary);
        }

        .timeline-content {
          background: var(--template-color-background);
          border: 1px solid var(--template-color-border, #e5e7eb);
          border-radius: var(--template-border-radius);
          padding: var(--template-spacing-padding);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .projects-grid {
          display: grid;
          gap: var(--template-spacing-element);
        }

        .project-card {
          background: var(--template-color-background);
          border: 1px solid var(--template-color-border, #e5e7eb);
          border-radius: var(--template-border-radius);
          padding: var(--template-spacing-padding);
          transition: all 0.2s ease;
        }

        .project-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-color: var(--template-color-primary);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--template-spacing-element);
        }

        .project-name {
          color: var(--template-color-primary);
          font-size: calc(var(--template-font-size-base) * 1.1);
          font-weight: var(--template-font-weight-bold);
          margin: 0;
        }

        .project-links {
          display: flex;
          gap: calc(var(--template-spacing-element) * 0.5);
        }

        .project-link {
          color: var(--template-color-accent, var(--template-color-primary));
          text-decoration: none;
          font-size: var(--template-font-size-small);
          font-weight: var(--template-font-weight-bold);
        }

        .project-link:hover {
          text-decoration: underline;
        }

        .project-description {
          margin-bottom: var(--template-spacing-element);
          line-height: 1.6;
        }

        .project-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: calc(var(--template-spacing-element) * 0.5);
          margin-bottom: var(--template-spacing-element);
        }

        .tech-tag {
          background: var(--template-color-primary);
          color: white;
          padding: calc(var(--template-spacing-element) * 0.25) calc(var(--template-spacing-element) * 0.5);
          border-radius: calc(var(--template-border-radius) * 2);
          font-size: var(--template-font-size-small);
          font-weight: var(--template-font-weight-bold);
        }

        .project-highlights {
          margin: 0;
          padding-left: 1.5em;
        }

        .project-highlights li {
          margin-bottom: calc(var(--template-spacing-element) * 0.5);
          font-size: var(--template-font-size-small);
        }

        .skills-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: calc(var(--template-spacing-element) * 0.5);
        }

        .skill-tag {
          background: linear-gradient(45deg, var(--template-color-primary), var(--template-color-accent, var(--template-color-primary)));
          color: white;
          padding: calc(var(--template-spacing-element) * 0.5) calc(var(--template-spacing-element) * 0.75);
          border-radius: calc(var(--template-border-radius) * 4);
          font-size: var(--template-font-size-small);
          font-weight: var(--template-font-weight-bold);
          text-align: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .education-list,
        .certifications-list,
        .languages-list {
          display: flex;
          flex-direction: column;
          gap: var(--template-spacing-element);
        }

        .education-item,
        .certification-item {
          padding: var(--template-spacing-padding);
          border: 1px solid var(--template-color-border, #e5e7eb);
          border-radius: var(--template-border-radius);
          background: var(--template-color-background);
        }

        .education-degree,
        .certification-name {
          color: var(--template-color-primary);
          font-weight: var(--template-font-weight-bold);
          margin: 0 0 calc(var(--template-spacing-element) * 0.5) 0;
        }

        .education-institution,
        .certification-issuer {
          color: var(--template-color-secondary, var(--template-color-text));
          font-weight: var(--template-font-weight-bold);
          margin: 0 0 calc(var(--template-spacing-element) * 0.25) 0;
        }

        .education-location,
        .education-dates,
        .education-gpa,
        .education-honors,
        .certification-date {
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
          margin: 0 0 calc(var(--template-spacing-element) * 0.25) 0;
        }

        .language-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: calc(var(--template-spacing-element) * 0.5);
          border-bottom: 1px solid var(--template-color-border, #e5e7eb);
        }

        .language-name {
          font-weight: var(--template-font-weight-bold);
        }

        .language-level {
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: var(--template-spacing-section);
            padding: 0 var(--template-spacing-padding);
          }

          .contact-info {
            flex-direction: column;
            gap: calc(var(--template-spacing-element) * 0.5);
          }

          .header-section {
            padding: var(--template-spacing-padding);
          }

          .name {
            font-size: calc(var(--template-font-size-heading) * 1.2);
          }

          .timeline {
            padding-left: var(--template-spacing-element);
          }

          .timeline::before {
            left: 4px;
          }

          .timeline-marker {
            left: calc(var(--template-spacing-element) * -0.5);
            width: 8px;
            height: 8px;
          }
        }

        @media print {
          .modern-template-v2 {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .header-section {
            break-inside: avoid;
          }

          .timeline-item {
            break-inside: avoid;
            margin-bottom: var(--template-spacing-section);
          }

          .project-card {
            break-inside: avoid;
            margin-bottom: var(--template-spacing-element);
          }
        }
      `}</style>
    </BaseTemplate>
  );
}