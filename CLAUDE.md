# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript project built with Vite, using shadcn/ui components and Tailwind CSS. The project appears to be a landing page for Stack Shift with various marketing components including pricing, testimonials, and CTAs.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server on port 8080
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Build Tool**: Vite
- **Framework**: React 18 with TypeScript
- **UI Components**: shadcn/ui (Radix UI based)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form with Zod validation

### Project Structure
- `/src/components/` - React components including marketing sections and shadcn/ui components
- `/src/components/ui/` - shadcn/ui component library
- `/src/pages/` - Page components (Index, NotFound)
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions

### Key Configuration
- TypeScript path alias: `@/*` maps to `./src/*`
- Development server runs on port 8080
- TypeScript is configured with relaxed settings (no implicit any, no unused parameters/locals checks)

### Important Components
- `App.tsx` - Main app component with routing setup
- `pages/Index.tsx` - Landing page with all marketing sections
- Various marketing components: Hero, Pricing, Testimonials, FAQ, etc.

## Special Considerations
- This project uses Lovable for deployment and development
- The `lovable-tagger` plugin is used in development mode for component tagging
- Relaxed TypeScript settings allow for more flexible development