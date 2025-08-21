"use client";

import { useState } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Download, 
  User, 
  Briefcase,
  ExternalLink,
  Info,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Button, LinkButton } from '@/components/ui';
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

export default function LinkedInImportPage() {
  const { user, isLoading } = useRequireAuth();
  const { updateContact, updateExperience, updateEducation, updateSkills, updateSummary, cvData } = useCVBuilderStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<ImportStatus>({ status: 'idle' });
  const [parsedData, setParsedData] = useState<LinkedInData | null>(null);
  const [importedItems, setImportedItems] = useState<{
    contact: boolean;
    experience: number;
    education: number;
    skills: number;
  }>({ contact: false, experience: 0, education: 0, skills: 0 });

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportStatus({ status: 'idle' });
      setParsedData(null);
    }
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.name.endsWith('.csv') || file.type === 'application/pdf')) {
      setSelectedFile(file);
      setImportStatus({ status: 'idle' });
      setParsedData(null);
    } else {
      setImportStatus({
        status: 'error',
        message: 'Por favor, sube un archivo JSON, CSV o PDF válido'
      });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const parseLinkedInData = async (file: File): Promise<LinkedInData> => {
    try {
      // Create FormData to send file to API
      const formData = new FormData();
      formData.append('file', file);

      // Call our API endpoint
      const response = await fetch('/api/ai/parse-cv', {
        method: 'POST',
        body: formData,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`API endpoint not available (${response.status}). Please ensure the server is running properly.`);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `API Error: ${response.status}`);
      }

      // Transform the API response to match our LinkedInData interface
      const apiData = result.data;
      const linkedInData: LinkedInData = {
        profile: {
          firstName: apiData.profile.firstName || 'N/A',
          lastName: apiData.profile.lastName || 'N/A',
          headline: apiData.profile.headline || 'Professional',
          summary: apiData.profile.summary || '',
          location: apiData.profile.location || '',
          emailAddress: apiData.profile.emailAddress || '',
          phoneNumbers: apiData.profile.phoneNumbers || [],
          publicProfileUrl: apiData.profile.publicProfileUrl || ''
        },
        positions: apiData.positions.map((pos: any) => ({
          title: pos.title || '',
          companyName: pos.companyName || '',
          location: pos.location || '',
          startDate: pos.startDate || { month: 1, year: new Date().getFullYear() },
          endDate: pos.endDate || null,
          isCurrent: pos.isCurrent || false,
          description: pos.description || '',
          summary: pos.summary || pos.description || ''
        })),
        educations: apiData.educations.map((edu: any) => ({
          schoolName: edu.schoolName || '',
          degree: edu.degree || '',
          fieldOfStudy: edu.fieldOfStudy || '',
          startDate: edu.startDate || { year: new Date().getFullYear() },
          endDate: edu.endDate || null,
          grade: edu.grade || null,
          activities: edu.activities || null
        })),
        skills: apiData.skills.map((skill: any) => ({
          name: skill.name || '',
          endorsementCount: skill.endorsementCount || null
        }))
      };

      return linkedInData;
    } catch (error) {
      console.error('Error parsing LinkedIn data:', error);
      throw new Error(error instanceof Error ? error.message : 'Error al parsear el archivo');
    }
  };

  const saveImportedDataToCVBuilder = (data: LinkedInData) => {
    // Update contact information
    updateContact({
      name: `${data.profile.firstName} ${data.profile.lastName}`,
      email: data.profile.emailAddress,
      phone: data.profile.phoneNumbers?.[0] || '',
      location: data.profile.location,
      linkedin: data.profile.publicProfileUrl,
    });

    // Update summary
    if (data.profile.summary) {
      updateSummary(data.profile.summary);
    }

    // Convert and merge experiences with existing ones
    const newExperiences = data.positions.map(position => ({
      id: `imported-${Date.now()}-${Math.random()}`,
      title: position.title,
      company: position.companyName,
      location: position.location,
      startDate: `${position.startDate.year}-${position.startDate.month.toString().padStart(2, '0')}-01`,
      endDate: position.endDate ? `${position.endDate.year}-${position.endDate.month.toString().padStart(2, '0')}-01` : undefined,
      isPresent: position.isCurrent,
      description: position.description,
      bullets: position.summary ? position.summary.split('\n').filter(line => line.trim()) : []
    }));
    
    // Merge with existing experiences
    const currentExperiences = cvData.experience || [];
    updateExperience([...currentExperiences, ...newExperiences]);

    // Convert and merge education with existing ones
    const newEducation = data.educations.map(education => ({
      id: `imported-${Date.now()}-${Math.random()}`,
      degree: education.degree,
      institution: education.schoolName,
      location: education.fieldOfStudy, // Use fieldOfStudy as a secondary info
      startDate: `${education.startDate.year}-01-01`,
      endDate: education.endDate ? `${education.endDate.year}-12-31` : undefined,
      gpa: education.grade || undefined,
      honors: education.activities || undefined,
      relevantCourses: []
    }));

    // Merge with existing education
    const currentEducation = cvData.education || [];
    updateEducation([...currentEducation, ...newEducation]);

    // Convert and merge skills
    const newSkills = data.skills.map(skill => skill.name);
    const currentSkills = cvData.skills || [];
    const allSkills = [...currentSkills, ...newSkills];
    // Remove duplicates
    const uniqueSkills = Array.from(new Set(allSkills));
    updateSkills(uniqueSkills);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setImportStatus({ status: 'uploading', progress: 10 });

    try {
      // Simulate upload progress
      await new Promise(resolve => setTimeout(resolve, 500));
      setImportStatus({ status: 'parsing', progress: 50 });

      const linkedInData = await parseLinkedInData(selectedFile);
      setParsedData(linkedInData);

      // Save to CV builder store
      saveImportedDataToCVBuilder(linkedInData);

      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Count imported items
      const imported = {
        contact: true,
        experience: linkedInData.positions.length,
        education: linkedInData.educations.length,
        skills: linkedInData.skills.length
      };
      setImportedItems(imported);

      setImportStatus({ 
        status: 'success', 
        progress: 100,
        message: `✅ Importación exitosa: ${imported.experience} experiencias, ${imported.education} educaciones, ${imported.skills} habilidades guardadas en tu CV`
      });

    } catch (error) {
      setImportStatus({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Error durante la importación'
      });
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportStatus({ status: 'idle' });
    setParsedData(null);
    setImportedItems({ contact: false, experience: 0, education: 0, skills: 0 });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Importar CV o datos de LinkedIn</h1>
                    <p className="text-sm text-gray-500">
                      Importa tu información profesional desde LinkedIn o sube tu CV en PDF para acelerar la creación
                    </p>
                  </div>
                </div>
                <div className="ml-auto hidden md:block">
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600">¡Ahorra tiempo!</div>
                    <div className="text-xs text-gray-500">Importa en segundos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Instructions & Upload */}
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-4">
                  📄 Opciones de importación
                </h3>
                
                {/* LinkedIn Export Instructions */}
                <div className="mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">📋 Exportar datos de LinkedIn</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside ml-4">
                    <li>Ve a <strong>Configuración y privacidad</strong> de LinkedIn</li>
                    <li>Haz clic en <strong>"Privacidad de datos"</strong> en el menú izquierdo</li>
                    <li>Selecciona <strong>"Obtener una copia de tus datos"</strong></li>
                    <li>Elige los datos que quieres exportar</li>
                    <li>Solicita tu archivo y espera el email de confirmación</li>
                    <li>Descarga y sube el archivo aquí</li>
                  </ol>
                </div>

                {/* PDF Upload Instructions */}
                <div className="mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">📎 Subir CV en PDF</h4>
                  <p className="text-sm text-blue-800 ml-4">
                    También puedes subir tu CV actual en formato PDF y nuestro sistema extraerá automáticamente 
                    la información para crear un nuevo CV optimizado.
                  </p>
                </div>

                <div className="p-3 bg-blue-100 rounded-md">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                    <div className="text-xs text-blue-700">
                      <p><strong>LinkedIn Export:</strong> Pueden tardar hasta 24 horas en generarse.</p>
                      <p><strong>PDF:</strong> Procesamiento inmediato con IA.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Access to LinkedIn */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Acceso rápido a LinkedIn</h3>
                <div className="space-y-3">
                  <a
                    href="https://www.linkedin.com/psettings/member-data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <ExternalLink className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">Exportar datos de LinkedIn</div>
                        <div className="text-sm text-gray-500">Ir directamente a la página de exportación</div>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </a>
                </div>
              </div>

              {/* Upload Area */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Subir archivo de LinkedIn o CV en PDF</h3>
                  <p className="text-sm text-gray-500">Formatos aceptados: JSON, CSV, PDF</p>
                </div>
                <div className="p-6">
                  <div
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                  >
                    <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <div>
                      <p className="text-lg text-gray-600 mb-2">
                        Arrastra tu archivo aquí o{' '}
                        <label className="text-blue-600 hover:text-blue-500 font-medium cursor-pointer">
                          selecciona un archivo
                          <input
                            type="file"
                            accept=".json,.csv,.pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </p>
                      <p className="text-sm text-gray-500">JSON, CSV o PDF • Máximo 50MB</p>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-green-600 mr-3" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-green-800">{selectedFile.name}</span>
                          <p className="text-xs text-green-600">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  )}

                  {/* Import Status */}
                  {importStatus.status !== 'idle' && (
                    <div className="mt-4">
                      {importStatus.status === 'uploading' && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center">
                            <RefreshCw className="h-5 w-5 text-blue-600 mr-3 animate-spin" />
                            <div className="flex-1">
                              <p className="text-sm text-blue-800">Subiendo archivo...</p>
                              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${importStatus.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {importStatus.status === 'parsing' && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center">
                            <RefreshCw className="h-5 w-5 text-yellow-600 mr-3 animate-spin" />
                            <div className="flex-1">
                              <p className="text-sm text-yellow-800">
                                {selectedFile?.type === 'application/pdf' 
                                  ? 'Extrayendo texto del PDF con IA...' 
                                  : 'Procesando datos de LinkedIn...'
                                }
                              </p>
                              <div className="mt-2 w-full bg-yellow-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${importStatus.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {importStatus.status === 'success' && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                            <div className="flex-1">
                              <p className="text-sm text-green-800 font-medium">¡Importación exitosa!</p>
                              <p className="text-sm text-green-700">{importStatus.message}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {importStatus.status === 'error' && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                            <div className="flex-1">
                              <p className="text-sm text-red-800 font-medium">Error en la importación</p>
                              <p className="text-sm text-red-700">{importStatus.message}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={handleImport}
                      disabled={!selectedFile || importStatus.status === 'uploading' || importStatus.status === 'parsing'}
                      className="flex-1"
                    >
                      {importStatus.status === 'uploading' || importStatus.status === 'parsing' ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Importar datos
                        </>
                      )}
                    </Button>
                    {(selectedFile || importStatus.status !== 'idle') && (
                      <Button
                        onClick={resetImport}
                        variant="secondary"
                      >
                        Reiniciar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview/Results */}
            <div className="space-y-6">
              {parsedData ? (
                <>
                  {/* Import Summary */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Resumen de importación</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-900">1</div>
                          <div className="text-sm text-blue-600">Perfil</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-900">{importedItems.experience}</div>
                          <div className="text-sm text-green-600">Experiencias</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-900">{importedItems.education}</div>
                          <div className="text-sm text-purple-600">Educación</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                          <CheckCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-yellow-900">{importedItems.skills}</div>
                          <div className="text-sm text-yellow-600">Habilidades</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Preview */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Vista previa de datos</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Información de contacto</h4>
                        <div className="p-3 bg-gray-50 rounded-lg text-sm">
                          <p><strong>{parsedData.profile.firstName} {parsedData.profile.lastName}</strong></p>
                          <p className="text-gray-600">{parsedData.profile.headline}</p>
                          <p className="text-gray-600">{parsedData.profile.emailAddress}</p>
                          <p className="text-gray-600">{parsedData.profile.location}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Experiencia más reciente</h4>
                        {parsedData.positions.slice(0, 2).map((position, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm mb-2">
                            <p><strong>{position.title}</strong></p>
                            <p className="text-gray-600">{position.companyName}</p>
                            <p className="text-gray-500 text-xs">
                              {position.startDate.month}/{position.startDate.year} - {position.isCurrent ? 'Presente' : `${position.endDate?.month}/${position.endDate?.year}`}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Habilidades principales</h4>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.skills.slice(0, 8).map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">¡Datos importados exitosamente!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Tus datos de LinkedIn han sido procesados. Ahora puedes crear un CV profesional con esta información.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <LinkButton
                        href="/dashboard/cvs/builder"
                        className="flex items-center justify-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear CV con estos datos
                      </LinkButton>
                      <LinkButton
                        href="/dashboard/cvs"
                        variant="secondary"
                        className="flex items-center justify-center"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Ver mis CVs
                      </LinkButton>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-12 text-center">
                    <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Importa tus datos profesionales</h3>
                    <p className="text-gray-500 mb-6">
                      Sube tu archivo de LinkedIn o tu CV en PDF para acelerar la creación de tu nuevo CV
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Download className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-blue-900">Importación rápida</div>
                        <div className="text-xs text-blue-600">LinkedIn + PDF</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-green-900">IA integrada</div>
                        <div className="text-xs text-green-600">Extracción inteligente</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-medium text-yellow-900 mb-3">💡 Consejos de importación</h4>
                <ul className="text-sm text-yellow-800 space-y-2">
                  <li>• <strong>LinkedIn JSON/CSV:</strong> Las exportaciones pueden tardar hasta 24 horas en generarse</li>
                  <li>• <strong>PDF:</strong> Funciona mejor con CVs con formato claro y texto seleccionable</li>
                  <li>• Los datos importados se combinarán con tu información existente</li>
                  <li>• Puedes editar toda la información después de la importación</li>
                  <li>• Para mejores resultados con PDF, asegúrate de que el texto sea legible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}