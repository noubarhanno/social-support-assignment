# NorthBay Social Support Application

A React + TypeScript + Vite application implementing a 3-step wizard form for a social support portal with OpenAI GPT API integration.

## Tech Stack

- **Framework:** React + TypeScript (Vite template)
- **Routing:** `react-router-dom` with lazy loading
- **Forms:** `react-hook-form` (installed, ready to use)
- **HTTP Client:** `axios` with interceptors
- **Styling:** Tailwind CSS + PostCSS
- **Build Tool:** Vite
- **Linting:** ESLint

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Development server:**

   ```bash
   npm run dev
   ```

3. **Type checking:**

   ```bash
   npm run type-check
   ```

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Run tests:**
   ```bash
   npm test                 # Run all tests
   npm run test:watch       # Run tests in watch mode
   npm run test:coverage    # Run tests with coverage report
   ```

## Project Structure

```
src/
├── app/                    # Root app setup, routes, providers
│   ├── AppRouter.tsx       # Route definitions with lazy loading
│   └── ErrorBoundary.tsx   # Global error boundary
├── components/             # Atomic Design structure
│   ├── atoms/
│   │   └── Loading.tsx     # Loading spinner component
│   ├── molecules/          # Ready for form components
│   ├── organisms/          # Ready for complex components
│   └── templates/          # Ready for page layouts
├── pages/                  # Wizard pages
│   ├── Step1.tsx          # First wizard step
│   ├── Step2.tsx          # Second wizard step
│   ├── Step3.tsx          # Third wizard step (with AI)
│   └── Summary.tsx        # Results summary page
├── lib/
│   ├── api/               # API endpoints (ready)
│   ├── http/              # Axios HTTP client with interceptors
│   ├── schema/            # Validation schemas (ready)
│   ├── services/          # Business logic services (ready)
│   ├── contexts/          # Context + reducer setup (ready)
│   ├── hooks/             # Custom hooks (ready)
│   └── utils/             # Helper functions and constants
├── styles/                # Custom styles (ready)
└── tests/                 # Jest + RTL tests (ready)
```

## Current Implementation

### ✅ **Completed Features:**

- TypeScript + React Router with lazy loading
- Tailwind CSS + Atomic Design folder structure
- HTTP client with error handling
- Storage utilities (100% test coverage)
- Testing environment (Jest + RTL)

## Next Steps

1. Form implementation with react-hook-form and validation schemas
2. Context API + reducer for global state management
3. OpenAI GPT API integration for AI-assisted writing
4. shadcn/ui components integration
5. Internationalization support (English + Arabic RTL)

## Testing

Jest + React Testing Library setup with TypeScript support. Storage utilities have 96% test coverage with 8 focused test cases.

**Test Commands:**

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

## Available Routes

- `/` - Redirects to Step 1
- `/step1` - First wizard step
- `/step2` - Second wizard step
- `/step3` - Third wizard step (AI integration)
- `/summary` - Form submission summary
- Any other route redirects to Step 1
