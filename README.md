# NorthBay Social Support Application

React + TypeScript + Vite application implementing a 3-step wizard form for a social support portal.

## Tech Stack

- **Framework:** React + TypeScript (Vite)
- **Routing:** `react-router-dom` with lazy loading
- **Forms:** `react-hook-form` with validation
- **HTTP Client:** `axios` with interceptors
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Build Tool:** Vite
- **Testing:** Jest + React Testing Library

## Quick Start

```bash
npm install      # Install dependencies
npm run dev      # Development server
npm test         # Run tests
npm run build    # Build for production
```

## Project Structure

```
src/
├── app/                    # App setup, routes, providers
├── components/             # Atomic Design structure
│   ├── atoms/             # Basic UI elements
│   ├── molecules/         # Form components (FormInput, FormSelect, FormCountrySelect)
│   ├── organisms/         # Complex components (PersonalInfoFormElements)
│   └── templates/         # Page layouts (Template, WizardFormController)
├── lib/
│   ├── api/              # API integrations (countries, states)
│   ├── http/             # HTTP client with error handling
│   ├── hooks/            # Custom hooks (useWizardStep, useRTL)
│   └── utils/            # Helper functions and storage
└── tests/                # Jest + RTL test suites
```

## Form Architecture

### Atomic Design with Smart Dependencies

**Design Principles:**

- **Separation of Concerns:** Molecules handle UI/validation, organisms manage complex interactions
- **Reusability:** Components work across any form with minimal props
- **Smart Dependencies:** Automatic country→state→city cascading with API integration
- **Accessibility:** ARIA roles, keyboard navigation, screen reader support

**Usage Example:**

```tsx
<FormProvider {...methods}>
  <PersonalInfoFormElements />
</FormProvider>
```

### Form Components

**FormInput:** Basic text inputs with validation
**FormSelect:** Dropdown selects with loading states
**FormCountrySelect:** Country selector with flags and search
**FormPhoneInput:** International phone input with validation
**FormDate:** Calendar picker with dropdown navigation (1900-2030)

## API Integration

### Countries & States API

**Service:** Country State City API (countriesnow.space) - Free service providing countries and states data

**Limitations:**
This free service provides data in English only. For production applications requiring localized country/state names in multiple languages (Arabic, French, etc.), consider upgrading to a premium geolocation service that offers internationalization support.

**API Endpoints:**

- `GET /countries/positions` - All countries with basic info
- `POST /countries/states` - States for specific country

**Performance:**

- Memoized expensive operations (filtering, sorting)
- Data fetching moved to form level (not molecule components)
- Efficient re-renders with proper dependency arrays

## Enhanced Features

### Tailwind CSS v4 Configuration

**Theme Setup:**

```css
@theme {
  --color-primary: #b68a35; /* UAE Gold */
  --color-secondary: #2563eb; /* Tech Blue */
}
```

### Wizard Navigation

**Features:**

- Automatic progress tracking using generator functions
- RTL support for Arabic
- Responsive design (mobile-first)

**Components:**

- `useWizardStep` hook for navigation
- `WizardProgress` with step indicators
- `Template` component with header and layout

### Internationalization

**Languages:** English (LTR) + Arabic (RTL)
**Features:**

- Automatic direction detection
- Language persistence in localStorage
- Proper RTL layout support
- Cultural date/number formatting

## Testing Strategy

**Coverage:** Focused on critical business logic (40-50% coverage)
**Approach:** Integration tests over unit tests
**Tools:** Jest + React Testing Library

**Test Suites:**

- Form Phone Input
- Wizard navigation flow
- RTL Custom Hook
- Storage utilities

## Available Routes

- `/` → `/step1` (redirect)
- `/step1` - Personal information form
- `/step2` - Additional details
- `/step3` - AI-assisted writing
- `/summary` - Form submission results

## Development Notes

**Performance Optimizations:**

- Memoized expensive country filtering operations
- Efficient useEffect dependency arrays

**Architecture Decisions:**

- Molecules receive data as props (no internal fetching)
- Organisms, templates and pages handle all API calls and state management
- Clear separation between UI and business logic
- Atomic Design principles throughout
