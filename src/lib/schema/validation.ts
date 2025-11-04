import { z } from "zod";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  HOUSING_STATUS_OPTIONS,
} from "../utils/constants";

/**
 * Personal Information Form Validation Schema (Step 1)
 *
 * Comprehensive validation for personal information including:
 * - Required field validation
 * - Email format validation
 * - Phone number basic validation
 * - National ID format validation
 * - Date of birth constraints
 * - Enum validation for gender
 */
export const PersonalInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(
      /^[a-zA-Z\s\u0600-\u06FF]+$/,
      "Name can only contain letters and spaces"
    ),

  nationalId: z
    .string()
    .min(1, "National ID is required")
    .min(7, "National ID must be at least 7 characters")
    .max(20, "National ID must not exceed 20 characters")
    .regex(
      /^[A-Za-z0-9]+$/,
      "National ID can only contain letters and numbers"
    ),

  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const minAge = new Date(
        today.getFullYear() - 120,
        today.getMonth(),
        today.getDate()
      );
      const maxAge = new Date(
        today.getFullYear() - 13,
        today.getMonth(),
        today.getDate()
      );
      return birthDate >= minAge && birthDate <= maxAge;
    }, "You must be between 13 and 120 years old"),

  gender: z
    .enum([
      GENDER_OPTIONS.MALE,
      GENDER_OPTIONS.FEMALE,
      GENDER_OPTIONS.OTHER,
      GENDER_OPTIONS.PREFER_NOT_TO_SAY,
    ] as [string, ...string[]])
    .refine((value) => value !== "", "Please select your gender"),

  address: z
    .string()
    .min(1, "Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must not exceed 200 characters"),

  country: z.string().min(1, "Country is required"),

  state: z.string().min(1, "State/Province is required"),

  city: z.string().min(1, "City is required"),

  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Please enter a valid international phone number"
    ),

  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),
});

/**
 * Family & Financial Information Form Validation Schema (Step 2)
 *
 * Comprehensive validation for family and financial information including:
 * - Required field validation
 * - Numeric validation for dependents and income
 * - Enum validation for status fields
 * - Business logic constraints
 */
export const FamilyFinancialSchema = z.object({
  maritalStatus: z
    .enum([
      MARITAL_STATUS_OPTIONS.SINGLE,
      MARITAL_STATUS_OPTIONS.MARRIED,
      MARITAL_STATUS_OPTIONS.DIVORCED,
      MARITAL_STATUS_OPTIONS.WIDOWED,
      MARITAL_STATUS_OPTIONS.SEPARATED,
    ] as [string, ...string[]])
    .refine((value) => value !== "", "Please select your marital status"),

  dependents: z
    .string()
    .min(1, "Number of dependents is required")
    .refine((value) => {
      const num = parseInt(value);
      return !isNaN(num) && num >= 0 && num <= 20;
    }, "Number of dependents must be between 0 and 20"),

  employmentStatus: z
    .enum([
      EMPLOYMENT_STATUS_OPTIONS.EMPLOYED_FULL_TIME,
      EMPLOYMENT_STATUS_OPTIONS.EMPLOYED_PART_TIME,
      EMPLOYMENT_STATUS_OPTIONS.SELF_EMPLOYED,
      EMPLOYMENT_STATUS_OPTIONS.UNEMPLOYED,
      EMPLOYMENT_STATUS_OPTIONS.RETIRED,
      EMPLOYMENT_STATUS_OPTIONS.STUDENT,
      EMPLOYMENT_STATUS_OPTIONS.DISABLED,
    ] as [string, ...string[]])
    .refine((value) => value !== "", "Please select your employment status"),

  monthlyIncome: z
    .string()
    .min(1, "Monthly income is required")
    .refine((value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0 && num <= 1000000;
    }, "Monthly income must be between 0 and 1,000,000 AED"),

  housingStatus: z
    .enum([
      HOUSING_STATUS_OPTIONS.OWNED,
      HOUSING_STATUS_OPTIONS.RENTED,
      HOUSING_STATUS_OPTIONS.LIVING_WITH_FAMILY,
      HOUSING_STATUS_OPTIONS.HOMELESS,
      HOUSING_STATUS_OPTIONS.TEMPORARY_HOUSING,
      HOUSING_STATUS_OPTIONS.OTHER,
    ] as [string, ...string[]])
    .refine((value) => value !== "", "Please select your housing status"),
});

// Export TypeScript types from Zod schemas
export type PersonalInfoFormData = z.infer<typeof PersonalInfoSchema>;
export type FamilyFinancialFormData = z.infer<typeof FamilyFinancialSchema>;
