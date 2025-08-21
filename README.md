# ATS Resume Builder

Una aplicación web moderna para crear hojas de vida optimizadas para sistemas ATS (Applicant Tracking Systems) con inteligencia artificial.

## Características

- ✅ **Next.js 14** con App Router y TypeScript
- ✅ **Tailwind CSS** para estilos modernos y responsivos
- ✅ **Prisma ORM** con PostgreSQL
- ✅ **NextAuth.js** para autenticación
- ✅ **Integración con OpenAI** para sugerencias de IA
- ✅ **Sistema de suscripciones** con Stripe
- ✅ **Exportación múltiple** (PDF, Word, TXT)
- ✅ **Análisis ATS** en tiempo real

## Requisitos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd ats-resume-builder
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Edita `.env.local` con tus configuraciones:
   - `DATABASE_URL`: URL de conexión a PostgreSQL
   - `NEXTAUTH_SECRET`: Clave secreta para NextAuth
   - `OPENAI_API_KEY`: API key de OpenAI (opcional)
   - `STRIPE_SECRET_KEY`: Clave secreta de Stripe (opcional)

4. **Configurar base de datos**
   ```bash
   # Generar cliente Prisma
   npm run db:generate
   
   # Aplicar migraciones
   npm run db:push
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Ejecutar en producción
- `npm run lint` - Ejecutar linter
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Aplicar cambios al esquema
- `npm run db:migrate` - Crear y aplicar migraciones
- `npm run db:studio` - Abrir Prisma Studio

## Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── api/            # API Routes
│   ├── globals.css     # Estilos globales
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Página de inicio
├── components/         # Componentes React
├── lib/               # Utilidades y configuraciones
├── types/             # Definiciones de tipos TypeScript
└── hooks/             # Custom hooks
prisma/
├── schema.prisma      # Esquema de base de datos
└── migrations/        # Migraciones de DB
```

## Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe
- **IA**: OpenAI GPT-4
- **Email**: SendGrid
- **Cache**: Redis (Upstash)

## Estado del Proyecto

Este proyecto está en desarrollo activo. La migración desde la versión HTML/JS original a Next.js 14 ha sido completada exitosamente.

### Completado ✅
- [x] Configuración inicial de Next.js 14
- [x] Configuración de TypeScript y Tailwind CSS
- [x] Esquema de base de datos con Prisma
- [x] Estructura de archivos y configuraciones
- [x] Variables de entorno y configuración de desarrollo

### Próximos Pasos 🚧
- [ ] Implementar sistema de autenticación
- [ ] Migrar funcionalidad del CV builder
- [ ] Integrar servicios de IA
- [ ] Implementar sistema de pagos
- [ ] Añadir exportación de documentos

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.