/**
 * Application constants and configuration values.
 */

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

/**
 * Generates a unique application number with timestamp and random digits.
 * Format: NB-YYYYMMDD-XXXX (NB + date + 4 random digits)
 */
export const generateApplicationNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

  return `NJ-${year}${month}${day}-${random}`;
};

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

// Storage Keys - LocalStorage keys used throughout the application
export const STORAGE_KEYS = {
  /** Main wizard form data storage key */
  WIZARD_DATA: "wizard-form-data",
  /** Wizard progress tracking key */
  WIZARD_PROGRESS: "wizard-progress",
} as const;
