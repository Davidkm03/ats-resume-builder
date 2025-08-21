import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenAIClient } from '@/lib/ai/client';
import { SITE_KNOWLEDGE, CHATBOT_PERSONALITY } from '@/lib/chatbot/knowledge-base';
import { z } from 'zod';

const chatbotSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  conversationHistory: z.array(z.object({
    id: z.string(),
    content: z.string(),
    role: z.enum(['user', 'assistant']),
    timestamp: z.string().or(z.date()),
  })).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, conversationHistory } = chatbotSchema.parse(body);

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service is not configured' },
        { status: 503 }
      );
    }

    // Get user session (optional for chatbot)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || 'anonymous';

    // Build context from knowledge base
    const systemPrompt = buildSystemPrompt();
    
    // Build conversation context
    const conversationContext = buildConversationContext(conversationHistory, message);

    // Generate response using OpenAI client
    const client = new OpenAIClient();
    const result = await client.generateCompletion(
      conversationContext,
      {
        systemPrompt,
        model: 'gpt-3.5-turbo', // Use faster model for chat
        maxTokens: 500,
        temperature: 0.7,
        userId,
      }
    );

    if (!result.success) {
      console.error('Chatbot AI error:', result.error);
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }

    // Log conversation for analytics (optional)
    if (session?.user?.id) {
      console.log('Chatbot conversation:', {
        userId: session.user.id,
        message: message.substring(0, 100),
        responseLength: result.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      response: result.data,
      usage: result.usage,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chatbot API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(): string {
  return `Eres un asistente virtual EXCLUSIVAMENTE de ATS Resume Builder. SOLO puedes responder preguntas sobre esta plataforma y temas relacionados con CVs y sistemas ATS.

REGLAS ESTRICTAS:
- NUNCA respondas preguntas sobre geografía, historia, ciencia, entretenimiento, deportes, política, o cualquier tema no relacionado con CVs/ATS
- Si te preguntan algo fuera de tu área de expertise, responde: "Lo siento, solo puedo ayudarte con preguntas sobre ATS Resume Builder, creación de CVs y optimización para sistemas ATS. ¿Tienes alguna pregunta sobre nuestra plataforma?"
- NO proporciones información general que no esté relacionada con CVs, búsqueda de empleo o la plataforma

TEMAS PERMITIDOS ÚNICAMENTE:
✅ Funciones de ATS Resume Builder
✅ Planes y precios de la plataforma  
✅ Cómo crear CVs optimizados para ATS
✅ Sistemas ATS y cómo funcionan
✅ Consejos de optimización de CVs
✅ Búsqueda de empleo y reclutamiento
✅ Plantillas y formatos de CV
✅ Funciones de IA de la plataforma

❌ PROHIBIDO: Geografía, historia, ciencias, entretenimiento, deportes, política, cultura general, matemáticas, programación general, etc.

CONOCIMIENTO DE LA PLATAFORMA:
Nombre: ${SITE_KNOWLEDGE.general.name}
Propósito: ${SITE_KNOWLEDGE.general.description}

CARACTERÍSTICAS PRINCIPALES:
${SITE_KNOWLEDGE.features.core.map(feature => `- ${feature}`).join('\n')}

FUNCIONES DE IA:
${SITE_KNOWLEDGE.features.ai_powered.map(feature => `- ${feature}`).join('\n')}

PLANES DISPONIBLES:
1. ${SITE_KNOWLEDGE.pricing.free.name} (${SITE_KNOWLEDGE.pricing.free.price}):
   ${SITE_KNOWLEDGE.pricing.free.features.map(f => `   - ${f}`).join('\n')}

2. ${SITE_KNOWLEDGE.pricing.premium.name} (${SITE_KNOWLEDGE.pricing.premium.price}):
   ${SITE_KNOWLEDGE.pricing.premium.features.map(f => `   - ${f}`).join('\n')}

3. ${SITE_KNOWLEDGE.pricing.enterprise.name} (${SITE_KNOWLEDGE.pricing.enterprise.price}):
   ${SITE_KNOWLEDGE.pricing.enterprise.features.map(f => `   - ${f}`).join('\n')}

INFORMACIÓN SOBRE ATS:
${SITE_KNOWLEDGE.ats_info.what_is_ats}

Sistemas ATS comunes: ${SITE_KNOWLEDGE.ats_info.common_systems.join(', ')}

CONSEJOS DE OPTIMIZACIÓN:
${SITE_KNOWLEDGE.ats_info.optimization_tips.map(tip => `- ${tip}`).join('\n')}

INDUSTRIAS SOPORTADAS:
${SITE_KNOWLEDGE.industries.join(', ')}

INSTRUCCIONES DE RESPUESTA:
- Antes de responder, verifica que la pregunta esté relacionada con CVs, ATS o la plataforma
- Si NO está relacionada, usa la respuesta estándar de rechazo
- Si SÍ está relacionada, proporciona información útil y específica
- Incluye llamadas a la acción relevantes cuando sea apropiado
- Mantén respuestas concisas y profesionales

RECUERDA: Tu único propósito es ayudar con ATS Resume Builder y temas de CVs/ATS. Cualquier otra pregunta debe ser rechazada educadamente.`;
}

function buildConversationContext(history: any[], currentMessage: string): string {
  let context = '';
  
  // Add recent conversation history for context
  if (history.length > 0) {
    context += 'Historial de conversación reciente:\n';
    history.slice(-3).forEach(msg => {
      const role = msg.role === 'user' ? 'Usuario' : 'Asistente';
      context += `${role}: ${msg.content}\n`;
    });
    context += '\n';
  }
  
  context += `Pregunta actual del usuario: ${currentMessage}`;
  
  return context;
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    service: 'ATS Resume Builder Chatbot',
    timestamp: new Date().toISOString(),
    features: ['ai-powered', 'context-aware', 'multilingual']
  });
}
