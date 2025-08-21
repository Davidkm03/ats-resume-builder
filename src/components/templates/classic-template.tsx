"use client";

import React from 'react';
import { CVData } from '@/types/cv';
import { TemplateRenderProps } from '@/types/template';
import BaseTemplate, { TemplateSection, TemplateExperienceItem } from './base-template';
import { cn } from '@/lib/utils';

export default function ClassicTemplate({ config, data, mode, scale, className }: TemplateRenderProps) {
  const cvData = data as CVData;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
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
    <BaseTemplate config={config} data={data} mode={mode} scale={scale} className={cn('classic-template', className)}>
      <div className="template-container">
        {/* Header Section */}
        <header className="header-section">
          <div className="header-content">
            <h1 className="name">{cvData.contact?.name || 'Your Name'}</h1>
            
            <div className="contact-info">
              <div className="contact-row">
                {cvData.contact?.email && (
                  <span className="contact-item">{cvData.contact.email}</span>
                )}
                {cvData.contact?.phone && (
                  <span className="contact-item">{cvData.contact.phone}</span>
                )}
              </div>
              <div className="contact-row">
                {cvData.contact?.location && (
                  <span className="contact-item">{cvData.contact.location}</span>
                )}
                {cvData.contact?.linkedin && (
                  <span className="contact-item">
                    <a href={cvData.contact.linkedin} className="contact-link">LinkedIn</a>
                  </span>
                )}
                {cvData.contact?.website && (
                  <span className="contact-item">
                    <a href={cvData.contact.website} className="contact-link">Website</a>
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="divider-line"></div>
        </header>

        <div className="content-container">
          {/* Professional Summary */}
          {cvData.summary && (
            <TemplateSection 
              title="Professional Summary" 
              config={config.sections.summary}
              className="summary-section"
            >
              <p className="summary-text">{cvData.summary}</p>
            </TemplateSection>
          )}

          {/* Professional Experience */}
          {cvData.experience && cvData.experience.length > 0 && (
            <TemplateSection 
              title="Professional Experience" 
              config={config.sections.experience}
              className="experience-section"
            >
              <div className="experience-list">
                {cvData.experience.map((exp, index) => (
                  <div key={exp.id || index} className="experience-entry">
                    <div className="experience-header">
                      <div className="position-info">
                        <h3 className="position-title">{exp.title}</h3>
                        <h4 className="company-name">{exp.company}</h4>
                      </div>
                      <div className="date-location">
                        <div className="dates">{formatDateRange(exp.startDate, exp.endDate, exp.isPresent)}</div>
                        <div className="location">{exp.location}</div>
                      </div>
                    </div>
                    
                    {exp.description && (
                      <p className="job-description">{exp.description}</p>
                    )}
                    
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="achievements-list">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                    
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="job-skills">
                        <span className="skills-label">Key Skills:</span> {exp.skills.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TemplateSection>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <TemplateSection 
              title="Education" 
              config={config.sections.education}
              className="education-section"
            >
              <div className="education-list">
                {cvData.education.map((edu, index) => (
                  <div key={edu.id || index} className="education-entry">
                    <div className="education-header">
                      <div className="degree-info">
                        <h3 className="degree-title">{edu.degree}</h3>
                        <h4 className="institution-name">{edu.institution}</h4>
                      </div>
                      <div className="education-details">
                        <div className="education-dates">{formatDateRange(edu.startDate, edu.endDate)}</div>
                        {edu.location && <div className="education-location">{edu.location}</div>}
                      </div>
                    </div>
                    
                    <div className="education-extras">
                      {edu.gpa && <span className="gpa">GPA: {edu.gpa}</span>}
                      {edu.honors && <span className="honors">{edu.honors}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </TemplateSection>
          )}

          {/* Skills */}
          {cvData.skills && cvData.skills.length > 0 && (
            <TemplateSection 
              title="Core Competencies" 
              config={config.sections.skills}
              className="skills-section"
            >
              <div className="skills-grid">
                {cvData.skills.map((skill, index) => (
                  <span key={index} className="skill-item">{skill}</span>
                ))}
              </div>
            </TemplateSection>
          )}

          {/* Projects */}
          {cvData.projects && cvData.projects.length > 0 && (
            <TemplateSection 
              title="Notable Projects" 
              config={config.sections.projects}
              className="projects-section"
            >
              <div className="projects-list">
                {cvData.projects.map((project, index) => (
                  <div key={project.id || index} className="project-entry">
                    <div className="project-header">
                      <h3 className="project-title">{project.name}</h3>
                      <div className="project-links">
                        {project.url && (
                          <a href={project.url} className="project-link">Demo</a>
                        )}
                        {project.github && (
                          <a href={project.github} className="project-link">Code</a>
                        )}
                      </div>
                    </div>
                    
                    <p className="project-description">{project.description}</p>
                    
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="project-tech">
                        <span className="tech-label">Technologies:</span> {project.technologies.join(', ')}
                      </div>
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
                  <div key={cert.id || index} className="certification-entry">
                    <span className="cert-name">{cert.name}</span>
                    <span className="cert-issuer">{cert.issuer}</span>
                    <span className="cert-date">{formatDate(cert.issueDate)}</span>
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
                  <div key={lang.id || index} className="language-entry">
                    <span className="language-name">{lang.name}</span>
                    <span className="language-level">({lang.proficiency})</span>
                  </div>
                ))}
              </div>
            </TemplateSection>
          )}
        </div>
      </div>

      <style jsx>{`
        .classic-template {
          font-family: var(--template-font-family);
          line-height: var(--template-line-height);
          color: var(--template-color-text);
        }

        .template-container {
          max-width: 100%;
          margin: 0 auto;
          background: var(--template-color-background);
        }

        .header-section {
          text-align: center;
          padding: calc(var(--template-spacing-padding) * 1.5);
          margin-bottom: var(--template-spacing-section);
        }

        .name {
          font-size: calc(var(--template-font-size-heading) * 1.2);
          font-weight: var(--template-font-weight-bold);
          color: var(--template-color-primary);
          margin-bottom: var(--template-spacing-element);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: calc(var(--template-spacing-element) * 0.5);
        }

        .contact-row {
          display: flex;
          gap: calc(var(--template-spacing-element) * 1.5);
          flex-wrap: wrap;
          justify-content: center;
        }

        .contact-item {
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
        }

        .contact-link {
          color: var(--template-color-primary);
          text-decoration: none;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .divider-line {
          height: 2px;
          background: var(--template-color-primary);
          margin: calc(var(--template-spacing-element) * 1.5) auto calc(var(--template-spacing-element) * 0.5) auto;
          width: 100px;
        }

        .content-container {
          padding: 0 var(--template-spacing-padding);
        }

        .summary-text {
          font-style: italic;
          text-align: justify;
          margin: 0;
          padding: var(--template-spacing-element);
          background: rgba(var(--template-color-primary), 0.05);
          border-left: 4px solid var(--template-color-primary);
        }

        .experience-list,
        .education-list,
        .projects-list {
          display: flex;
          flex-direction: column;
          gap: calc(var(--template-spacing-section) * 0.75);
        }

        .experience-entry,
        .education-entry,
        .project-entry {
          border-bottom: 1px solid var(--template-color-border, #e5e7eb);
          padding-bottom: var(--template-spacing-element);
        }

        .experience-entry:last-child,
        .education-entry:last-child,
        .project-entry:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .experience-header,
        .education-header,
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--template-spacing-element);
        }

        .position-title,
        .degree-title,
        .project-title {
          color: var(--template-color-primary);
          font-size: calc(var(--template-font-size-base) * 1.1);
          font-weight: var(--template-font-weight-bold);
          margin: 0 0 calc(var(--template-spacing-element) * 0.25) 0;
        }

        .company-name,
        .institution-name {
          color: var(--template-color-secondary, var(--template-color-text));
          font-weight: var(--template-font-weight-bold);
          margin: 0;
        }

        .date-location,
        .education-details {
          text-align: right;
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
        }

        .dates,
        .education-dates {
          font-weight: var(--template-font-weight-bold);
        }

        .location,
        .education-location {
          font-style: italic;
        }

        .job-description,
        .project-description {
          margin: var(--template-spacing-element) 0;
          font-style: italic;
          line-height: 1.6;
        }

        .achievements-list {
          margin: var(--template-spacing-element) 0;
          padding-left: 1.2em;
          list-style-type: disc;
        }

        .achievements-list li {
          margin-bottom: calc(var(--template-spacing-element) * 0.5);
          line-height: 1.5;
        }

        .job-skills,
        .project-tech {
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
          margin-top: var(--template-spacing-element);
        }

        .skills-label,
        .tech-label {
          font-weight: var(--template-font-weight-bold);
        }

        .education-extras {
          display: flex;
          gap: var(--template-spacing-element);
          font-size: var(--template-font-size-small);
          color: var(--template-color-secondary, var(--template-color-text));
        }

        .gpa,
        .honors {
          font-style: italic;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: calc(var(--template-spacing-element) * 0.75);
        }

        .skill-item {
          padding: calc(var(--template-spacing-element) * 0.5);
          border: 1px solid var(--template-color-border, #e5e7eb);
          text-align: center;
          font-weight: var(--template-font-weight-bold);
          background: rgba(var(--template-color-primary), 0.05);
        }

        .project-links {
          display: flex;
          gap: calc(var(--template-spacing-element) * 0.5);
        }

        .project-link {
          color: var(--template-color-primary);
          text-decoration: none;
          font-size: var(--template-font-size-small);
          font-weight: var(--template-font-weight-bold);
        }

        .project-link:hover {
          text-decoration: underline;
        }

        .certifications-list {
          display: grid;
          gap: calc(var(--template-spacing-element) * 0.5);
        }

        .certification-entry {
          display: grid;
          grid-template-columns: 2fr 1.5fr 1fr;
          gap: var(--template-spacing-element);
          align-items: center;
          padding: calc(var(--template-spacing-element) * 0.5);
          border: 1px solid var(--template-color-border, #e5e7eb);
        }

        .cert-name {
          font-weight: var(--template-font-weight-bold);
        }

        .cert-issuer {
          color: var(--template-color-secondary, var(--template-color-text));
        }

        .cert-date {
          font-size: var(--template-font-size-small);
          text-align: right;
        }

        .languages-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--template-spacing-element);
        }

        .language-entry {
          display: flex;
          justify-content: space-between;
          padding: calc(var(--template-spacing-element) * 0.5);
          border: 1px solid var(--template-color-border, #e5e7eb);
        }

        .language-name {
          font-weight: var(--template-font-weight-bold);
        }

        .language-level {
          color: var(--template-color-secondary, var(--template-color-text));
          font-size: var(--template-font-size-small);
          text-transform: capitalize;
        }

        @media (max-width: 768px) {
          .experience-header,
          .education-header,
          .project-header {
            flex-direction: column;
            gap: calc(var(--template-spacing-element) * 0.5);
          }

          .date-location,
          .education-details {
            text-align: left;
          }

          .contact-row {
            flex-direction: column;
            gap: calc(var(--template-spacing-element) * 0.5);
          }

          .skills-grid {
            grid-template-columns: 1fr;
          }

          .certification-entry {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .languages-list {
            grid-template-columns: 1fr;
          }
        }

        @media print {
          .classic-template {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .header-section {
            break-inside: avoid;
          }

          .experience-entry,
          .education-entry,
          .project-entry {
            break-inside: avoid;
            margin-bottom: var(--template-spacing-element);
          }
        }
      `}</style>
    </BaseTemplate>
  );
}