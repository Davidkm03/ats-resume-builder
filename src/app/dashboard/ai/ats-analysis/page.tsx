"use client";

import { useState, useRef } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Cpu,
  ArrowLeft,
  Upload,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  FileText,
  Plus,
  Download
} from 'lucide-react';
import { Button, LinkButton } from '@/components/ui';

interface ATSAnalysisResult {
  overallScore: number;
  scores: {
    keywordOptimization: number;
    formatting: number;
    contentQuality: number;
    atsCompatibility: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    criticalIssues: string[];
  };
  keywordAnalysis: {
    matched: string[];
    missing: string[];
    density: Record<string, number>;
  };
  suggestions: string[];
}

export default function ATSAnalysisPage() {
  const { user, isLoading } = useRequireAuth();
  const [cvContent, setCvContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [industry, setIndustry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setError(null);
      
      // In a real app, you would extract text from PDF here
      // For now, we'll simulate this
      setCvContent(`[PDF Content from: ${file.name}]\n\nJohn Smith\nSoftware Engineer\nEmail: john@example.com\nPhone: (555) 123-4567\n\nEXPERIENCE\nSenior Software Engineer | TechCorp | 2020-Present\n• Developed scalable web applications using React and Node.js\n• Led team of 5 developers on microservices architecture\n• Improved system performance by 40% through optimization\n\nSKILLS\nJavaScript, React, Node.js, Python, AWS, Docker, PostgreSQL`);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setError(null);
      setCvContent(`[PDF Content from: ${file.name}]\n\nSample extracted content...`);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!cvContent.trim()) {
      setError('Please enter your CV content');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/analyze-ats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvContent: cvContent.trim(),
          jobDescription: jobDescription.trim() || undefined,
          targetKeywords: targetKeywords.trim() ? 
            targetKeywords.split(',').map(k => k.trim()).filter(k => k) : undefined,
          industry: industry.trim() || undefined,
          planType: user.subscriptionTier?.toUpperCase() || 'FREE',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze CV');
      }

      setResult(data.data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center">
                <LinkButton
                  href="/dashboard/ai"
                  variant="secondary"
                  size="sm"
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to AI Dashboard
                </LinkButton>
                <Cpu className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Validador de CV con IA</h1>
                  <p className="text-sm text-gray-500">
                    Sube tu CV y recibe recomendaciones inteligentes para mejorarlo y optimizarlo para ATS
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Validador Inteligente de CV</h3>
                  <p className="text-sm text-gray-500">Sube tu CV o pega el contenido para recibir análisis y recomendaciones personalizadas</p>
                </div>
                <div className="p-6 space-y-6">
                  {/* Input Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ¿Cómo quieres analizar tu CV? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setInputMethod('file')}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          inputMethod === 'file'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <Upload className="h-5 w-5 mb-2" />
                        <div className="font-medium">Subir PDF</div>
                        <div className="text-sm text-gray-500">Sube tu CV en formato PDF</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMethod('text')}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          inputMethod === 'text'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <FileText className="h-5 w-5 mb-2" />
                        <div className="font-medium">Pegar Texto</div>
                        <div className="text-sm text-gray-500">Copia y pega el contenido</div>
                      </button>
                    </div>
                  </div>

                  {/* File Upload */}
                  {inputMethod === 'file' && (
                    <div>
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                      >
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">
                            Arrastra tu CV aquí o{' '}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                              selecciona un archivo
                            </button>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Solo archivos PDF</p>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                      {uploadedFile && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-sm text-green-800">{uploadedFile.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Input */}
                  {inputMethod === 'text' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido del CV *
                      </label>
                      <textarea
                        value={cvContent}
                        onChange={(e) => setCvContent(e.target.value)}
                        placeholder="Pega aquí el contenido completo de tu CV...

Ejemplo:
Juan Pérez
Ingeniero de Software
Email: juan@email.com
Teléfono: (555) 123-4567

RESUMEN
Ingeniero de software experimentado con 5+ años en desarrollo web...

EXPERIENCIA
Ingeniero Senior | TechCorp | 2020-Presente
• Desarrollé aplicaciones React que sirven a 100k+ usuarios
• Lideré equipo de 4 desarrolladores en arquitectura de microservicios
• Mejoré el rendimiento del sistema en un 40%

HABILIDADES
JavaScript, React, Node.js, AWS, Python..."
                        rows={12}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        {cvContent.length} caracteres
                      </div>
                    </div>
                  )}

                  {/* Optional Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Job Description (Optional)
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description you're targeting for better keyword analysis..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Keywords (Optional)
                      </label>
                      <input
                        type="text"
                        value={targetKeywords}
                        onChange={(e) => setTargetKeywords(e.target.value)}
                        placeholder="React, JavaScript, AWS, etc."
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="mt-1 text-xs text-gray-500">Separate with commas</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry (Optional)
                      </label>
                      <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="e.g. Technology, Finance"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex">
                        <Info className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                          <p className="text-sm text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !cvContent.trim()}
                    className="w-full flex items-center justify-center"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing ATS Compatibility...
                      </>
                    ) : (
                      <>
                        <Cpu className="h-4 w-4 mr-2" />
                        Analyze ATS Compatibility
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-3">💡 ATS Optimization Tips</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Use standard section headers (Experience, Education, Skills)</li>
                  <li>• Include relevant keywords from the job description</li>
                  <li>• Use simple formatting without complex layouts</li>
                  <li>• Spell out acronyms (e.g., "Search Engine Optimization (SEO)")</li>
                  <li>• Save as .docx or .pdf formats</li>
                </ul>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Overall Score */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Overall ATS Score</h3>
                    </div>
                    <div className="p-6">
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                          {result.overallScore}
                        </div>
                        <div className="text-xl text-gray-600 mt-2">out of 100</div>
                        <div className="mt-4">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                            result.overallScore >= 80 ? 'bg-green-100 text-green-800' :
                            result.overallScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {result.overallScore >= 80 ? 'Excellent ATS Compatibility' :
                             result.overallScore >= 60 ? 'Good ATS Compatibility' : 'Needs Improvement'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Detailed Analysis</h3>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      {Object.entries(result.scores).map(([category, score]) => (
                        <div key={category}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize font-medium">
                              {category.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={getScoreColor(score)}>{score}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getScoreBgColor(score)}`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keyword Analysis */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Keyword Analysis</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Matched Keywords */}
                      {result.keywordAnalysis.matched.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Matched Keywords ({result.keywordAnalysis.matched.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.keywordAnalysis.matched.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missing Keywords */}
                      {result.keywordAnalysis.missing.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                            <XCircle className="h-4 w-4 mr-1" />
                            Missing Keywords ({result.keywordAnalysis.missing.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {result.keywordAnalysis.missing.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Detailed Feedback</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Strengths */}
                      {result.feedback.strengths.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Strengths
                          </h4>
                          <ul className="space-y-2">
                            {result.feedback.strengths.map((strength, index) => (
                              <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 h-2 w-2 bg-green-600 rounded-full mt-2 mr-3"></span>
                                <span className="text-gray-700">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {result.feedback.improvements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-yellow-700 mb-3 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-2">
                            {result.feedback.improvements.map((improvement, index) => (
                              <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 h-2 w-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                                <span className="text-gray-700">{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Critical Issues */}
                      {result.feedback.criticalIssues.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                            <XCircle className="h-4 w-4 mr-1" />
                            Critical Issues
                          </h4>
                          <ul className="space-y-2">
                            {result.feedback.criticalIssues.map((issue, index) => (
                              <li key={index} className="flex items-start">
                                <span className="flex-shrink-0 h-2 w-2 bg-red-600 rounded-full mt-2 mr-3"></span>
                                <span className="text-gray-700">{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Optimization Suggestions */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Optimization Suggestions</h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CV Builder Invitation */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm">
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600">
                            <Plus className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            ¿Quieres mejorar tu CV automáticamente?
                          </h3>
                          <p className="mt-2 text-sm text-gray-600">
                            Basándose en el análisis, nuestro constructor de CV puede ayudarte a crear un CV optimizado para ATS 
                            que incorpore las mejores prácticas y palabras clave recomendadas.
                          </p>
                          
                          {result.overallScore < 80 && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <div className="flex">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                                <div>
                                  <p className="text-sm text-yellow-800">
                                    <strong>Tu puntuación actual es {result.overallScore}/100.</strong> 
                                    {' '}Con nuestro constructor, podrías mejorar significativamente tu puntuación ATS.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex space-x-3">
                            <LinkButton
                              href="/dashboard/cv-builder"
                              className="inline-flex items-center"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Crear CV Optimizado
                            </LinkButton>
                            <LinkButton
                              href="/dashboard/templates"
                              variant="secondary"
                              className="inline-flex items-center"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Ver Plantillas
                            </LinkButton>
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            💡 <strong>Opcional:</strong> Solo si quieres mejorar tu CV. El análisis ya está completo.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-12 text-center">
                    <Cpu className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Analysis Yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Paste your CV content and click "Analyze" to get ATS compatibility insights
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}