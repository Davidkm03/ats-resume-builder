"use client";

import { useState } from 'react';
import { Download, FileText, File, Share2, Mail, Link2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, useToast } from '@/components/ui';
import { useCVBuilderStore } from '@/stores/cv-builder';

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  format: 'pdf' | 'docx' | 'txt' | 'json';
  premium?: boolean;
}

interface ExportStatus {
  status: 'idle' | 'exporting' | 'success' | 'error';
  message?: string;
  downloadUrl?: string;
}

export default function ExportManager() {
  const { cvData } = useCVBuilderStore();
  const { success } = useToast();
  const [exportStatus, setExportStatus] = useState<Record<string, ExportStatus>>({});
  const [activeTab, setActiveTab] = useState<'export' | 'share'>('export');

  const exportOptions: ExportOption[] = [
    {
      id: 'pdf-standard',
      name: 'PDF (Standard)',
      description: 'Professional PDF format, ATS-friendly',
      icon: <FileText className="w-5 h-5" />,
      format: 'pdf'
    },
    {
      id: 'pdf-premium',
      name: 'PDF (Premium)',
      description: 'Enhanced PDF with custom styling',
      icon: <FileText className="w-5 h-5" />,
      format: 'pdf',
      premium: true
    },
    {
      id: 'docx',
      name: 'Word Document',
      description: 'Editable Microsoft Word format',
      icon: <File className="w-5 h-5" />,
      format: 'docx'
    },
    {
      id: 'txt',
      name: 'Plain Text',
      description: 'Simple text format for ATS systems',
      icon: <FileText className="w-5 h-5" />,
      format: 'txt'
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Raw data for developers',
      icon: <File className="w-5 h-5" />,
      format: 'json'
    }
  ];

  const handleExport = async (option: ExportOption) => {
    setExportStatus(prev => ({
      ...prev,
      [option.id]: { status: 'exporting' }
    }));

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (option.format) {
        case 'pdf':
          content = await generatePDF(option.id === 'pdf-premium');
          filename = `${cvData.contact?.name || 'CV'}.pdf`;
          mimeType = 'application/pdf';
          break;
        case 'docx':
          content = await generateDOCX();
          filename = `${cvData.contact?.name || 'CV'}.docx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'txt':
          content = generatePlainText();
          filename = `${cvData.contact?.name || 'CV'}.txt`;
          mimeType = 'text/plain';
          break;
        case 'json':
          content = JSON.stringify(cvData, null, 2);
          filename = `${cvData.contact?.name || 'CV'}-data.json`;
          mimeType = 'application/json';
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Create download link
      const blob = new Blob([content], { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);

      setExportStatus(prev => ({
        ...prev,
        [option.id]: {
          status: 'success',
          message: 'Export completed successfully',
          downloadUrl
        }
      }));

      // Auto-download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up URL after download
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
        setExportStatus(prev => ({
          ...prev,
          [option.id]: { status: 'idle' }
        }));
      }, 5000);

    } catch (error) {
      console.error('Export error:', error);
      setExportStatus(prev => ({
        ...prev,
        [option.id]: {
          status: 'error',
          message: 'Export failed. Please try again.'
        }
      }));

      // Reset status after error
      setTimeout(() => {
        setExportStatus(prev => ({
          ...prev,
          [option.id]: { status: 'idle' }
        }));
      }, 3000);
    }
  };

  const generatePDF = async (premium: boolean = false): Promise<string> => {
    // Mock PDF generation - in real implementation, use libraries like jsPDF or Puppeteer
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(${cvData.contact?.name || 'Your Name'}) Tj
0 -20 Td
(${cvData.contact?.email || 'your.email@example.com'}) Tj
0 -20 Td
(${cvData.contact?.phone || '+1 (555) 123-4567'}) Tj
0 -40 Td
(PROFESSIONAL SUMMARY) Tj
0 -20 Td
(${cvData.summary || 'Professional summary goes here...'}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000526 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`;

    return pdfContent;
  };

  const generateDOCX = async (): Promise<string> => {
    // Mock DOCX generation - in real implementation, use libraries like docx or mammoth
    const docxContent = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>${cvData.contact?.name || 'Your Name'}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${cvData.contact?.email || 'your.email@example.com'}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${cvData.contact?.phone || '+1 (555) 123-4567'}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
        </w:rPr>
        <w:t>PROFESSIONAL SUMMARY</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>${cvData.summary || 'Professional summary goes here...'}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;

    return docxContent;
  };

  const generatePlainText = (): string => {
    const sections: string[] = [];

    // Contact Information
    if (cvData.contact) {
      sections.push(`${cvData.contact.name || 'Your Name'}`);
      if (cvData.contact.email) sections.push(`Email: ${cvData.contact.email}`);
      if (cvData.contact.phone) sections.push(`Phone: ${cvData.contact.phone}`);
      if (cvData.contact.location) sections.push(`Location: ${cvData.contact.location}`);
      if (cvData.contact.linkedin) sections.push(`LinkedIn: ${cvData.contact.linkedin}`);
      sections.push('');
    }

    // Professional Summary
    if (cvData.summary) {
      sections.push('PROFESSIONAL SUMMARY');
      sections.push('-'.repeat(20));
      sections.push(cvData.summary);
      sections.push('');
    }

    // Work Experience
    if (cvData.experience && cvData.experience.length > 0) {
      sections.push('WORK EXPERIENCE');
      sections.push('-'.repeat(15));
      cvData.experience.forEach(exp => {
        sections.push(`${exp.title} at ${exp.company}`);
        sections.push(`${exp.startDate} - ${exp.endDate || 'Present'}`);
        if (exp.location) sections.push(`Location: ${exp.location}`);
        if (exp.bullets && exp.bullets.length > 0) {
          exp.bullets.forEach(bullet => sections.push(`• ${bullet}`));
        }
        sections.push('');
      });
    }

    // Education
    if (cvData.education && cvData.education.length > 0) {
      sections.push('EDUCATION');
      sections.push('-'.repeat(9));
      cvData.education.forEach(edu => {
        sections.push(`${edu.degree}`);
        sections.push(`${edu.institution}`);
        sections.push(`${edu.startDate} - ${edu.endDate || 'Present'}`);
        if (edu.gpa) sections.push(`GPA: ${edu.gpa}`);
        sections.push('');
      });
    }

    // Skills
    if (cvData.skills && cvData.skills.length > 0) {
      sections.push('SKILLS');
      sections.push('-'.repeat(6));
      sections.push(cvData.skills.join(', '));
      sections.push('');
    }

    return sections.join('\n');
  };

  const handleShare = async (method: 'email' | 'link') => {
    if (method === 'email') {
      const subject = encodeURIComponent(`CV - ${cvData.contact?.name || 'Professional Resume'}`);
      const body = encodeURIComponent(`Please find my CV attached.\n\nBest regards,\n${cvData.contact?.name || 'Your Name'}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    } else if (method === 'link') {
      // Generate shareable link (mock implementation)
      const shareUrl = `${window.location.origin}/cv/share/${Date.now()}`;
      await navigator.clipboard.writeText(shareUrl);
      success('Shareable link copied!', 'The link has been copied to your clipboard.');
    }
  };

  const getStatusIcon = (status: ExportStatus) => {
    switch (status.status) {
      case 'exporting':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-green-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Export & Share
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Download your CV in multiple formats or share it online
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg mb-6">
        {[
          { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
          { id: 'share', label: 'Share', icon: <Share2 className="w-4 h-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exportOptions.map((option) => {
              const status = exportStatus[option.id] || { status: 'idle' };
              
              return (
                <div
                  key={option.id}
                  className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-300 dark:hover:border-green-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        {option.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          {option.name}
                          {option.premium && (
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                              Premium
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(status)}
                  </div>

                  {status.message && (
                    <div className={`text-sm mb-3 ${
                      status.status === 'error' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {status.message}
                    </div>
                  )}

                  <Button
                    onClick={() => handleExport(option)}
                    disabled={status.status === 'exporting' || (option.premium && false)} // Mock premium check
                    className="w-full"
                    variant={option.premium ? 'secondary' : 'primary'}
                  >
                    {status.status === 'exporting' ? (
                      'Exporting...'
                    ) : option.premium ? (
                      'Upgrade to Export'
                    ) : (
                      `Export ${option.format.toUpperCase()}`
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
              📄 Export Tips
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• PDF format is recommended for most job applications</li>
              <li>• Plain text format works best with ATS systems</li>
              <li>• Word format allows for easy editing by recruiters</li>
              <li>• JSON format is useful for developers and data backup</li>
            </ul>
          </div>
        </div>
      )}

      {/* Share Tab */}
      {activeTab === 'share' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Email CV
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Open email client with CV ready to send
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleShare('email')}
                className="w-full"
                variant="secondary"
              >
                <Mail className="w-4 h-4 mr-2" />
                Compose Email
              </Button>
            </div>

            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Link2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Shareable Link
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Generate a link to share your CV online
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleShare('link')}
                className="w-full"
                variant="secondary"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900 dark:text-purple-200 mb-2">
              🔗 Sharing Options
            </h4>
            <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1">
              <li>• Email sharing opens your default email client</li>
              <li>• Shareable links are valid for 30 days</li>
              <li>• Links can be password protected (Premium feature)</li>
              <li>• Track who views your CV with analytics (Premium feature)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
