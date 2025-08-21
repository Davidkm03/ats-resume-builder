import OpenAI from 'openai';
import { 
  AIConfig, 
  AIResponse, 
  AIError, 
  TokenUsage, 
  AI_MODELS,
  TOKEN_PRICING,
  type AIModel 
} from '@/types/ai';

export class OpenAIClient {
  private client: OpenAI | null = null;
  private config: AIConfig;
  private retryAttempts = 3;
  private retryDelay = 1000;

  constructor(config?: Partial<AIConfig>) {
    this.config = {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: AI_MODELS.GPT_4_TURBO,
      maxTokens: 4000,
      temperature: 0.7,
      timeout: 30000,
      ...config,
    };

    // Don't initialize client during build time
    if (typeof window === 'undefined' && !this.config.apiKey) {
      // Skip initialization during build
      return;
    }

    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      timeout: this.config.timeout,
    });
  }

  /**
   * Ensure client is initialized
   */
  private ensureClientInitialized(): void {
    if (!this.client) {
      throw new Error('OpenAI client not initialized - API key may be missing');
    }
  }

  /**
   * Generate text completion with retry logic
   */
  async generateCompletion(
    prompt: string,
    options: {
      model?: AIModel;
      maxTokens?: number;
      temperature?: number;
      systemPrompt?: string;
      userId?: string;
    } = {}
  ): Promise<AIResponse<string>> {
    this.ensureClientInitialized();
    
    const startTime = Date.now();
    const model = options.model || this.config.model;
    
    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
      
      if (options.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt,
      });

      const completion = await this.executeWithRetry(async () => {
        return await this.client!.chat.completions.create({
          model,
          messages,
          max_tokens: options.maxTokens || this.config.maxTokens,
          temperature: options.temperature ?? this.config.temperature,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
      });

      const usage = this.calculateUsage(completion.usage, model);
      const responseTime = Date.now() - startTime;

      // Log usage for monitoring
      if (options.userId) {
        await this.logUsage(options.userId, usage, model, responseTime);
      }

      return {
        success: true,
        data: completion.choices[0]?.message?.content || '',
        usage,
        model,
        timestamp: new Date(),
      };

    } catch (error) {
      const aiError = this.handleError(error);
      return {
        success: false,
        error: aiError.message,
        model,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Generate structured output using function calling
   */
  async generateStructuredOutput<T>(
    prompt: string,
    schema: any,
    options: {
      model?: AIModel;
      systemPrompt?: string;
      userId?: string;
    } = {}
  ): Promise<AIResponse<T>> {
    this.ensureClientInitialized();
    
    const startTime = Date.now();
    const model = options.model || this.config.model;

    try {
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
      
      if (options.systemPrompt) {
        messages.push({
          role: 'system',
          content: options.systemPrompt,
        });
      }
      
      messages.push({
        role: 'user',
        content: prompt,
      });

      const completion = await this.executeWithRetry(async () => {
        return await this.client!.chat.completions.create({
          model,
          messages,
          functions: [{
            name: 'structured_output',
            description: 'Generate structured output according to the schema',
            parameters: schema,
          }],
          function_call: { name: 'structured_output' },
          temperature: 0.3,
        });
      });

      const functionCall = completion.choices[0]?.message?.function_call;
      if (!functionCall?.arguments) {
        throw new Error('No structured output received');
      }

      const parsedData = JSON.parse(functionCall.arguments);
      const usage = this.calculateUsage(completion.usage, model);
      const responseTime = Date.now() - startTime;

      if (options.userId) {
        await this.logUsage(options.userId, usage, model, responseTime);
      }

      return {
        success: true,
        data: parsedData,
        usage,
        model,
        timestamp: new Date(),
      };

    } catch (error) {
      const aiError = this.handleError(error);
      return {
        success: false,
        error: aiError.message,
        model,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Analyze text and extract insights
   */
  async analyzeText(
    text: string,
    analysisType: 'keywords' | 'sentiment' | 'structure' | 'ats',
    options: {
      context?: Record<string, any>;
      userId?: string;
    } = {}
  ): Promise<AIResponse<any>> {
    const systemPrompts = {
      keywords: 'You are an expert in keyword extraction and SEO analysis. Extract relevant keywords, skills, and industry terms from the provided text.',
      sentiment: 'You are an expert in sentiment analysis. Analyze the tone, emotion, and overall sentiment of the provided text.',
      structure: 'You are an expert in content structure analysis. Analyze the organization, flow, and readability of the provided text.',
      ats: 'You are an expert in ATS (Applicant Tracking System) optimization. Analyze how well the text would perform in automated screening systems.',
    };

    return this.generateCompletion(
      `Analyze this text for ${analysisType}:\n\n${text}`,
      {
        systemPrompt: systemPrompts[analysisType],
        model: AI_MODELS.GPT_3_5_TURBO, // Use faster model for analysis
        userId: options.userId,
      }
    );
  }

  /**
   * Execute request with exponential backoff retry
   */
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (attempt >= this.retryAttempts) {
        throw error;
      }

      // Check if error is retryable
      if (this.isRetryableError(error)) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
        return this.executeWithRetry(operation, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Check if error should trigger a retry
   */
  private isRetryableError(error: any): boolean {
    const retryableStatuses = [429, 500, 502, 503, 504];
    const retryableErrors = ['timeout', 'network', 'connection'];
    
    if (error.status && retryableStatuses.includes(error.status)) {
      return true;
    }

    if (error.code && retryableErrors.some(code => 
      error.code.toLowerCase().includes(code)
    )) {
      return true;
    }

    return false;
  }

  /**
   * Calculate token usage and cost
   */
  private calculateUsage(
    usage: OpenAI.Completions.CompletionUsage | undefined,
    model: string
  ): TokenUsage {
    if (!usage) {
      return {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        cost: 0,
      };
    }

    const pricing = TOKEN_PRICING[model as AIModel] || TOKEN_PRICING[AI_MODELS.GPT_3_5_TURBO];
    const cost = (usage.prompt_tokens * pricing.input) + 
                 (usage.completion_tokens * pricing.output);

    return {
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      totalTokens: usage.total_tokens,
      cost: Math.round(cost * 10000) / 10000, // Round to 4 decimal places
    };
  }

  /**
   * Handle and categorize errors
   */
  private handleError(error: any): AIError {
    if (error.status === 429) {
      return {
        code: 'RATE_LIMIT',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: error.headers?.['retry-after'] ? 
          parseInt(error.headers['retry-after']) : 60,
      };
    }

    if (error.status === 401) {
      return {
        code: 'API_ERROR',
        message: 'Invalid API key or authentication failed.',
      };
    }

    if (error.status >= 500) {
      return {
        code: 'API_ERROR',
        message: 'OpenAI service temporarily unavailable.',
      };
    }

    if (error.message?.includes('timeout')) {
      return {
        code: 'TIMEOUT',
        message: 'Request timed out. Please try again.',
      };
    }

    return {
      code: 'API_ERROR',
      message: error.message || 'An unexpected error occurred.',
      details: error,
    };
  }

  /**
   * Log usage for tracking and billing
   */
  private async logUsage(
    userId: string,
    usage: TokenUsage,
    model: string,
    responseTime: number
  ): Promise<void> {
    try {
      // In a real implementation, this would log to your database
      // For now, we'll use console.log for monitoring
      console.log('AI Usage Log:', {
        userId,
        model,
        usage,
        responseTime,
        timestamp: new Date().toISOString(),
      });

      // TODO: Implement database logging
      // await this.database.aiUsage.create({
      //   data: {
      //     userId,
      //     model,
      //     promptTokens: usage.promptTokens,
      //     completionTokens: usage.completionTokens,
      //     totalTokens: usage.totalTokens,
      //     cost: usage.cost,
      //     responseTime,
      //   },
      // });
    } catch (error) {
      console.error('Failed to log AI usage:', error);
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get service status
   */
  async getServiceStatus(): Promise<{ isAvailable: boolean; responseTime: number }> {
    const startTime = Date.now();
    
    try {
      if (!this.client) {
        return {
          isAvailable: false,
          responseTime: Date.now() - startTime,
        };
      }
      
      await this.client!.models.list();
      return {
        isAvailable: true,
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        isAvailable: false,
        responseTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Validate API key and configuration
   */
  async validateConfiguration(): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }
      
      const response = await this.client!.models.list();
      return response.data.length > 0;
    } catch (error) {
      return false;
    }
  }
}