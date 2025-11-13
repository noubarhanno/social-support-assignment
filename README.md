# Social Support Application

## Tech Stack

- **Framework:** React 19 + TypeScript (Vite)
- **Forms:** `react-hook-form` with Zod validation
- **HTTP Client:** `axios` with authentication interceptors
- **State Management:** React Context API with useReducer pattern
- **Routing:** `react-router-dom` with lazy loading
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Internationalization:** Custom i18n with RTL/LTR support
- **Storage:** localStorage with error handling and persistence
- **Testing:** Jest + React Testing Library
- **Build Tool:** Vite with TypeScript configuration

## Available Scripts

```bash
npm install      # Install dependencies
npm run dev      # Start development server (localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm test         # Run test suite
npm run lint     # Run ESLint
```

## Getting Started

### Environment Setup

The application uses a layered environment configuration system:

1. **`.env`** - Contains default OpenAI configuration (already included in project)
2. **`.env.local`** - Contains your sensitive API key (you need to create this)
3. **`.env.example`** - Template file showing required variables

**Setup Steps:**

```bash
# 1. Clone and install
git clone <repository-url>
cd social-support-assignment
npm install

# 2. Set up environment variables
cp .env.example .env.local

# 3. Add your OpenAI API key to .env.local
echo "VITE_OPENAI_API_KEY=your-actual-api-key-here" >> .env.local

# 4. Start development server
npm run dev
```

**Environment File Structure:**

```bash
# .env (default settings - already included)
VITE_OPENAI_MODEL=gpt-3.5-turbo
VITE_OPENAI_MAX_TOKENS=1000
VITE_OPENAI_TEMPERATURE=0.7

# .env.local (create this with your API key)
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key

# Optional: Override defaults in .env.local
# VITE_OPENAI_MODEL=gpt-4
# VITE_OPENAI_MAX_TOKENS=2000
```

> **Security Note:** The `.env.local` file is gitignored and contains sensitive data. Never commit API keys to version control.

### OpenAI API Key Setup

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file as shown above
4. Ensure you have sufficient credits in your OpenAI account

## Architecture

### Project Structure

```
src/
├── app/                    # Application configuration and providers
├── assets/                # Static assets (images, icons, etc.)
├── components/             # Atomic Design structure
│   ├── atoms/             # Basic UI elements (buttons, inputs, icons)
│   ├── molecules/         # Composed form components with validation
│   ├── organisms/         # Complex form sections and layouts
│   ├── pages/             # Page components (Step1, Step2, Step3, Summary)
│   └── templates/         # Page templates and layout wrappers
├── lib/
│   ├── api/              # API services and endpoint definitions
│   ├── config/           # Configuration files
│   ├── contexts/         # React Context providers and state management
│   ├── generators/       # JavaScript generators for wizard flow control
│   ├── hooks/            # Custom hooks for reusable logic
│   ├── http/             # HTTP client with interceptors and error handling
│   ├── i18n/             # Internationalization setup
│   ├── schema/           # Zod validation schemas and type definitions
│   ├── services/         # Business logic services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions, storage, and constants
└── tests/                # Test suites with comprehensive coverage
```

### Design Patterns

**Atomic Design Pattern:** Components are organized in a hierarchical structure from simple atoms to complex templates, promoting reusability and maintainability.

**Context + Reducer Pattern:** State management using React Context API combined with useReducer for predictable state updates and centralized control.

**Generator Pattern:** JavaScript generators control wizard flow, providing stateful iteration through form steps with automatic persistence and recovery.

## Key Features

### Generator-Powered Wizard Flow

The application uses JavaScript generators to manage wizard progression, providing a stateful and resumable flow control mechanism.

**Implementation:**

```tsx
/**
 * Wizard flow generator manages step progression and data persistence
 */
function* wizardFlowGenerator() {
  yield { step: 1, title: "Personal Information" };
  yield { step: 2, title: "Family & Financial" };
  yield { step: 3, title: "Situation Description" };
  return { step: "summary", title: "Complete" };
}

// Usage in components
const { getWizardGenerator, saveStepData } = useWizard();
const generator = getWizardGenerator();
const nextStep = generator.next(currentFormData);
```

**Benefits:**

- **Stateful Navigation:** Generator maintains internal state between steps
- **Data Persistence:** Automatic localStorage integration for progress recovery
- **Flexible Flow:** Easy to modify wizard steps and add conditional branching
- **Memory Efficient:** Lazy evaluation of steps reduces memory footprint

### Wizard Flow Guard & URL Navigation Protection

The application implements a comprehensive flow protection system that prevents users from accessing incomplete steps via direct URL navigation.

**Implementation:**

```tsx
/**
 * Custom hook managing step completion state and URL restrictions
 */
const { markStepCompleted, canAccessRoute, redirectToAppropriateStep } =
  useWizardFlowGuard();

// Mark step as completed when form is successfully submitted
const handleSubmit = async (formData) => {
  const success = await submitStep(formData);
  if (success) {
    markStepCompleted(currentStep); // Only mark completed on successful submission
    navigate("/next-step");
  }
};
```

