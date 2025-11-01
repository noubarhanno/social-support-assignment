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
