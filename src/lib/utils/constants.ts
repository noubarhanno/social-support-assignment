/**
 * Application constants and configuration values.
 */

// API Configuration
export const API_CONFIG = {
  OPENAI_API_URL: "https://api.openai.com/v1/chat/completions",
  REQUEST_TIMEOUT: 10000,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  WIZARD_PROGRESS: "northbay_wizard_progress",
} as const;

// Route Paths
export const ROUTES = {
  ROOT: "/",
  STEP1: "/step1",
  STEP2: "/step2",
  STEP3: "/step3",
  SUMMARY: "/summary",
} as const;

// Form Option Values - Gender
export const GENDER_OPTIONS = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
  PREFER_NOT_TO_SAY: "prefer-not-to-say",
} as const;

// Form Option Values - Marital Status
export const MARITAL_STATUS_OPTIONS = {
  SINGLE: "single",
  MARRIED: "married",
  DIVORCED: "divorced",
  WIDOWED: "widowed",
  SEPARATED: "separated",
} as const;

// Form Option Values - Employment Status
export const EMPLOYMENT_STATUS_OPTIONS = {
  EMPLOYED_FULL_TIME: "employed-full-time",
  EMPLOYED_PART_TIME: "employed-part-time",
  SELF_EMPLOYED: "self-employed",
  UNEMPLOYED: "unemployed",
  RETIRED: "retired",
  STUDENT: "student",
  DISABLED: "disabled",
} as const;

// Form Option Values - Housing Status
export const HOUSING_STATUS_OPTIONS = {
  OWNED: "owned",
  RENTED: "rented",
  LIVING_WITH_FAMILY: "living-with-family",
  HOMELESS: "homeless",
  TEMPORARY_HOUSING: "temporary-housing",
  OTHER: "other",
} as const;