**Features:**

- **Completion Tracking:** Each step stores `isCompleted` flag in localStorage with timestamp
- **URL Protection:** Direct navigation to `/step2` redirects to `/step1` if step 1 incomplete
- **Progressive Access:** Users can only access the next incomplete step or previously completed steps
- **Step Invalidation:** Automatically marks steps incomplete when users modify them after completion
- **Application Number Security:** Summary page only generates application number after proper completion flow
- **Reset Functionality:** New application clears all completion states

**Flow Logic:**

1. **Step 1** → Always accessible (entry point)
2. **Step 2** → Only if Step 1 completed via form submission
3. **Step 3** → Only if Steps 1-2 completed via form submission
4. **Summary** → Only if all steps (1-3) completed via proper flow

**Storage Structure:**

```json
{
  "wizard-form-data": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "isCompleted": true,
      "completedAt": "2024-01-15T10:30:00.000Z"
    },
    "professionalInfo": {
      "maritalStatus": "single",
      "monthlyIncome": "50000",
      "isCompleted": false
    },
    "additionalInfo": {
      "currentFinancialSituation": "Need assistance with...",
      "isCompleted": false
    }
  }
}
```

### HTTP Client with Authentication Interceptors

Centralized HTTP client built on axios with comprehensive error handling and authentication management.

**Features:**

```tsx
// HTTP client with interceptors
const httpClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Response interceptor for 401 handling
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication state
      // Redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);
```

**Authentication Handling:**

- **401 Detection:** Automatic detection of authentication failures
- **Token Management:** Centralized token refresh and storage
- **Error Recovery:** Graceful handling of expired sessions
- **Request Queuing:** Pending requests during token refresh

### React Hook Form Integration with Organisms

Full-stitched form architecture using react-hook-form with organisms managing complex form sections.

**Form Element Architecture:**

```tsx
// Organism component managing form section
export const PersonalInfoFormElements: React.FC = () => {
  const { watch } = useFormContext();
  const selectedCountry = watch("country");

  return (
    <div className="space-y-6">
      <FormCountrySelect name="country" />
      <FormStateSelect
        name="state"
        countryCode={selectedCountry?.code}
        disabled={!selectedCountry}
      />
      <FormPhoneInput name="phone" />
    </div>
  );
};
```

**Design Principles:**

- **Separation of Concerns:** Molecules handle UI/validation, organisms manage interactions
- **Smart Dependencies:** Automatic cascading updates (country → state → city)
- **Form Context:** Shared form state using React Hook Form's FormProvider
- **Validation Integration:** Zod schemas with runtime type checking
- **Accessibility:** ARIA roles, keyboard navigation, screen reader support

**Form Component Hierarchy:**

- **Atoms:** Basic inputs, buttons, labels
- **Molecules:** FormInput, FormSelect, FormCountrySelect with validation
- **Organisms:** Complete form sections with business logic
- **Templates:** Page layouts wrapping multiple organisms

### Localization & Internationalization

Comprehensive i18n implementation supporting multiple languages with RTL/LTR layout adaptation.

**Features:**

```tsx
// i18n implementation
const i18n = {
  language: "en", // or 'ar'
  dir: "ltr", // or 'rtl'
  translate: (key: string) => translations[language][key],
};

// RTL-aware component styling
const direction = i18n.language === "ar" ? "rtl" : "ltr";
const flexDirection = i18n.language === "ar" ? "flex-row-reverse" : "flex-row";
```

**Approach:**

- **Language Detection:** Automatic browser language detection with localStorage persistence
- **RTL Support:** Dynamic layout switching for Arabic with proper text alignment
- **Translation Keys:** Structured translation files with nested object organization
- **Cultural Adaptation:** Date formatting, number formats, and currency display
- **Component-Level:** Each component handles its own localization context

**Storage Integration:**

- **Persistence:** Language preference saved to localStorage
- **Recovery:** Automatic language restoration on app reload
- **Fallback:** Default to English if saved language unavailable

### Context & Storage for Data Persistence

Robust state management combining React Context with localStorage for seamless data persistence.

**ConfigContext Implementation:**

```tsx
// Context with reducer pattern
const ConfigContext = createContext<ConfigContextType | null>(null);

interface ConfigState {
  currentStep: number;
  completedSteps: number[];
  formData: Record<string, any>;
  language: "en" | "ar";
}

// Automatic persistence
const configReducer = (state: ConfigState, action: ConfigAction) => {
  const newState = { ...state, ...action.payload };
  saveToStorage("wizardConfig", newState); // Auto-save
  return newState;
};
```

**Storage Strategy:**

- **Automatic Persistence:** Every state change automatically saved to localStorage
- **Error Handling:** Graceful fallback when localStorage unavailable or corrupted
- **Data Recovery:** Complete wizard state restoration on page reload
- **Multiple Keys:** Separate storage for different data types (config, form data, progress)

**Benefits:**

- **Seamless UX:** Users can close browser and resume exactly where they left off
- **Data Integrity:** Validation ensures stored data remains consistent
- **Performance:** Minimal overhead with efficient serialization/deserialization
- **Privacy:** All data stored locally, no server-side session management required

