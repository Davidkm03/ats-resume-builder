# 🚀 ATS Resume Builder

> **La plataforma definitiva para crear CVs optimizados para sistemas ATS con inteligencia artificial**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)](https://openai.com/)

Una aplicación web moderna y completa para crear hojas de vida profesionales optimizadas para sistemas ATS (Applicant Tracking Systems) con inteligencia artificial integrada.

## ✨ Características Principales

### 🎯 **CV Builder Completo**
- **12 secciones completamente implementadas**: Contacto, Resumen, Experiencia, Educación, Habilidades, Proyectos, Certificaciones, Idiomas, Premios, Publicaciones, Voluntariado, y Secciones Personalizadas
- **Navegación inteligente** con auto-completado de pasos
- **Auto-guardado** en tiempo real
- **Validación en vivo** de formularios

### 🤖 **Inteligencia Artificial Integrada**
- **Chatbot especializado** con conocimiento del dominio ATS
- **Generación automática** de contenido para CVs
- **Análisis ATS** en tiempo real
- **Sugerencias inteligentes** para optimización

### 🎨 **Templates Profesionales**
- **8 plantillas modernas**: Classic, Modern, Minimal, Creative, Executive, Technical, Academic, Sales
- **Vista previa en tiempo real**
- **Diseño responsive** y optimizado para ATS

### 🔧 **Tecnología de Vanguardia**
- ✅ **Next.js 14** con App Router y TypeScript
- ✅ **Tailwind CSS** para estilos modernos y responsivos
- ✅ **Prisma ORM** con PostgreSQL
- ✅ **NextAuth.js** para autenticación segura
- ✅ **Integración OpenAI** para IA conversacional
- ✅ **Zustand** para gestión de estado
- ✅ **Sistema de suscripciones** con Stripe
- ✅ **Exportación múltiple** (PDF, Word, TXT)

## 🚀 Demo en Vivo

🌐 **[Ver Demo](https://github.com/Davidkm03/ats-resume-builder)** | 📖 **[Documentación](https://github.com/Davidkm03/ats-resume-builder/wiki)**

## 📋 Requisitos del Sistema

- **Node.js** 18.0 o superior
- **PostgreSQL** 14.0 o superior  
- **npm** o **yarn** como gestor de paquetes
- **Cuenta OpenAI** (opcional, para funciones de IA)

## ⚡ Instalación Rápida

### 1. **Clonar el repositorio**
```bash
git clone https://github.com/Davidkm03/ats-resume-builder.git
cd ats-resume-builder
```

### 2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

### 3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/ats_resume_builder"

# Autenticación
NEXTAUTH_SECRET="tu-clave-secreta-super-segura"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI (opcional - para funciones de IA)
OPENAI_API_KEY="sk-tu-api-key-de-openai"

# Stripe (opcional - para suscripciones)
STRIPE_SECRET_KEY="sk_test_tu-clave-de-stripe"
STRIPE_PUBLISHABLE_KEY="pk_test_tu-clave-publica-de-stripe"

# Email (opcional)
SENDGRID_API_KEY="tu-api-key-de-sendgrid"
```

### 4. **Configurar base de datos**
```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones
npm run db:push

# Poblar con datos de ejemplo (opcional)
npm run db:seed
```

### 5. **Ejecutar en desarrollo**
```bash
npm run dev
```

🎉 **¡Listo!** La aplicación estará disponible en `http://localhost:3000`

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | 🚀 Ejecutar en modo desarrollo |
| `npm run build` | 🏗️ Construir para producción |
| `npm run start` | ▶️ Ejecutar en producción |
| `npm run lint` | 🔍 Ejecutar linter |
| `npm run type-check` | ✅ Verificar tipos TypeScript |
| `npm run db:generate` | 🔄 Generar cliente Prisma |
| `npm run db:push` | 📤 Aplicar cambios al esquema |
| `npm run db:migrate` | 🗄️ Crear y aplicar migraciones |
| `npm run db:studio` | 🎛️ Abrir Prisma Studio |
| `npm run db:seed` | 🌱 Poblar base de datos |

## 🏗️ Arquitectura del Proyecto

```
📁 ats-resume-builder/
├── 📁 prisma/
│   ├── 📄 schema.prisma          # Esquema de base de datos
│   └── 📄 seed.ts               # Datos de ejemplo
├── 📁 src/
│   ├── 📁 app/                  # App Router de Next.js 14
│   │   ├── 📁 api/              # API Routes
│   │   │   ├── 📁 ai/           # Endpoints de IA
│   │   │   ├── 📁 auth/         # Autenticación
│   │   │   ├── 📁 chatbot/      # Chatbot inteligente
│   │   │   └── 📁 cvs/          # Gestión de CVs
│   │   ├── 📁 auth/             # Páginas de autenticación
│   │   ├── 📁 dashboard/        # Dashboard principal
│   │   │   ├── 📁 ai/           # Herramientas de IA
│   │   │   ├── 📁 cvs/          # Gestión de CVs
│   │   │   │   └── 📁 builder/  # Constructor de CVs
│   │   │   └── 📁 templates/    # Plantillas
│   │   ├── 📄 globals.css       # Estilos globales
│   │   ├── 📄 layout.tsx        # Layout principal
│   │   └── 📄 page.tsx          # Página de inicio
│   ├── 📁 components/           # Componentes React
│   │   ├── 📁 auth/             # Componentes de autenticación
│   │   ├── 📁 chatbot/          # Chatbot UI
│   │   ├── 📁 cv-builder/       # Constructor de CVs
│   │   │   ├── 📁 steps/        # Pasos del formulario
│   │   │   └── 📁 cv-preview/   # Vista previa
│   │   ├── 📁 layout/           # Layouts y navegación
│   │   ├── 📁 templates/        # Plantillas de CV
│   │   └── 📁 ui/               # Componentes UI base
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 lib/                  # Utilidades y configuraciones
│   │   ├── 📁 ai/               # Servicios de IA
│   │   ├── 📁 chatbot/          # Base de conocimiento
│   │   └── 📁 template-engine/  # Motor de plantillas
│   ├── 📁 stores/               # Gestión de estado (Zustand)
│   └── 📁 types/                # Definiciones TypeScript
├── 📄 .env.example              # Variables de entorno ejemplo
├── 📄 next.config.js            # Configuración Next.js
├── 📄 tailwind.config.js        # Configuración Tailwind
└── 📄 tsconfig.json             # Configuración TypeScript
```

## 🛠️ Stack Tecnológico

### **Frontend**
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript 5.0
- **Estilos**: Tailwind CSS 3.4
- **Estado**: Zustand para gestión de estado
- **UI**: Componentes personalizados + Lucide Icons

### **Backend**
- **API**: Next.js API Routes
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js
- **Cache**: Redis (Upstash)
- **Validación**: Zod

### **Inteligencia Artificial**
- **Proveedor**: OpenAI (GPT-3.5-turbo/GPT-4)
- **Funciones**: Chatbot, generación de contenido, análisis ATS
- **Parsing**: Extracción de texto de PDFs

### **Servicios Externos**
- **Pagos**: Stripe
- **Email**: SendGrid
- **Almacenamiento**: Vercel Blob (opcional)

## 🎯 Estado del Proyecto

### ✅ **Completado (100%)**
- [x] **Configuración inicial** de Next.js 14 con TypeScript
- [x] **Base de datos** con Prisma y PostgreSQL
- [x] **Sistema de autenticación** con NextAuth.js
- [x] **CV Builder completo** con 12 secciones
- [x] **Chatbot inteligente** con OpenAI
- [x] **Plantillas profesionales** (8 diseños)
- [x] **Parsing de LinkedIn PDFs**
- [x] **Dashboard funcional** con todas las páginas
- [x] **Auto-guardado** y navegación inteligente
- [x] **Gestión de estado** con Zustand
- [x] **API endpoints** para todas las funcionalidades

### 🚧 **Próximas Mejoras**
- [ ] Exportación a PDF/Word
- [ ] Sistema de suscripciones completo
- [ ] Análisis ATS avanzado
- [ ] Integración con LinkedIn API
- [ ] Tests automatizados
- [ ] PWA (Progressive Web App)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. **Fork** el proyecto
2. **Crea** una rama para tu feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m 'feat: agregar nueva funcionalidad increíble'
   ```
4. **Push** a la rama:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. **Abre** un Pull Request

### 📝 Convenciones de Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nueva funcionalidad
- `fix:` corrección de bugs
- `docs:` documentación
- `style:` formato de código
- `refactor:` refactorización
- `test:` tests
- `chore:` tareas de mantenimiento

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**. Ver [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! ⭐**

Hecho con ❤️ por [Davidkm03](https://github.com/Davidkm03)

</div>