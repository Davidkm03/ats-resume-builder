"use client";

import { useState, useRef } from 'react';
import { useRequireAuth } from '@/hooks/use-auth';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  Shield,
  Upload,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  FileText,
  Plus,
  Download,
  Sparkles,
  Target
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

export default function CVValidatorPage() {
  const { user, isLoading } = useRequireAuth();
  const [cvContent, setCvContent] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [industry, setIndustry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('file'); // Default to file upload
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
      setCvContent(`[PDF Content from: ${file.name}]

Juan Pérez
Ingeniero de Software Senior
Email: juan.perez@email.com
Teléfono: +34 123 456 789
LinkedIn: linkedin.com/in/juanperez

RESUMEN PROFESIONAL
Ingeniero de software con más de 5 años de experiencia en desarrollo web full-stack, especializado en React, Node.js y arquitecturas cloud. Experiencia liderando equipos de desarrollo y implementando soluciones escalables que sirven a más de 100,000 usuarios activos.

EXPERIENCIA PROFESIONAL
Ingeniero de Software Senior | TechCorp | Enero 2020 - Presente
• Desarrollé y mantuve aplicaciones web utilizando React, TypeScript y Node.js
• Lideré un equipo de 5 desarrolladores en la migración de arquitectura monolítica a microservicios
• Implementé CI/CD pipelines que redujeron el tiempo de deployment en un 60%
• Optimicé la performance de la aplicación principal, mejorando la velocidad de carga en un 40%

Desarrollador Full Stack | StartupXYZ | Junio 2018 - Diciembre 2019
• Construí desde cero una plataforma de e-commerce usando React y PostgreSQL
• Integré pasarelas de pago (Stripe, PayPal) manejando transacciones por valor de €2M+
• Colaboré con equipos de diseño y producto para implementar nuevas funcionalidades
• Mantuve una cobertura de testing del 85% usando Jest y Cypress

EDUCACIÓN
Ingeniero en Informática | Universidad Politécnica de Madrid | 2014-2018
Mención de Honor - Proyecto Final: Sistema de recomendaciones con Machine Learning

HABILIDADES TÉCNICAS
• Lenguajes: JavaScript, TypeScript, Python, Java, SQL
• Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
• Backend: Node.js, Express, Django, Spring Boot
• Bases de datos: PostgreSQL, MongoDB, Redis
• Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
• Herramientas: Git, Jenkins, Jira, Figma

CERTIFICACIONES
• AWS Certified Developer Associate (2022)
• React Developer Certification - Meta (2021)

IDIOMAS
• Español: Nativo
• Inglés: Avanzado (C1)
• Francés: Intermedio (B2)`);
    } else {
      setError('Por favor, sube un archivo PDF válido');
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
      setCvContent(`[Contenido PDF de: ${file.name}]

Contenido extraído del CV...`);
    } else {
      setError('Por favor, sube un archivo PDF válido');
    }
  };

  const handleAnalyze = async () => {
    if (!cvContent.trim()) {
      setError('Por favor, sube tu CV o pega el contenido');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Mock analysis - in real app, this would call the API
      const mockResult: ATSAnalysisResult = {
        overallScore: 72,
        scores: {
          keywordOptimization: 75,
          formatting: 85,
          contentQuality: 68,
          atsCompatibility: 70
        },
        feedback: {
          strengths: [
            "Excelente estructura con secciones claras y organizadas",
            "Uso efectivo de bullets points para destacar logros",
            "Incluye métricas cuantificables (60% mejora, €2M+, 85% cobertura)",
            "Formato profesional y fácil de leer para sistemas ATS"
          ],
          improvements: [
            "Agregar más palabras clave específicas del sector tecnológico",
            "Incluir más habilidades soft skills relevantes",
            "Expandir la sección de proyectos personales o destacados",
            "Optimizar la densidad de palabras clave en el resumen profesional"
          ],
          criticalIssues: [
            "Falta información de contacto profesional (GitHub, portfolio)",
            "No incluye palabras clave de la descripción del trabajo objetivo",
            "Podría beneficiarse de más contexto sobre el impacto de los proyectos"
          ]
        },
        keywordAnalysis: {
          matched: ['React', 'JavaScript', 'Node.js', 'AWS', 'TypeScript', 'PostgreSQL', 'Docker'],
          missing: ['Agile', 'Scrum', 'REST APIs', 'GraphQL', 'Microservicios', 'DevOps'],
          density: {
            'React': 3,
            'JavaScript': 2,
            'Node.js': 3,
            'AWS': 2,
            'TypeScript': 2
          }
        },
        suggestions: [
          "Incluye una sección de 'Proyectos Destacados' con links a GitHub",
          "Agrega palabras clave como 'Agile', 'Scrum', 'REST APIs' en la descripción de experiencia",
          "Optimiza el resumen profesional con más términos específicos del puesto objetivo",
          "Considera agregar una sección de 'Logros Clave' con métricas específicas",
          "Incluye habilidades de liderazgo y gestión de equipos más explícitamente"
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult(mockResult);
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'El análisis falló');
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
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">Validador de CV con IA</h1>
                  <p className="text-sm text-gray-500">
                    Sube tu CV y recibe recomendaciones inteligentes para mejorarlo y optimizarlo para ATS
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">¡Análisis gratuito!</div>
                    <div className="text-xs text-gray-500">Mejora tu CV en minutos</div>
                  </div>
                  <Sparkles className="h-8 w-8 text-yellow-500" />
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
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                      >
                        <Upload className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <div>
                          <p className="text-lg text-gray-600 mb-2">
                            Arrastra tu CV aquí o{' '}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                              selecciona un archivo
                            </button>
                          </p>
                          <p className="text-sm text-gray-500">Solo archivos PDF • Máximo 10MB</p>
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
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-green-600 mr-3" />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-green-800">{uploadedFile.name}</span>
                              <p className="text-xs text-green-600">Archivo cargado correctamente</p>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-600" />
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
                      Descripción del trabajo objetivo (Opcional)
                    </label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Pega la descripción del trabajo al que aspiras para un análisis más preciso..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industria objetivo (Opcional)
                      </label>
                      <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="ej. Tecnología, Finanzas, Salud"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Palabras clave objetivo (Opcional)
                      </label>
                      <input
                        type="text"
                        value={targetKeywords}
                        onChange={(e) => setTargetKeywords(e.target.value)}
                        placeholder="ej. React, Python, Liderazgo"
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
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Analizando tu CV...
                      </>
                    ) : (
                      <>
                        <Shield className="h-5 w-5 mr-3" />
                        Analizar CV con IA
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-3">💡 Consejos para un mejor análisis</h4>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li>• Incluye información completa: experiencia, educación, habilidades</li>
                  <li>• Agrega métricas y logros cuantificables cuando sea posible</li>
                  <li>• Usa formato estándar con secciones claras</li>
                  <li>• Si tienes un trabajo objetivo, inclúyelo para análisis personalizado</li>
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
                      <h3 className="text-lg font-medium text-gray-900">Puntuación General</h3>
                    </div>
                    <div className="p-6">
                      <div className="text-center">
                        <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)} mb-2`}>
                          {result.overallScore}
                        </div>
                        <div className="text-lg text-gray-600 mb-4">de 100 puntos</div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                          <div 
                            className={`h-3 rounded-full ${getScoreBgColor(result.overallScore)}`}
                            style={{ width: `${result.overallScore}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {result.overallScore >= 80 ? '¡Excelente! Tu CV está muy bien optimizado.' :
                           result.overallScore >= 60 ? 'Bien, pero hay oportunidades de mejora.' :
                           'Tu CV necesita optimización para mejores resultados.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Análisis Detallado</h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {Object.entries(result.scores).map(([key, score]) => {
                        const labels: Record<string, string> = {
                          keywordOptimization: 'Optimización de palabras clave',
                          formatting: 'Formato y estructura',
                          contentQuality: 'Calidad del contenido',
                          atsCompatibility: 'Compatibilidad ATS'
                        };
                        
                        return (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{labels[key]}</span>
                              <span className={getScoreColor(score)}>{score}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getScoreBgColor(score)}`}
                                style={{ width: `${score}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Feedback Detallado</h3>
                    </div>
                    <div className="p-6 space-y-6">
                      {result.feedback.strengths.length > 0 && (
                        <div>
                          <h4 className="flex items-center text-green-800 font-medium mb-3">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Fortalezas
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

                      {result.feedback.improvements.length > 0 && (
                        <div>
                          <h4 className="flex items-center text-yellow-800 font-medium mb-3">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Oportunidades de mejora
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

                      {result.feedback.criticalIssues.length > 0 && (
                        <div>
                          <h4 className="flex items-center text-red-800 font-medium mb-3">
                            <XCircle className="h-5 w-5 mr-2" />
                            Problemas críticos
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

                  {/* Keywords Analysis */}
                  {(result.keywordAnalysis.matched.length > 0 || result.keywordAnalysis.missing.length > 0) && (
                    <div className="bg-white rounded-lg shadow">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Análisis de palabras clave</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        {result.keywordAnalysis.matched.length > 0 && (
                          <div>
                            <h4 className="text-green-700 font-medium mb-2">✅ Palabras clave encontradas</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.keywordAnalysis.matched.map((keyword, index) => (
                                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.keywordAnalysis.missing.length > 0 && (
                          <div>
                            <h4 className="text-orange-700 font-medium mb-2">⚠️ Palabras clave recomendadas</h4>
                            <div className="flex flex-wrap gap-2">
                              {result.keywordAnalysis.missing.map((keyword, index) => (
                                <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Optimization Suggestions */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">Recomendaciones de optimización</h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start">
                            <Target className="flex-shrink-0 h-5 w-5 text-blue-600 mt-0.5 mr-3" />
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
                            Basándose en este análisis, nuestro constructor de CV puede ayudarte a crear un CV optimizado 
                            que incorpore todas las mejores prácticas y palabras clave recomendadas.
                          </p>
                          
                          {result.overallScore < 80 && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <div className="flex">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-yellow-800">
                                    <strong>Tu puntuación actual es {result.overallScore}/100.</strong> 
                                    {' '}Con nuestro constructor, podrías alcanzar una puntuación de 90+ fácilmente.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <LinkButton
                              href="/dashboard/cvs/builder"
                              className="inline-flex items-center justify-center"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Crear CV Optimizado
                            </LinkButton>
                            <LinkButton
                              href="/dashboard/templates"
                              variant="secondary"
                              className="inline-flex items-center justify-center"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Ver Plantillas
                            </LinkButton>
                          </div>

                          <div className="mt-3 text-xs text-gray-500">
                            💡 <strong>Totalmente opcional:</strong> El análisis ya está completo. Solo usa el constructor si quieres mejorar tu CV.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-12 text-center">
                    <Shield className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">¿Listo para analizar tu CV?</h3>
                    <p className="text-gray-500 mb-6">
                      Sube tu CV o pega el contenido para recibir un análisis detallado con recomendaciones personalizadas
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-blue-900">Análisis ATS</div>
                        <div className="text-xs text-blue-600">Compatibilidad sistemas</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-sm font-medium text-green-900">Recomendaciones</div>
                        <div className="text-xs text-green-600">Mejoras personalizadas</div>
                      </div>
                    </div>
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