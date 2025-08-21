import { OpenAIClient } from './client';
import { usageTracker } from './usage-tracker';
import { 
  AIResponse, 
  IndustryAnalysisRequest,
  IndustryAnalysis,
  CoverLetterRequest,
  GeneratedCoverLetter,
  CVComparisonRequest,
  CVBenchmarkResult,
  PlanType,
  AI_MODELS
} from '@/types/ai';

export class PremiumAIService {
  private client: OpenAIClient;
  private static instance: PremiumAIService;

  private constructor() {
    this.client = new OpenAIClient();
  }

  static getInstance(): PremiumAIService {
    if (!PremiumAIService.instance) {
      PremiumAIService.instance = new PremiumAIService();
    }
    return PremiumAIService.instance;
  }

  /**
   * Perform industry-specific analysis and insights
   */
  async analyzeIndustry(
    request: IndustryAnalysisRequest,
    userId: string,
    planType: PlanType = 'PREMIUM'
  ): Promise<AIResponse<IndustryAnalysis>> {
    try {
      // Premium feature check
      if (planType === 'FREE') {
        return {
          success: false,
          error: 'Industry analysis is a premium feature',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const context = JSON.stringify(request);
      const estimatedTokens = usageTracker.estimateTokens(context) + 2500;
      
      const canProceed = await usageTracker.canMakeRequest(userId, estimatedTokens, planType);
      if (!canProceed.allowed) {
        return {
          success: false,
          error: canProceed.reason || 'Usage limit exceeded',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const systemPrompt = `You are a senior industry analyst and career strategist with deep expertise across multiple industries. Your analysis combines market intelligence, talent trends, and strategic career insights.

Provide comprehensive industry analysis that includes:
- Current market trends and disruptions
- In-demand skills and emerging competencies
- Salary insights and market positioning
- Competitive landscape analysis
- Strategic career recommendations

Your insights should be data-driven, actionable, and forward-looking.`;

      const prompt = `Provide a comprehensive industry analysis for:

Industry: ${request.industry}
Target Role: ${request.role}
Experience Level: ${request.experience}
${request.location ? `Location: ${request.location}` : ''}

Include:
1. Current market trends affecting this industry
2. In-demand skills and emerging technologies
3. Salary insights and market positioning factors
4. Competitive analysis - what sets candidates apart
5. Strategic recommendations for career advancement
6. Future outlook and opportunities

Focus on actionable insights that will help position the candidate competitively in this market.`;

      const schema = {
        type: 'object',
        properties: {
          marketTrends: {
            type: 'array',
            items: { type: 'string' },
            description: 'Current market trends and industry developments'
          },
          inDemandSkills: {
            type: 'array',
            items: { type: 'string' },
            description: 'Skills currently in high demand'
          },
          salaryInsights: {
            type: 'object',
            properties: {
              range: { type: 'string' },
              factors: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            description: 'Salary range and influencing factors'
          },
          competitiveAnalysis: {
            type: 'array',
            items: { type: 'string' },
            description: 'What makes candidates competitive'
          },
          recommendations: {
            type: 'array',
            items: { type: 'string' },
            description: 'Strategic career recommendations'
          }
        },
        required: ['marketTrends', 'inDemandSkills', 'salaryInsights', 'competitiveAnalysis', 'recommendations']
      };

      const response = await this.client.generateStructuredOutput<IndustryAnalysis>(
        prompt,
        schema,
        {
          systemPrompt,
          model: AI_MODELS.GPT_4_TURBO,
          userId,
        }
      );

      if (response.success && response.usage) {
        await usageTracker.recordUsage(userId, response.usage, {
          model: response.model,
          feature: 'industry_analysis',
        });
      }

      return response;
    } catch (error) {
      console.error('Industry analysis failed:', error);
      return {
        success: false,
        error: 'Failed to perform industry analysis',
        model: AI_MODELS.GPT_4_TURBO,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Generate customized cover letter
   */
  async generateCoverLetter(
    request: CoverLetterRequest,
    userId: string,
    planType: PlanType = 'PREMIUM'
  ): Promise<AIResponse<GeneratedCoverLetter>> {
    try {
      // Premium feature check
      if (planType === 'FREE') {
        return {
          success: false,
          error: 'Cover letter generation is a premium feature',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const context = JSON.stringify(request);
      const estimatedTokens = usageTracker.estimateTokens(context) + 2000;
      
      const canProceed = await usageTracker.canMakeRequest(userId, estimatedTokens, planType);
      if (!canProceed.allowed) {
        return {
          success: false,
          error: canProceed.reason || 'Usage limit exceeded',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const systemPrompt = `You are an expert cover letter writer with extensive experience helping candidates secure interviews at top companies. 

Create compelling cover letters that:
- Tell a coherent story connecting experience to the target role
- Address specific requirements mentioned in the job description
- Showcase unique value proposition and achievements
- Match the requested tone and company culture
- Follow proven cover letter structure and best practices
- Are tailored to the specific company and position

Your cover letters should be engaging, professional, and persuasive.`;

      const lengthGuidelines = {
        short: '150-250 words (3 paragraphs)',
        medium: '250-400 words (4 paragraphs)',
        long: '400-600 words (5-6 paragraphs)'
      };

      const prompt = `Create a ${request.tone} cover letter for this application:

Position: ${request.position}
Company: ${request.company}
Length: ${request.length} (${lengthGuidelines[request.length]})
Tone: ${request.tone}

Job Description:
${request.jobDescription}

Candidate Background (CV Data):
${JSON.stringify(request.cvData, null, 2)}

Create:
1. Main cover letter following the length guidelines
2. 2-3 alternative versions with different approaches
3. Key points highlighted in the letter
4. Word count and tone analysis

Ensure the cover letter is specifically tailored to this position and company, demonstrating clear understanding of their needs and how the candidate can fulfill them.`;

      const schema = {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            description: 'Main cover letter content'
          },
          alternatives: {
            type: 'array',
            items: { type: 'string' },
            description: 'Alternative cover letter versions'
          },
          tone: {
            type: 'string',
            description: 'Actual tone achieved in the letter'
          },
          wordCount: {
            type: 'number',
            description: 'Word count of the main cover letter'
          },
          keyPoints: {
            type: 'array',
            items: { type: 'string' },
            description: 'Key selling points highlighted'
          }
        },
        required: ['content', 'alternatives', 'tone', 'wordCount', 'keyPoints']
      };

      const response = await this.client.generateStructuredOutput<GeneratedCoverLetter>(
        prompt,
        schema,
        {
          systemPrompt,
          model: AI_MODELS.GPT_4_TURBO,
          userId,
        }
      );

      if (response.success && response.usage) {
        await usageTracker.recordUsage(userId, response.usage, {
          model: response.model,
          feature: 'cover_letter_generation',
        });
      }

      return response;
    } catch (error) {
      console.error('Cover letter generation failed:', error);
      return {
        success: false,
        error: 'Failed to generate cover letter',
        model: AI_MODELS.GPT_4_TURBO,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Compare CV against industry benchmarks
   */
  async benchmarkCV(
    request: CVComparisonRequest,
    userId: string,
    planType: PlanType = 'PREMIUM'
  ): Promise<AIResponse<CVBenchmarkResult>> {
    try {
      // Premium feature check
      if (planType === 'FREE') {
        return {
          success: false,
          error: 'CV benchmarking is a premium feature',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const context = JSON.stringify(request);
      const estimatedTokens = usageTracker.estimateTokens(context) + 3000;
      
      const canProceed = await usageTracker.canMakeRequest(userId, estimatedTokens, planType);
      if (!canProceed.allowed) {
        return {
          success: false,
          error: canProceed.reason || 'Usage limit exceeded',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const systemPrompt = `You are a senior talent acquisition expert and CV analyst with extensive experience evaluating candidates across industries. 

Provide comprehensive CV benchmarking that includes:
- Objective assessment against industry standards
- Competitive analysis and positioning
- Detailed improvement recommendations
- Industry-specific benchmarks and trends
- Prioritized action plan for enhancement

Your analysis should be constructive, specific, and actionable.`;

      const prompt = `Perform a comprehensive CV benchmark analysis:

Industry: ${request.industry}
Target Role: ${request.role}

User's CV:
${JSON.stringify(request.userCV, null, 2)}

${request.benchmarkCVs ? `
Benchmark CVs for comparison:
${JSON.stringify(request.benchmarkCVs, null, 2)}
` : ''}

Provide:
1. Overall rating (1-10) with justification
2. Strengths and competitive advantages
3. Weaknesses and improvement areas
4. Industry benchmarks and standards
5. Prioritized improvement plan with impact assessment

Focus on actionable insights that will significantly improve the CV's competitiveness.`;

      const schema = {
        type: 'object',
        properties: {
          overallRating: {
            type: 'number',
            description: 'Overall CV rating from 1-10'
          },
          comparison: {
            type: 'object',
            properties: {
              strengths: {
                type: 'array',
                items: { type: 'string' }
              },
              weaknesses: {
                type: 'array',
                items: { type: 'string' }
              },
              recommendations: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          },
          industryBenchmarks: {
            type: 'object',
            properties: {
              avgExperience: { type: 'number' },
              commonSkills: {
                type: 'array',
                items: { type: 'string' }
              },
              formatTrends: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          },
          improvementPlan: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                priority: {
                  type: 'string',
                  enum: ['high', 'medium', 'low']
                },
                action: { type: 'string' },
                impact: { type: 'string' }
              }
            }
          }
        },
        required: ['overallRating', 'comparison', 'industryBenchmarks', 'improvementPlan']
      };

      const response = await this.client.generateStructuredOutput<CVBenchmarkResult>(
        prompt,
        schema,
        {
          systemPrompt,
          model: AI_MODELS.GPT_4_TURBO,
          userId,
        }
      );

      if (response.success && response.usage) {
        await usageTracker.recordUsage(userId, response.usage, {
          model: response.model,
          feature: 'cv_benchmarking',
        });
      }

      return response;
    } catch (error) {
      console.error('CV benchmarking failed:', error);
      return {
        success: false,
        error: 'Failed to benchmark CV',
        model: AI_MODELS.GPT_4_TURBO,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Advanced keyword optimization
   */
  async optimizeKeywords(
    cvContent: string,
    jobDescription: string,
    userId: string,
    planType: PlanType = 'PREMIUM'
  ): Promise<AIResponse<{
    optimizedContent: string;
    keywordChanges: Array<{
      original: string;
      optimized: string;
      reason: string;
    }>;
    densityAnalysis: Record<string, number>;
    recommendations: string[];
  }>> {
    try {
      // Premium feature check
      if (planType === 'FREE') {
        return {
          success: false,
          error: 'Advanced keyword optimization is a premium feature',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const context = cvContent + jobDescription;
      const estimatedTokens = usageTracker.estimateTokens(context) + 2000;
      
      const canProceed = await usageTracker.canMakeRequest(userId, estimatedTokens, planType);
      if (!canProceed.allowed) {
        return {
          success: false,
          error: canProceed.reason || 'Usage limit exceeded',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const systemPrompt = `You are an expert in ATS optimization and keyword strategy. Optimize CV content to maximize ATS compatibility while maintaining natural language flow and readability.

Focus on:
- Strategic keyword placement and density
- Natural language integration
- Industry-specific terminology
- ATS-friendly formatting
- Semantic keyword variations`;

      const prompt = `Optimize this CV content for maximum ATS compatibility with the target job:

CV Content:
${cvContent}

Target Job Description:
${jobDescription}

Provide:
1. Optimized CV content with strategic keyword integration
2. List of keyword changes made with explanations
3. Keyword density analysis
4. Additional optimization recommendations

Maintain natural language flow while maximizing ATS compatibility.`;

      const schema = {
        type: 'object',
        properties: {
          optimizedContent: {
            type: 'string',
            description: 'CV content optimized for ATS'
          },
          keywordChanges: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                original: { type: 'string' },
                optimized: { type: 'string' },
                reason: { type: 'string' }
              }
            }
          },
          densityAnalysis: {
            type: 'object',
            additionalProperties: { type: 'number' },
            description: 'Keyword density percentages'
          },
          recommendations: {
            type: 'array',
            items: { type: 'string' },
            description: 'Additional optimization recommendations'
          }
        },
        required: ['optimizedContent', 'keywordChanges', 'densityAnalysis', 'recommendations']
      };

      const response = await this.client.generateStructuredOutput<{
        optimizedContent: string;
        keywordChanges: Array<{
          original: string;
          optimized: string;
          reason: string;
        }>;
        densityAnalysis: Record<string, number>;
        recommendations: string[];
      }>(
        prompt,
        schema,
        {
          systemPrompt,
          model: AI_MODELS.GPT_4_TURBO,
          userId,
        }
      );

      if (response.success && response.usage) {
        await usageTracker.recordUsage(userId, response.usage, {
          model: response.model,
          feature: 'keyword_optimization',
        });
      }

      return response;
    } catch (error) {
      console.error('Keyword optimization failed:', error);
      return {
        success: false,
        error: 'Failed to optimize keywords',
        model: AI_MODELS.GPT_4_TURBO,
        timestamp: new Date(),
      };
    }
  }
}

export const premiumAIService = PremiumAIService.getInstance();