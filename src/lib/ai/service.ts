import { OpenAIClient } from './client';
import { usageTracker } from './usage-tracker';
import { 
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
  PlanType,
  AI_MODELS
} from '@/types/ai';

export class AIService {
  private client: OpenAIClient;
  private static instance: AIService;

  private constructor() {
    this.client = new OpenAIClient();
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Analyze job description and extract relevant information
   */
  async analyzeJobDescription(
    jobDescription: string,
    userId: string,
    planType: PlanType = 'FREE'
  ): Promise<AIResponse<JobDescriptionAnalysis>> {
    try {
      // Estimate tokens and check limits
      const estimatedTokens = usageTracker.estimateTokens(jobDescription) + 1000;
      const canProceed = await usageTracker.canMakeRequest(userId, estimatedTokens, planType);
      
      if (!canProceed.allowed) {
        return {
          success: false,
          error: canProceed.reason || 'Usage limit exceeded',
          model: AI_MODELS.GPT_3_5_TURBO,
          timestamp: new Date(),
        };
      }

      const systemPrompt = `You are an expert recruiter and HR professional. Analyze job descriptions to extract key information that would be valuable for CV optimization and candidate preparation.

Your analysis should be thorough and practical, focusing on actionable insights that can help candidates tailor their applications effectively.`;

      const prompt = `Analyze this job description and extract the following information:

1. Required Skills (must-have technical and soft skills)
2. Preferred Skills (nice-to-have skills that give advantages)
3. Industry-specific keywords and terminology
4. Company information (if mentioned)
5. Role level (entry/mid/senior/executive)
6. Key responsibilities and expectations
7. Optimization suggestions for CV tailoring

Job Description:
${jobDescription}

Provide a comprehensive analysis that will help a candidate understand exactly what this employer is looking for and how to position themselves effectively.`;

      const schema = {
        type: 'object',
        properties: {
          keywords: {
            type: 'array',
            items: { type: 'string' },
            description: 'Important keywords and phrases from the job description'
          },
          requiredSkills: {
            type: 'array',
            items: { type: 'string' },
            description: 'Must-have skills explicitly mentioned'
          },
          preferredSkills: {
            type: 'array',
            items: { type: 'string' },
            description: 'Preferred or nice-to-have skills'
          },
          industryTerms: {
            type: 'array',
            items: { type: 'string' },
            description: 'Industry-specific terminology and jargon'
          },
          companyInfo: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              industry: { type: 'string' },
              size: { type: 'string' }
            }
          },
          roleLevel: {
            type: 'string',
            enum: ['entry', 'mid', 'senior', 'executive'],
            description: 'Experience level required for this role'
          },
          suggestions: {
            type: 'array',
            items: { type: 'string' },
            description: 'Actionable suggestions for CV optimization'
          }
        },
        required: ['keywords', 'requiredSkills', 'preferredSkills', 'industryTerms', 'roleLevel', 'suggestions']
      };

      const response = await this.client.generateStructuredOutput<JobDescriptionAnalysis>(
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
          feature: 'job_description_analysis',
        });
      }

      return response;
    } catch (error) {
      console.error('Job description analysis failed:', error);
      return {
        success: false,
        error: 'Failed to analyze job description',
        model: AI_MODELS.GPT_4_TURBO,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Generate optimized bullet points for experience
   */
  async generateBulletPoints(
    request: BulletPointRequest,
    userId: string,
    planType: PlanType = 'FREE'
  ): Promise<AIResponse<GeneratedBulletPoints>> {
    try {
      const context = JSON.stringify(request);
      const estimatedTokens = usageTracker.estimateTokens(context) + 1500;
      
      const canProceed = await usageTracker.canMakeRequest(userId, estimatedTokens, planType);
      if (!canProceed.allowed) {
        return {
          success: false,
          error: canProceed.reason || 'Usage limit exceeded',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const systemPrompt = `You are an expert CV writer and career coach specializing in creating compelling, ATS-optimized bullet points that highlight achievements and impact.

Focus on:
- Quantified achievements with specific metrics
- Action verbs that demonstrate leadership and initiative
- Industry-relevant keywords for ATS optimization
- STAR method (Situation, Task, Action, Result) when applicable
- Impact-focused language that shows business value`;

      const prompt = `Create optimized bullet points for this work experience:

Job Title: ${request.jobTitle}
Company: ${request.company}
Industry: ${request.industry}

Current Responsibilities:
${request.responsibilities.join('\n')}

Achievements:
${request.achievements.join('\n')}

Key Skills Used:
${request.skills.join(', ')}

${request.context ? `Additional Context: ${request.context}` : ''}

Generate:
1. 4-6 highly optimized bullet points that showcase impact and achievements
2. 3-4 alternative versions for variety
3. Key ATS keywords to include
4. ATS compatibility score (1-100)
5. Improvement suggestions

Make each bullet point compelling, specific, and results-oriented.`;

      const schema = {
        type: 'object',
        properties: {
          optimized: {
            type: 'array',
            items: { type: 'string' },
            description: 'Primary optimized bullet points'
          },
          alternatives: {
            type: 'array',
            items: { type: 'string' },
            description: 'Alternative bullet point versions'
          },
          keywords: {
            type: 'array',
            items: { type: 'string' },
            description: 'Important ATS keywords included'
          },
          atsScore: {
            type: 'number',
            description: 'ATS compatibility score from 1-100'
          },
          suggestions: {
            type: 'array',
            items: { type: 'string' },
            description: 'Suggestions for further improvement'
          }
        },
        required: ['optimized', 'alternatives', 'keywords', 'atsScore', 'suggestions']
      };

      const response = await this.client.generateStructuredOutput<GeneratedBulletPoints>(
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
          feature: 'bullet_point_generation',
        });
      }

      return response;
    } catch (error) {
      console.error('Bullet point generation failed:', error);
      return {
        success: false,
        error: 'Failed to generate bullet points',
        model: AI_MODELS.GPT_4_TURBO,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Generate professional summary/profile
   */
  async generateSummary(
    request: SummaryRequest,
    userId: string,
    planType: PlanType = 'FREE'
  ): Promise<AIResponse<GeneratedSummary>> {
    try {
      const context = JSON.stringify(request);
      const estimatedTokens = usageTracker.estimateTokens(context) + 1000;
      
      const canProceed = await usageTracker.canMakeRequest(userId, estimatedTokens, planType);
      if (!canProceed.allowed) {
        return {
          success: false,
          error: canProceed.reason || 'Usage limit exceeded',
          model: AI_MODELS.GPT_4_TURBO,
          timestamp: new Date(),
        };
      }

      const systemPrompt = `You are an expert CV writer specializing in creating compelling professional summaries that capture a candidate's unique value proposition.

Create summaries that:
- Immediately communicate the candidate's level and expertise
- Highlight key achievements and differentiators
- Include relevant industry keywords
- Match the target role and industry
- Are concise yet impactful (3-5 sentences)
- Use the specified tone appropriately`;

      const prompt = `Create a professional summary for this candidate:

Target Role: ${request.targetRole}
Industry: ${request.industry}
Experience Level: ${request.level}
Tone: ${request.tone}

Experience Background:
${request.experience.map(exp => 
  `- ${exp.title} at ${exp.company} (${exp.years} years) - Skills: ${exp.skills.join(', ')}`
).join('\n')}

Generate:
1. Primary professional summary (3-5 sentences)
2. 2-3 alternative versions with different approaches
3. Key industry keywords incorporated
4. Readability score and length analysis
5. Suggestions for customization

Ensure the summary is compelling, keyword-rich, and perfectly tailored to the target role.`;

      const schema = {
        type: 'object',
        properties: {
          summary: {
            type: 'string',
            description: 'Main professional summary'
          },
          alternatives: {
            type: 'array',
            items: { type: 'string' },
            description: 'Alternative summary versions'
          },
          keywords: {
            type: 'array',
            items: { type: 'string' },
            description: 'Key industry keywords included'
          },
          length: {
            type: 'number',
            description: 'Word count of the main summary'
          },
          readabilityScore: {
            type: 'number',
            description: 'Readability score from 1-100'
          }
        },
        required: ['summary', 'alternatives', 'keywords', 'length', 'readabilityScore']
      };

      const response = await this.client.generateStructuredOutput<GeneratedSummary>(
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
          feature: 'summary_generation',
        });
      }

      return response;
    } catch (error) {
      console.error('Summary generation failed:', error);
      return {
        success: false,
        error: 'Failed to generate summary',
        model: AI_MODELS.GPT_4_TURBO,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Perform comprehensive ATS analysis
   */
  async analyzeATS(
    request: ATSAnalysisRequest,
    userId: string,
    planType: PlanType = 'FREE'
  ): Promise<AIResponse<ATSAnalysisResult>> {
    try {
      const context = request.cvContent + (request.jobDescription || '');
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

      const systemPrompt = `You are an expert in ATS (Applicant Tracking Systems) optimization with deep knowledge of how these systems parse, rank, and filter resumes.

Analyze CVs for:
- Keyword optimization and density
- Formatting compatibility with ATS systems
- Content structure and organization
- Section headers and readability
- File format considerations
- Overall ATS compatibility score

Provide specific, actionable feedback that will improve ATS performance.`;

      const prompt = `Perform a comprehensive ATS analysis of this CV:

CV Content:
${request.cvContent}

${request.jobDescription ? `
Target Job Description:
${request.jobDescription}
` : ''}

${request.targetKeywords?.length ? `
Target Keywords:
${request.targetKeywords.join(', ')}
` : ''}

${request.industry ? `Industry: ${request.industry}` : ''}

Analyze and provide:
1. Overall ATS compatibility score (1-100)
2. Detailed scores for: keyword optimization, formatting, content quality, ATS compatibility
3. Strengths and areas for improvement
4. Critical issues that must be fixed
5. Keyword analysis: matched, missing, density
6. Specific optimization suggestions

Be thorough and provide actionable recommendations.`;

      const schema = {
        type: 'object',
        properties: {
          overallScore: {
            type: 'number',
            description: 'Overall ATS score from 1-100'
          },
          scores: {
            type: 'object',
            properties: {
              keywordOptimization: { type: 'number' },
              formatting: { type: 'number' },
              contentQuality: { type: 'number' },
              atsCompatibility: { type: 'number' }
            }
          },
          feedback: {
            type: 'object',
            properties: {
              strengths: {
                type: 'array',
                items: { type: 'string' }
              },
              improvements: {
                type: 'array',
                items: { type: 'string' }
              },
              criticalIssues: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          },
          keywordAnalysis: {
            type: 'object',
            properties: {
              matched: {
                type: 'array',
                items: { type: 'string' }
              },
              missing: {
                type: 'array',
                items: { type: 'string' }
              },
              density: {
                type: 'object',
                additionalProperties: { type: 'number' }
              }
            }
          },
          suggestions: {
            type: 'array',
            items: { type: 'string' },
            description: 'Specific optimization suggestions'
          }
        },
        required: ['overallScore', 'scores', 'feedback', 'keywordAnalysis', 'suggestions']
      };

      const response = await this.client.generateStructuredOutput<ATSAnalysisResult>(
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
          feature: 'ats_analysis',
        });
      }

      return response;
    } catch (error) {
      console.error('ATS analysis failed:', error);
      return {
        success: false,
        error: 'Failed to perform ATS analysis',
        model: AI_MODELS.GPT_4_TURBO,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get usage statistics for a user
   */
  async getUserUsageStats(userId: string) {
    return usageTracker.getUsageStats(userId);
  }

  /**
   * Check if user is approaching limits
   */
  async checkUsageWarnings(userId: string, planType: PlanType = 'FREE') {
    return usageTracker.checkLimitWarnings(userId, planType);
  }

  /**
   * Get current usage for a user
   */
  async getCurrentUsage(userId: string) {
    return usageTracker.getCurrentUsage(userId);
  }

  /**
   * Get rate limit headers for API responses
   */
  async getRateLimitHeaders(userId: string, planType: PlanType = 'FREE') {
    return usageTracker.getRateLimitHeaders(userId, planType);
  }

  /**
   * Health check for AI service
   */
  async healthCheck() {
    try {
      const status = await this.client.getServiceStatus();
      return {
        status: status.isAvailable ? 'healthy' : 'unhealthy',
        responseTime: status.responseTime,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }
}

export const aiService = AIService.getInstance();