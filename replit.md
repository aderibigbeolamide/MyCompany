# TechNurture Company Website - Replit.md

## Overview

This is a full-stack web application for TechNurture, a technology solutions and training company. The application provides a professional company website showcasing services, academy programs, and enables client inquiries and student enrollments. It's built as a modern React-based single-page application with an Express.js backend and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom design system
- **Component Library**: Radix UI components with shadcn/ui styling
- **State Management**: TanStack React Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful JSON API
- **Middleware**: Standard Express middleware for JSON parsing and logging
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Data Storage Solutions
- **Database**: PostgreSQL (configured and active)
- **ORM**: Drizzle ORM with drizzle-kit for migrations
- **Schema**: Centralized schema definitions in shared directory
- **Validation**: Zod schemas for runtime validation
- **Storage**: DatabaseStorage class using PostgreSQL for all data persistence

## Key Components

### Database Schema
- **contacts**: Contact form submissions with service inquiries
- **enrollments**: Academy enrollment applications with course preferences
- **users**: User accounts with role-based access (admin/user)
- **blogPosts**: Blog content management with publishing workflow
- **dynamicForms**: Configurable forms for courses, hiring, events
- **formSubmissions**: Tracking of all dynamic form submissions

### API Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/contacts` - Retrieve all contacts (admin)
- `POST /api/enrollment` - Submit enrollment application
- `GET /api/enrollments` - Retrieve all enrollments (admin)
- `POST /api/blog` - Create blog post (admin)
- `GET /api/blog` - Retrieve blog posts with optional published filter
- `PUT /api/blog/:id` - Update blog post (admin)
- `DELETE /api/blog/:id` - Delete blog post (admin)
- `POST /api/forms` - Create dynamic form (admin)
- `GET /api/forms` - Retrieve forms with optional active filter
- `PUT /api/forms/:id` - Update dynamic form (admin)
- `DELETE /api/forms/:id` - Delete dynamic form (admin)
- `POST /api/forms/:id/submit` - Submit form response
- `GET /api/submissions` - Retrieve form submissions (admin)

### Frontend Pages
- **Home**: Hero section with service overview and call-to-actions
- **About**: Company mission, vision, and values
- **Services**: Detailed service offerings (web dev, AI, automation, mobile) with expanded tech stacks
- **Academy**: Training programs with enrollment functionality
- **Blog**: Resources and articles with dynamic content from backend
- **Contact**: Updated contact information (Abuja, Nigeria) and inquiry form
- **Admin Dashboard**: Content management hub for blog and forms
- **Admin Blog Management**: Create, edit, publish, and manage blog posts
- **Admin Form Builder**: Dynamic form creation for courses, hiring, events
- **Admin Submissions**: View and manage form submissions

### Shared Components
- **UI Components**: Complete set of accessible components using Radix UI
- **Forms**: Contact and enrollment forms with validation
- **Layout**: Responsive navigation and footer
- **Utilities**: WhatsApp integration button

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack React Query
2. **Form Submissions**: Forms are validated client-side with Zod, then sent to backend
3. **Data Processing**: Backend validates incoming data and stores in database
4. **Response Handling**: Success/error responses trigger UI updates and toast notifications
5. **State Management**: React Query handles caching and synchronization of server state

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation

### UI Framework
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Tools
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production
- **@replit/vite-plugin-***: Replit-specific development plugins

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle Kit handles schema migrations

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **REPL_ID**: Replit-specific environment detection

### Development Workflow
- **dev**: Start development server with hot reload
- **build**: Production build for both frontend and backend
- **start**: Run production server
- **db:push**: Apply database schema changes

### Production Considerations
- Database migrations handled through Drizzle Kit
- Static assets served from Express in production
- Environment-specific plugin loading for Replit integration
- Error boundary and logging for production debugging

## Recent Updates