## API Integration

### OpenAI API Layer

**Implementation:** Comprehensive OpenAI integration with streaming support, proper error handling, and secure environment configuration.

**Features:**

```tsx
// Environment Configuration
// Default settings are provided in .env
// Your API key should be in .env.local (create from .env.example)

// .env (default configuration - already included)
VITE_OPENAI_MODEL = gpt - 3.5 - turbo;
VITE_OPENAI_MAX_TOKENS = 1000;
VITE_OPENAI_TEMPERATURE = 0.7;

// .env.local (create this file with your API key)
VITE_OPENAI_API_KEY = your - actual - api - key - here;

// Using the AI hook
import { useAI } from "@/lib/hooks/useAI";

const MyComponent = () => {
  const { generateStreaming, response, isStreaming, error, cancel } = useAI();

  const handleAIAssist = async () => {
    await generateStreaming({
      prompt: "Help me write a professional summary",
      context: currentFieldValue,
    });
  };

  return (
    <div>
      <button onClick={handleAIAssist}>Get AI Suggestions</button>
      {isStreaming && <div>Generating...</div>}
      {response && <div>{response}</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};
```

**AI Service Architecture:**

- **Streaming Support:** Real-time response streaming with chunked processing
- **Error Handling:** Comprehensive error mapping for different OpenAI API issues
- **Rate Limiting:** Built-in handling for API rate limits with retry mechanisms
- **Secure Configuration:** Environment-based API key management with validation
- **Multi-language:** Arabic and English prompts with contextual assistance
- **Form Integration:** Specialized prompts for different form field types

**Error Handling:**

- **Network Issues:** Automatic retry with exponential backoff
- **Authentication:** Clear error messages for invalid API keys
- **Rate Limiting:** Graceful handling with retry-after headers
- **Streaming Errors:** Robust stream processing with fallback mechanisms

### Countries & States Service

**Implementation:** Centralized API service with proper error handling and caching for geographical data.

**Features:**

- **Memoized Operations:** Expensive filtering and sorting operations cached for performance
- **Error Recovery:** Graceful fallback when API services unavailable
- **Smart Loading:** Component-level loading states for better UX
- **Data Transformation:** Consistent data format across different API responses

**Performance Optimizations:**

- Data fetching moved to organism level (not molecule components)
- Efficient re-renders with proper dependency arrays
- Lazy loading of state/city data based on user selections

### Form Validation with Zod

Type-safe validation schemas ensuring data integrity and providing excellent developer experience.

**Schema Architecture:**

```tsx
// Type-safe validation with Zod
const PersonalInfoSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  dateOfBirth: z
    .date()
    .refine((date) => differenceInYears(new Date(), date) >= 18),
  country: z.object({
    name: z.string(),
    code: z.string(),
  }),
});

type PersonalInfoForm = z.infer<typeof PersonalInfoSchema>;
```

**Benefits:**

- **Runtime Validation:** Comprehensive type checking at form submission
- **TypeScript Integration:** Automatic type inference for form data
- **Custom Validation:** Business logic rules (age constraints, format validation)
- **Error Messages:** Localized and meaningful validation feedback

## Testing Strategy

**Philosophy:** Integration tests over unit tests, focusing on critical business logic and user interactions.

**Coverage Areas:**

```bash
# Core business logic tests
- Wizard generator flow and state transitions
- Form validation with Zod schemas
- Storage utilities and localStorage persistence
- Context state management and reducers
- HTTP client interceptors and error handling
- Internationalization and RTL functionality
```

**Testing Tools:**

- **Jest:** Test runner with comprehensive mocking capabilities
- **React Testing Library:** Component testing with user-centric approach
- **MSW (Mock Service Worker):** API mocking for integration tests
- **Custom Utilities:** Helper functions for common testing scenarios

**Test Philosophy:**

- Test behavior, not implementation details
- Focus on user interactions and business logic
- Mock external dependencies (APIs, localStorage)
- Comprehensive error scenario coverage

## Development Architecture

### Performance Optimizations

- **Memoized Operations:** Expensive filtering and sorting cached appropriately
- **Efficient Dependencies:** Proper useEffect dependency arrays prevent unnecessary re-renders
- **Lazy Loading:** Route-based code splitting with React.lazy()
- **Component Optimization:** Strategic use of React.memo for expensive components

### Architecture Decisions

- **Clear Separation:** UI components separated from business logic
- **Data Flow:** Unidirectional data flow with Context + Reducer pattern
- **API Strategy:** Organisms and pages handle data fetching, molecules remain pure
- **Error Boundaries:** Comprehensive error handling at multiple application levels
- **TypeScript:** Strict type checking throughout the application
- **Atomic Design:** Consistent component hierarchy promoting reusability

### Code Organization

- **Feature-Based:** Related functionality grouped together
- **Shared Utilities:** Common functions centralized in utils directory
- **Type Safety:** Comprehensive TypeScript coverage with strict configuration
- **Documentation:** JSDoc comments for complex business logic and utilities
