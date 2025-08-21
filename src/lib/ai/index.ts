// Main AI service exports
export { aiService } from './service';
export { premiumAIService } from './premium-service';
export { OpenAIClient } from './client';
export { usageTracker } from './usage-tracker';

// Re-export types for convenience
export type {
  AIResponse,
  JobDescriptionAnalysis,
  BulletPointRequest,
  GeneratedBulletPoints,
  SummaryRequest,
  GeneratedSummary,
  ATSAnalysisRequest,
  ATSAnalysisResult,
  IndustryAnalysisRequest,
  IndustryAnalysis,
  CoverLetterRequest,
  GeneratedCoverLetter,
  CVComparisonRequest,
  CVBenchmarkResult,
  TokenUsage,
  UsageLimit,
  AIError,
  PlanType,
} from '@/types/ai';

// Configuration constants
export {
  AI_MODELS,
  TOKEN_PRICING,
  USAGE_LIMITS,
} from '@/types/ai';