### User-Friendly Website Enhancement (January 2025)
- Completely redesigned user experience with simple, everyday language throughout
- Enhanced homepage with clearer value proposition and user-focused messaging
- Improved contact form with helpful guidance, better field labels, and clearer instructions
- Updated service descriptions to focus on benefits rather than technical details
- Simplified navigation with user-friendly button text ("Get Started", "Start Your Project")
- Added helpful tooltips and guidance messages throughout the interface
- Created more intuitive mobile menu with clear call-to-action sections
- Enhanced WhatsApp integration with better messaging and tooltip guidance
- Updated About page with plain language explanations of company mission
- Improved Academy course descriptions to focus on real-world outcomes
- Made blog "Read More" buttons functional with proper navigation to detail pages
- Added helpful loading states, success messages, and error handling components

### Replit Migration Completed (January 2025)
- Successfully migrated project from Replit Agent to standard Replit environment
- Fixed database configuration to work with conditional storage (MemStorage when no DATABASE_URL)
- Updated all database imports to use dynamic imports preventing startup errors
- Implemented proper client/server separation with security practices
- Created default admin user (username: admin, password: admin123) for immediate access
- Enhanced admin login visibility with prominent button styling and lock icon
- Fixed PayloadTooLargeError by increasing request body limit to 100MB
- Resolved React uncontrolled input warnings in form components
- Configured Cloudinary integration with user credentials for media uploads
- Enhanced blog editor to extract and display existing images when editing posts
- Fixed image upload functionality - now properly displays uploaded images in blog content
- All functionality working: admin login at /admin/login, dashboard, blog management, form builder
- **Updated Company Branding (January 2025)**: Integrated new TechNurture logo in navbar and footer
- **WhatsApp Integration**: Updated contact number to +2348151163966 with "Chat with Us on WhatsApp" messaging
- **Enhanced SEO**: Added proper favicon, title, and meta description for better search visibility

### MongoDB Integration & Authentication Enhancement (January 2025)
- **Full MongoDB Migration**: Successfully connected to user's MongoDB Atlas database
- **Robust Authentication**: Implemented JWT-based authentication with automatic token management
- **Advanced Whitespace Handling**: Multi-layer whitespace trimming in login forms and server validation
- **Improved User Experience**: Real-time input sanitization prevents copy-paste issues
- **Production-Ready**: Secure admin access with proper session management and token storage
- **Database Stability**: Conditional storage loading prevents import errors and ensures failsafe operation

### Technology Stack Enhancement (January 2025)
- Expanded technology showcase across all service pages to reflect flexibility
- Updated web development stack to include Vue.js, Angular, Svelte, Python, PHP, and more
- Enhanced AI integration technologies with additional LLMs, frameworks, and vector databases
- Broadened business automation tools to include RPA, analytics, and enterprise platforms
- Emphasized technology selection based on project requirements rather than fixed stack

### Database Migration (January 2025)
- Migrated from in-memory storage to PostgreSQL database
- Created database connection using Neon serverless PostgreSQL
- Updated storage layer to use DatabaseStorage with full CRUD operations
- **MongoDB Migration**: Added MongoDB support with Mongoose ORM
- Implemented dual database support (PostgreSQL and MongoDB)
- Created MongoDB schemas and storage layer for cloud deployment
- All data now persists permanently in database tables (PostgreSQL or MongoDB)

### Security Enhancement (January 2025)
- **JWT Authentication**: Implemented dual-token JWT system (access + refresh tokens)
- **Advanced Encryption**: AES-256-GCM encryption for sensitive data
- **Rate Limiting**: Protection against brute force attacks and API abuse
- **Password Security**: Bcrypt hashing with strength validation
- **Security Headers**: Comprehensive CSRF, XSS, and clickjacking protection
- **Session Security**: HTTP-only, secure, SameSite cookies
- **Key Management**: Automatic secure key generation and rotation utilities
- **Audit Logging**: Comprehensive security event tracking
- **CORS Protection**: Configurable cross-origin request security
- **Production Ready**: Enterprise-grade security for cloud deployment

The application follows a monorepo structure with clear separation between client, server, and shared code, making it maintainable and scalable for future enhancements.