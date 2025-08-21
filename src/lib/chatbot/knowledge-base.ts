export const SITE_KNOWLEDGE = {
  // Información general del sitio
  general: {
    name: "ATS Resume Builder",
    description: "Plataforma inteligente para crear CVs optimizados para sistemas ATS (Applicant Tracking Systems)",
    purpose: "Ayudar a profesionales a crear currículums que pasen los filtros automáticos de ATS y lleguen a reclutadores humanos",
    url: "https://ats-resume-builder.com",
  },

  // Características principales
  features: {
    core: [
      "Constructor de CV optimizado para ATS",
      "Análisis de compatibilidad ATS en tiempo real",
      "Plantillas profesionales diseñadas para ATS",
      "Parsing inteligente de CVs existentes con IA",
      "Generación automática de contenido con IA",
      "Análisis de ofertas de trabajo",
      "Optimización de palabras clave",
      "Múltiples formatos de exportación (PDF, Word, etc.)"
    ],
    ai_powered: [
      "Generación automática de resúmenes profesionales",
      "Creación de bullet points optimizados",
      "Análisis de compatibilidad con ofertas específicas",
      "Sugerencias de mejora basadas en IA",
      "Parsing automático de CVs en PDF",
      "Extracción inteligente de información de LinkedIn"
    ],
    templates: [
      "Plantillas modernas y profesionales",
      "Diseños optimizados para ATS",
      "Formatos adaptables a diferentes industrias",
      "Personalización de colores y fuentes",
      "Vista previa en tiempo real"
    ]
  },

  // Planes y precios
  pricing: {
    free: {
      name: "Plan Gratuito",
      price: "$0/mes",
      features: [
        "1 CV activo",
        "Plantillas básicas",
        "Exportación en PDF",
        "Análisis ATS básico",
        "Soporte por email"
      ],
      limitations: [
        "Funciones de IA limitadas",
        "Sin análisis avanzado de ofertas",
        "Plantillas limitadas"
      ]
    },
    premium: {
      name: "Plan Premium",
      price: "$19.99/mes",
      features: [
        "CVs ilimitados",
        "Todas las plantillas premium",
        "IA avanzada para generación de contenido",
        "Análisis completo de ofertas de trabajo",
        "Optimización automática de palabras clave",
        "Múltiples formatos de exportación",
        "Soporte prioritario",
        "Análisis de compatibilidad avanzado"
      ]
    },
    enterprise: {
      name: "Plan Enterprise",
      price: "Contactar para precio",
      features: [
        "Todas las funciones Premium",
        "API personalizada",
        "Integración con sistemas HR",
        "Soporte dedicado",
        "Capacitación del equipo",
        "Análisis y reportes avanzados"
      ]
    }
  },

  // Proceso de creación de CV
  process: {
    steps: [
      "1. Registro y configuración de perfil",
      "2. Selección de plantilla optimizada para ATS",
      "3. Importación de datos existentes (LinkedIn, PDF, etc.)",
      "4. Edición asistida por IA del contenido",
      "5. Análisis de compatibilidad ATS",
      "6. Optimización basada en ofertas específicas",
      "7. Exportación en formato deseado"
    ],
    tips: [
      "Usa palabras clave relevantes para tu industria",
      "Mantén un formato limpio y profesional",
      "Incluye métricas y logros cuantificables",
      "Personaliza el CV para cada aplicación",
      "Revisa la puntuación ATS antes de enviar"
    ]
  },

  // Tecnología ATS
  ats_info: {
    what_is_ats: "Los sistemas ATS (Applicant Tracking Systems) son software que las empresas usan para filtrar y organizar CVs automáticamente antes de que lleguen a reclutadores humanos.",
    common_systems: [
      "Workday",
      "Greenhouse",
      "Lever",
      "BambooHR",
      "iCIMS",
      "Taleo",
      "SmartRecruiters"
    ],
    optimization_tips: [
      "Usar formatos estándar (PDF o Word)",
      "Evitar gráficos complejos o tablas",
      "Incluir palabras clave del job posting",
      "Usar títulos de sección estándar",
      "Mantener formato consistente",
      "Evitar headers y footers complejos"
    ]
  },

  // Soporte y ayuda
  support: {
    contact_methods: [
      "Email: support@ats-resume-builder.com",
      "Chat en vivo (usuarios Premium)",
      "Centro de ayuda online",
      "Tutoriales en video",
      "Webinars semanales gratuitos"
    ],
    common_issues: [
      "Problemas de importación de CV",
      "Optimización de puntuación ATS",
      "Selección de plantillas",
      "Personalización de contenido",
      "Exportación y formatos"
    ]
  },

  // Industrias soportadas
  industries: [
    "Tecnología e IT",
    "Finanzas y Banca",
    "Marketing y Publicidad",
    "Recursos Humanos",
    "Ventas",
    "Ingeniería",
    "Salud y Medicina",
    "Educación",
    "Consultoría",
    "Manufactura",
    "Retail",
    "Startups"
  ],

  // FAQ común
  faq: [
    {
      question: "¿Qué es un sistema ATS?",
      answer: "Un ATS (Applicant Tracking System) es un software que las empresas usan para automatizar el proceso de reclutamiento, filtrando CVs antes de que lleguen a reclutadores humanos."
    },
    {
      question: "¿Cómo optimiza mi CV para ATS?",
      answer: "Analizamos tu CV contra algoritmos ATS comunes, verificamos formato, palabras clave, estructura y proporcionamos una puntuación con sugerencias específicas de mejora."
    },
    {
      question: "¿Puedo importar mi CV existente?",
      answer: "Sí, puedes subir tu CV en PDF y nuestra IA extraerá automáticamente toda la información para crear una versión optimizada."
    },
    {
      question: "¿Qué formatos de exportación están disponibles?",
      answer: "Exportamos en PDF (recomendado), Word (.docx), y texto plano. El PDF mantiene el formato mientras es compatible con ATS."
    },
    {
      question: "¿Puedo cancelar mi suscripción en cualquier momento?",
      answer: "Sí, puedes cancelar tu suscripción Premium en cualquier momento desde tu panel de usuario. No hay compromisos a largo plazo."
    }
  ]
};

export const CHATBOT_PERSONALITY = {
  tone: "profesional pero amigable",
  language: "español",
  expertise: [
    "Optimización de CVs para ATS",
    "Mejores prácticas de reclutamiento",
    "Escritura profesional",
    "Estrategias de búsqueda de empleo",
    "Funcionalidades de la plataforma ATS Resume Builder"
  ],
  limitations: [
    "Solo responde sobre temas relacionados con CVs, ATS, búsqueda de empleo y la plataforma",
    "No proporciona consejos legales o médicos",
    "No accede a información personal de usuarios",
    "Redirige consultas no relacionadas al soporte técnico"
  ],
  response_style: [
    "Respuestas claras y estructuradas",
    "Incluye ejemplos prácticos cuando sea relevante",
    "Ofrece pasos específicos y accionables",
    "Menciona funciones relevantes de la plataforma",
    "Mantiene un tono motivador y constructivo"
  ]
};
