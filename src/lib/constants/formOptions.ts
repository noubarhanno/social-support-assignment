/**
 * Form select options constants
 * Centralized constants for all form dropdown options
 * 
 * NOTE: These form options (marital status, employment status, housing status) 
 * are intentionally kept as static constants as they rarely change.
 * However, if your application needs dynamic options or multi-tenant support,
 * consider moving these to a configuration API.
 */

import type { SelectOption } from "./states";

/**
 * Marital Status Options
 */
export const MARITAL_STATUS_OPTIONS = {
  SINGLE: "single",
  MARRIED: "married",
  DIVORCED: "divorced",
  WIDOWED: "widowed",
  SEPARATED: "separated",
} as const;

/**
 * Employment Status Options
 */
export const EMPLOYMENT_STATUS_OPTIONS = {
  EMPLOYED_FULL_TIME: "employed-full-time",
  EMPLOYED_PART_TIME: "employed-part-time",
  SELF_EMPLOYED: "self-employed",
  UNEMPLOYED: "unemployed",
  RETIRED: "retired",
  STUDENT: "student",
  DISABLED: "disabled",
} as const;

/**
 * Housing Status Options
 */
export const HOUSING_STATUS_OPTIONS = {
  OWNED: "owned",
  RENTED: "rented",
  LIVING_WITH_FAMILY: "living-with-family",
  HOMELESS: "homeless",
  TEMPORARY_HOUSING: "temporary-housing",
  OTHER: "other",
} as const;

/**
 * Get marital status select options with translations
 * @param t - Translation function
 */
export function getMaritalStatusOptions(
  t: (key: string) => string
): SelectOption[] {
  return [
    {
      value: MARITAL_STATUS_OPTIONS.SINGLE,
      label: t("forms.familyFinancial.maritalStatusOptions.single"),
    },
    {
      value: MARITAL_STATUS_OPTIONS.MARRIED,
      label: t("forms.familyFinancial.maritalStatusOptions.married"),
    },
    {
      value: MARITAL_STATUS_OPTIONS.DIVORCED,
      label: t("forms.familyFinancial.maritalStatusOptions.divorced"),
    },
    {
      value: MARITAL_STATUS_OPTIONS.WIDOWED,
      label: t("forms.familyFinancial.maritalStatusOptions.widowed"),
    },
    {
      value: MARITAL_STATUS_OPTIONS.SEPARATED,
      label: t("forms.familyFinancial.maritalStatusOptions.separated"),
    },
  ];
}

/**
 * Get employment status select options with translations
 * @param t - Translation function
 */
export function getEmploymentStatusOptions(
  t: (key: string) => string
): SelectOption[] {
  return [
    {
      value: EMPLOYMENT_STATUS_OPTIONS.EMPLOYED_FULL_TIME,
      label: t(
        "forms.familyFinancial.employmentStatusOptions.employedFullTime"
      ),
    },
    {
      value: EMPLOYMENT_STATUS_OPTIONS.EMPLOYED_PART_TIME,
      label: t(
        "forms.familyFinancial.employmentStatusOptions.employedPartTime"
      ),
    },
    {
      value: EMPLOYMENT_STATUS_OPTIONS.SELF_EMPLOYED,
      label: t("forms.familyFinancial.employmentStatusOptions.selfEmployed"),
    },
    {
      value: EMPLOYMENT_STATUS_OPTIONS.UNEMPLOYED,
      label: t("forms.familyFinancial.employmentStatusOptions.unemployed"),
    },
    {
      value: EMPLOYMENT_STATUS_OPTIONS.RETIRED,
      label: t("forms.familyFinancial.employmentStatusOptions.retired"),
    },
    {
      value: EMPLOYMENT_STATUS_OPTIONS.STUDENT,
      label: t("forms.familyFinancial.employmentStatusOptions.student"),
    },
    {
      value: EMPLOYMENT_STATUS_OPTIONS.DISABLED,
      label: t("forms.familyFinancial.employmentStatusOptions.disabled"),
    },
  ];
}

/**
 * Get housing status select options with translations
 * @param t - Translation function
 */
export function getHousingStatusOptions(
  t: (key: string) => string
): SelectOption[] {
  return [
    {
      value: HOUSING_STATUS_OPTIONS.OWNED,
      label: t("forms.familyFinancial.housingStatusOptions.owned"),
    },
    {
      value: HOUSING_STATUS_OPTIONS.RENTED,
      label: t("forms.familyFinancial.housingStatusOptions.rented"),
    },
    {
      value: HOUSING_STATUS_OPTIONS.LIVING_WITH_FAMILY,
      label: t("forms.familyFinancial.housingStatusOptions.livingWithFamily"),
    },
    {
      value: HOUSING_STATUS_OPTIONS.HOMELESS,
      label: t("forms.familyFinancial.housingStatusOptions.homeless"),
    },
    {
      value: HOUSING_STATUS_OPTIONS.TEMPORARY_HOUSING,
      label: t("forms.familyFinancial.housingStatusOptions.temporaryHousing"),
    },
    {
      value: HOUSING_STATUS_OPTIONS.OTHER,
      label: t("forms.familyFinancial.housingStatusOptions.other"),
    },
  ];
}
