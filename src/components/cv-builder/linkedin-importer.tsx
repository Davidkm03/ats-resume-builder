"use client";

import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, RefreshCw, Download, User, Briefcase } from 'lucide-react';
import { Button, useToast } from '@/components/ui';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { CVData, Experience, Education, ContactInfo } from '@/types/cv';

interface LinkedInData {
  profile: {
    firstName: string;
    lastName: string;
    headline: string;
    summary: string;
    location: string;
    emailAddress: string;
    phoneNumbers?: string[];
    publicProfileUrl: string;
  };
  positions: Array<{
    title: string;
    companyName: string;
    location: string;
    startDate: { month: number; year: number };
    endDate?: { month: number; year: number };
    isCurrent: boolean;
    description: string;
    summary: string;
  }>;
  educations: Array<{
    schoolName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: { year: number };
    endDate?: { year: number };
    grade?: string;
    activities?: string;
  }>;
  skills: Array<{
    name: string;
    endorsementCount?: number;
  }>;
}

interface ImportStatus {
  status: 'idle' | 'uploading' | 'parsing' | 'success' | 'error';
  message?: string;
  progress?: number;
}

export default function LinkedInImporter() {
  const { updateCVData } = useCVBuilderStore();
  const { success } = useToast();
  const [importStatus, setImportStatus] = useState<ImportStatus>({ status: 'idle' });
  const [importedData, setImportedData] = useState<LinkedInData | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>(['profile', 'experience', 'education', 'skills']);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportStatus({ status: 'uploading', message: 'Uploading LinkedIn data...', progress: 10 });

    try {
      // Simulate file upload and parsing
      await new Promise(resolve => setTimeout(resolve, 1000));
      setImportStatus({ status: 'parsing', message: 'Parsing LinkedIn profile...', progress: 50 });

      const fileContent = await readFileContent(file);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const parsedData = await parseLinkedInData(fileContent);
      setImportedData(parsedData);
      
      setImportStatus({ 
        status: 'success', 
        message: 'LinkedIn data imported successfully!', 
        progress: 100 
      });

    } catch (error) {
      console.error('Import error:', error);
      setImportStatus({ 
        status: 'error', 
        message: 'Failed to import LinkedIn data. Please check the file format.' 
      });
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const parseLinkedInData = async (content: string): Promise<LinkedInData> => {
    // Mock LinkedIn data parsing - in real implementation, parse actual LinkedIn export
    const mockData: LinkedInData = {
      profile: {
        firstName: "John",
        lastName: "Doe",
        headline: "Senior Software Engineer | Full Stack Developer",
        summary: "Experienced software engineer with 8+ years in full-stack development. Passionate about creating scalable web applications and leading development teams. Expertise in React, Node.js, and cloud technologies.",
        location: "San Francisco, CA",
        emailAddress: "john.doe@email.com",
        phoneNumbers: ["+1 (555) 123-4567"],
        publicProfileUrl: "https://linkedin.com/in/johndoe"
      },
      positions: [
        {
          title: "Senior Software Engineer",
          companyName: "Tech Corp",
          location: "San Francisco, CA",
          startDate: { month: 3, year: 2020 },
          endDate: undefined,
          isCurrent: true,
          description: "Lead development of scalable web applications",
          summary: "• Led a team of 5 developers in building microservices architecture\n• Improved application performance by 40% through optimization\n• Implemented CI/CD pipelines reducing deployment time by 60%"
        },
        {
          title: "Software Engineer",
          companyName: "StartupXYZ",
          location: "Palo Alto, CA",
          startDate: { month: 6, year: 2018 },
          endDate: { month: 2, year: 2020 },
          isCurrent: false,
          description: "Full-stack development and system design",
          summary: "• Developed RESTful APIs serving 100k+ daily requests\n• Built responsive web applications using React and TypeScript\n• Collaborated with product team to define technical requirements"
        }
      ],
      educations: [
        {
          schoolName: "University of California, Berkeley",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          startDate: { year: 2014 },
          endDate: { year: 2018 },
          grade: "3.8 GPA",
          activities: "Computer Science Club, Hackathon Winner"
        }
      ],
      skills: [
        { name: "JavaScript", endorsementCount: 45 },
        { name: "React", endorsementCount: 38 },
        { name: "Node.js", endorsementCount: 32 },
        { name: "Python", endorsementCount: 28 },
        { name: "AWS", endorsementCount: 25 },
        { name: "TypeScript", endorsementCount: 22 },
        { name: "Docker", endorsementCount: 18 },
        { name: "PostgreSQL", endorsementCount: 15 }
      ]
    };

    return mockData;
  };

  const convertToCV = (linkedInData: LinkedInData): Partial<CVData> => {
    const cvData: Partial<CVData> = {};

    // Convert contact information
    if (selectedSections.includes('profile')) {
      cvData.contact = {
        name: `${linkedInData.profile.firstName} ${linkedInData.profile.lastName}`,
        email: linkedInData.profile.emailAddress,
        phone: linkedInData.profile.phoneNumbers?.[0] || '',
        location: linkedInData.profile.location,
        linkedin: linkedInData.profile.publicProfileUrl
      } as ContactInfo;

      cvData.summary = linkedInData.profile.summary;
    }

    // Convert work experience
    if (selectedSections.includes('experience')) {
      cvData.experience = linkedInData.positions.map((pos, index) => ({
        id: `linkedin-exp-${index}`,
        title: pos.title,
        company: pos.companyName,
        location: pos.location,
        startDate: `${pos.startDate.year}-${pos.startDate.month.toString().padStart(2, '0')}`,
        endDate: pos.endDate ? `${pos.endDate.year}-${pos.endDate.month.toString().padStart(2, '0')}` : undefined,
        isPresent: pos.isCurrent,
        description: pos.description,
        bullets: pos.summary.split('\n').filter(bullet => bullet.trim().startsWith('•')).map(bullet => bullet.trim().substring(1).trim())
      })) as Experience[];
    }

    // Convert education
    if (selectedSections.includes('education')) {
      cvData.education = linkedInData.educations.map((edu, index) => ({
        id: `linkedin-edu-${index}`,
        degree: `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}`,
        institution: edu.schoolName,
        startDate: `${edu.startDate.year}-01`,
        endDate: edu.endDate ? `${edu.endDate.year}-12` : undefined,
        gpa: edu.grade,
        honors: edu.activities
      })) as Education[];
    }

    // Convert skills
    if (selectedSections.includes('skills')) {
      cvData.skills = linkedInData.skills
        .sort((a, b) => (b.endorsementCount || 0) - (a.endorsementCount || 0))
        .slice(0, 15) // Limit to top 15 skills
        .map(skill => skill.name);
    }

    return cvData;
  };

  const handleImportToCV = () => {
    if (!importedData) return;

    const cvData = convertToCV(importedData);
    
    // Update CV data in store
    Object.entries(cvData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateCVData({ [key]: value });
      }
    });

    // Reset import state
    setImportStatus({ status: 'idle' });
    setImportedData(null);
    
    success('LinkedIn data imported successfully!', 'Your professional information has been added to your CV.');
  };

  const handleSectionToggle = (section: string) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const resetImport = () => {
    setImportStatus({ status: 'idle' });
    setImportedData(null);
    setSelectedSections(['profile', 'experience', 'education', 'skills']);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            LinkedIn Import
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Import your professional data from LinkedIn export
          </p>
        </div>
      </div>

      {importStatus.status === 'idle' && !importedData && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Upload LinkedIn Data
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Upload your LinkedIn data export file (JSON or CSV format)
            </p>
            <input
              type="file"
              accept=".json,.csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="linkedin-upload"
            />
            <label htmlFor="linkedin-upload">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </div>
            </label>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-3">
              📋 How to Export LinkedIn Data
            </h4>
            <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-2 list-decimal list-inside">
              <li>Go to LinkedIn Settings & Privacy</li>
              <li>Click on "Data Privacy" in the left menu</li>
              <li>Select "Get a copy of your data"</li>
              <li>Choose the data you want to export</li>
              <li>Request your archive and wait for the email</li>
              <li>Download and upload the file here</li>
            </ol>
          </div>
        </div>
      )}

      {/* Loading States */}
      {(importStatus.status === 'uploading' || importStatus.status === 'parsing') && (
        <div className="text-center py-8">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {importStatus.message}
          </h4>
          {importStatus.progress && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-md mx-auto">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${importStatus.progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Error State */}
      {importStatus.status === 'error' && (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Import Failed
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {importStatus.message}
          </p>
          <Button onClick={resetImport} variant="secondary">
            Try Again
          </Button>
        </div>
      )}

      {/* Success State with Data Preview */}
      {importStatus.status === 'success' && importedData && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">LinkedIn data imported successfully!</span>
          </div>

          {/* Section Selection */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Select sections to import:
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'profile', label: 'Profile & Contact', icon: <User className="w-4 h-4" /> },
                { id: 'experience', label: 'Work Experience', icon: <Briefcase className="w-4 h-4" /> },
                { id: 'education', label: 'Education', icon: <FileText className="w-4 h-4" /> },
                { id: 'skills', label: 'Skills', icon: <CheckCircle className="w-4 h-4" /> }
              ].map(section => (
                <label
                  key={section.id}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSections.includes(section.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section.id)}
                    onChange={() => handleSectionToggle(section.id)}
                    className="sr-only"
                  />
                  {section.icon}
                  <span className="text-sm font-medium">{section.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Data Preview */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Preview of imported data:
            </h4>
            <div className="space-y-3 text-sm">
              {selectedSections.includes('profile') && (
                <div>
                  <span className="font-medium text-blue-600">Profile: </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {importedData.profile.firstName} {importedData.profile.lastName} - {importedData.profile.headline}
                  </span>
                </div>
              )}
              {selectedSections.includes('experience') && (
                <div>
                  <span className="font-medium text-green-600">Experience: </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {importedData.positions.length} position{importedData.positions.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {selectedSections.includes('education') && (
                <div>
                  <span className="font-medium text-purple-600">Education: </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {importedData.educations.length} education record{importedData.educations.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {selectedSections.includes('skills') && (
                <div>
                  <span className="font-medium text-orange-600">Skills: </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {importedData.skills.slice(0, 5).map(s => s.name).join(', ')}
                    {importedData.skills.length > 5 && ` +${importedData.skills.length - 5} more`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleImportToCV}
              disabled={selectedSections.length === 0}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Import to CV
            </Button>
            <Button onClick={resetImport} variant="secondary">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2">
          💡 Import Tips
        </h4>
        <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
          <li>• LinkedIn exports may take up to 24 hours to generate</li>
          <li>• Imported data will be merged with your existing CV data</li>
          <li>• You can edit all imported information after import</li>
          <li>• Skills are imported based on endorsement count</li>
        </ul>
      </div>
    </div>
  );
}
