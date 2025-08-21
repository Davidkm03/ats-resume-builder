import { z } from 'zod';

// AI Service Configuration
export interface AIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
}

// Token Usage Tracking
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

export interface UsageLimit {
  userId: string;
  dailyLimit: number;
  monthlyLimit: number;
  dailyUsed: number;
  monthlyUsed: number;
  resetTime: Date;
}

// AI Request Types
export const aiRequestSchema = z.object({
  prompt: z.string().min(1),
  maxTokens: z.number().optional(),
  temperature: z.number().min(0).max(2).optional(),
  context: z.record(z.any()).optional(),
});

export type AIRequest = z.infer<typeof aiRequestSchema>;

// AI Response Types
export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  usage?: TokenUsage;
  model: string;
  timestamp: Date;
}

// Content Generation Types
export interface JobDescriptionAnalysis {
  keywords: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  industryTerms: string[];
  companyInfo: {
    name?: string;
    industry?: string;
    size?: string;
  };
  roleLevel: 'entry' | 'mid' | 'senior' | 'executive';
  suggestions: string[];
}

export interface BulletPointRequest {
  jobTitle: string;
  company: string;
  industry: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
  context?: string;
}

export interface GeneratedBulletPoints {
  optimized: string[];
  alternatives: string[];
  keywords: string[];
  atsScore: number;
  suggestions: string[];
}

export interface SummaryRequest {
  experience: Array<{
    title: string;
    company: string;
    years: number;
    skills: string[];
  }>;
  targetRole: string;
  industry: string;
  level: 'entry' | 'mid' | 'senior' | 'executive';
  tone: 'professional' | 'dynamic' | 'creative';
}

export interface GeneratedSummary {
  summary: string;
  alternatives: string[];
  keywords: string[];
  length: number;
  readabilityScore: number;
}

// ATS Optimization Types
export interface ATSAnalysisRequest {
  cvContent: string;
  jobDescription?: string;
  targetKeywords?: string[];
  industry?: string;
}

export interface ATSAnalysisResult {
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

// Premium AI Features
export interface IndustryAnalysisRequest {
  industry: string;
  role: string;
  experience: string;
  location?: string;
}

export interface IndustryAnalysis {
  marketTrends: string[];
  inDemandSkills: string[];
  salaryInsights: {
    range: string;
    factors: string[];
  };
  competitiveAnalysis: string[];
  recommendations: string[];
}

export interface CoverLetterRequest {
  cvData?: any;
  jobDescription: string;
  company: string;
  position: string;
  tone: 'formal' | 'casual' | 'enthusiastic';
  length: 'short' | 'medium' | 'long';
}

export interface GeneratedCoverLetter {
  content: string;
  alternatives: string[];
  tone: string;
  wordCount: number;
  keyPoints: string[];
}

export interface CVComparisonRequest {
  userCV?: any;
  benchmarkCVs?: any[];
  industry: string;
  role: string;
}

export interface CVBenchmarkResult {
  overallRating: number;
  comparison: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  industryBenchmarks: {
    avgExperience: number;
    commonSkills: string[];
    formatTrends: string[];
  };
  improvementPlan: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
  }[];
}

// Error Types
export interface AIError {
  code: 'RATE_LIMIT' | 'API_ERROR' | 'VALIDATION_ERROR' | 'QUOTA_EXCEEDED' | 'TIMEOUT';
  message: string;
  details?: any;
  retryAfter?: number;
}

// Service Status
export interface AIServiceStatus {
  isAvailable: boolean;
  model: string;
  responseTime: number;
  errorRate: number;
  lastCheck: Date;
}

// Prompt Templates
export interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  category: 'generation' | 'optimization' | 'analysis';
  premium: boolean;
}

// AI Models Configuration
export const AI_MODELS = {
  GPT_4: 'gpt-4',
  GPT_4_TURBO: 'gpt-4-turbo-preview',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
} as const;

export type AIModel = typeof AI_MODELS[keyof typeof AI_MODELS];

// Pricing Configuration
export const TOKEN_PRICING = {
  [AI_MODELS.GPT_4]: {
    input: 0.03 / 1000,    // $0.03 per 1K tokens
    output: 0.06 / 1000,   // $0.06 per 1K tokens
  },
  [AI_MODELS.GPT_4_TURBO]: {
    input: 0.01 / 1000,    // $0.01 per 1K tokens
    output: 0.03 / 1000,   // $0.03 per 1K tokens
  },
  [AI_MODELS.GPT_3_5_TURBO]: {
    input: 0.001 / 1000,   // $0.001 per 1K tokens
    output: 0.002 / 1000,  // $0.002 per 1K tokens
  },
} as const;

// Usage Limits (tokens per day)
export const USAGE_LIMITS = {
  FREE: {
    daily: 10000,
    monthly: 200000,
  },
  PREMIUM: {
    daily: 100000,
    monthly: 2000000,
  },
  ENTERPRISE: {
    daily: 500000,
    monthly: 10000000,
  },
} as const;

export type PlanType = keyof typeof USAGE_LIMITS;