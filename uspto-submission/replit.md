# HealthHub - A Health Data Tracking Platform

## Overview

HealthHub is a web application designed to track and visualize health data from various connected devices and services. The application allows users to connect multiple health tracking devices (Apple Health, Fitbit, Google Fit, etc.), view their health metrics, get personalized insights, and manage privacy settings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

HealthHub is built using a modern full-stack JavaScript/TypeScript architecture with the following core components:

1. **Frontend**: React application with TypeScript using shadcn/ui component library
2. **Backend**: Express.js server with TypeScript
3. **Database**: PostgreSQL database with Drizzle ORM for database schema management
4. **Authentication**: Replit Auth integration for user authentication
5. **State Management**: React Query for server state management

The application follows a client-server architecture where:
- The client makes API requests to the server
- The server handles data processing, persistence, and third-party integrations
- The data is stored in a PostgreSQL database

## Key Components

### Frontend (Client)

1. **Component Structure**:
   - UI components using shadcn/ui (based on Radix UI)
   - Page components (Dashboard, Devices, Privacy)
   - Layout components for consistent UI structure
   - Health visualization components

2. **State Management**:
   - React Query for server state (data fetching, caching, updates)
   - React Hooks for local state
   - Context for application-wide state (authentication, theme)

3. **Styling**:
   - Tailwind CSS for styling
   - CSS variables for theming (light/dark modes)

### Backend (Server)

1. **API Routes**:
   - Authentication endpoints (`/api/auth/user`, `/api/login`)
   - Device management endpoints (`/api/devices`)
   - Health data endpoints (`/api/health-data/:type`)
   - Privacy settings endpoints (`/api/privacy-settings`)
   - Insights endpoints (`/api/insights`)

2. **Services**:
   - Authentication service (Replit Auth)
   - Storage service for database operations
   - Device integration services

3. **Database Access**:
   - Drizzle ORM for type-safe database access
   - Repository pattern for database operations

### Data Storage

1. **Database Schema**:
   - Users: Store user profile information
   - Devices: Connected health tracking devices
   - Health Data: Health metrics from connected devices
   - Insights: Generated insights based on health data
   - Privacy Settings: User privacy preferences
   - Sessions: Authentication session storage (for Replit Auth)

## Data Flow

1. **User Authentication**:
   - User logs in via Replit Auth
   - Session is created and stored in database
   - User profile is retrieved and displayed

2. **Device Connection**:
   - User adds a health tracking device
   - OAuth flow initiated for third-party services
   - Connection details stored in database

3. **Health Data Sync**:
   - Connected devices sync health data to the server
   - Data is processed, normalized, and stored
   - Insights are generated based on health data patterns

4. **Dashboard View**:
   - User views health metrics in the dashboard
   - Data is fetched from server API endpoints
   - Visualizations show progress, trends, and goals

5. **Privacy Management**:
   - User configures privacy settings
   - Settings determine what data is stored and shared
   - Changes are persisted to the database

## External Dependencies

### Frontend Dependencies

1. **UI Framework**:
   - React with TypeScript
   - Radix UI primitives via shadcn/ui

2. **State Management**:
   - @tanstack/react-query

3. **Routing**:
   - wouter (lightweight router)

4. **Form Handling**:
   - @hookform/resolvers with zod validation

5. **Visualization**:
   - recharts for data visualization

### Backend Dependencies

1. **Server Framework**:
   - Express.js

2. **Database**:
   - @neondatabase/serverless for PostgreSQL access
   - drizzle-orm for ORM capabilities
   - connect-pg-simple for session storage

3. **Authentication**:
   - openid-client and passport for Replit Auth

4. **Utilities**:
   - zod for validation

## Deployment Strategy

The application is deployed using Replit's deployment infrastructure:

1. **Development**:
   - Run with `npm run dev` which starts the development server
   - Vite provides hot-module reloading for frontend development

2. **Build**:
   - Frontend: Built with Vite
   - Backend: Bundled with esbuild
   - Combined in the `dist` directory

3. **Production**:
   - Run with `npm run start` which serves the built application
   - Static assets served by Express
   - API requests handled by Express routes

4. **Database**:
   - PostgreSQL database automatically provisioned by Replit
   - Connection string provided via environment variable

5. **Environment Variables**:
   - DATABASE_URL: PostgreSQL connection string
   - SESSION_SECRET: Secret for session encryption
   - REPL_ID and REPLIT_DOMAINS: Required for Replit Auth

## Development Workflow

1. **Setup Database**:
   - Run `npm run db:push` to apply schema changes to the database

2. **Development Server**:
   - Run `npm run dev` to start the development server

3. **Type Checking**:
   - Run `npm run check` to run TypeScript type checking

4. **Build for Production**:
   - Run `npm run build` to create the production build

5. **Starting Production Server**:
   - Run `npm run start` to start the production server