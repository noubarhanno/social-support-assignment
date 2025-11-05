import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  HOUSING_STATUS_OPTIONS,
} from "../utils/constants";
import {
  getSelectValidationMessage,
  getValidationMessage,
} from "../utils/validationMessages";

/**
 * Custom hook that provides validation schemas that are reactive to language changes
 * The schemas are recreated whenever the language changes, ensuring fresh translations
 */
export const useValidationSchemas = () => {
  const { i18n } = useTranslation();

  const PersonalInfoSchema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .min(1, getValidationMessage("nameRequired"))
          .min(2, getValidationMessage("nameMinLength"))
          .max(100, getValidationMessage("nameMaxLength"))
          .regex(
            /^[a-zA-Z\s\u0600-\u06FF]+$/,
            getValidationMessage("nameInvalidFormat")
          ),

        nationalId: z
          .string()
          .min(1, getValidationMessage("nationalIdRequired"))
          .min(7, getValidationMessage("nationalIdMinLength"))
          .max(20, getValidationMessage("nationalIdMaxLength"))
          .regex(
            /^[A-Za-z0-9]+$/,
            getValidationMessage("nationalIdInvalidFormat")
          ),

        dateOfBirth: z
          .string()
          .min(1, getValidationMessage("dateOfBirthRequired"))
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
          }, getValidationMessage("dateOfBirthInvalidAge")),

        gender: z
          .string()
          .refine(
            (value) =>
              [
                GENDER_OPTIONS.MALE,
                GENDER_OPTIONS.FEMALE,
                GENDER_OPTIONS.OTHER,
                GENDER_OPTIONS.PREFER_NOT_TO_SAY,
              ].includes(value as any),
            { message: getSelectValidationMessage("gender") }
          ),

        address: z
          .string()
          .min(1, getValidationMessage("addressRequired"))
          .min(10, getValidationMessage("addressMinLength"))
          .max(200, getValidationMessage("addressMaxLength")),

        country: z.string().min(1, getValidationMessage("countryRequired")),

        state: z.string().min(1, getValidationMessage("stateRequired")),

        city: z.string().min(1, getValidationMessage("cityRequired")),

        phoneNumber: z
          .string()
          .min(1, getValidationMessage("phoneRequired"))
          .regex(
            /^\+?[1-9]\d{1,14}$/,
            getValidationMessage("phoneInvalidFormat")
          ),

        email: z
          .string()
          .min(1, getValidationMessage("emailRequired"))
          .email(getValidationMessage("emailInvalidFormat"))
          .max(100, getValidationMessage("emailMaxLength")),
      }),
    [i18n.language]
  );

  const FamilyFinancialSchema = useMemo(
    () =>
      z.object({
        maritalStatus: z
          .string()
          .refine(
            (value) =>
              [
                MARITAL_STATUS_OPTIONS.SINGLE,
                MARITAL_STATUS_OPTIONS.MARRIED,
                MARITAL_STATUS_OPTIONS.DIVORCED,
                MARITAL_STATUS_OPTIONS.WIDOWED,
                MARITAL_STATUS_OPTIONS.SEPARATED,
              ].includes(value as any),
            { message: getSelectValidationMessage("maritalStatus") }
          ),

        dependents: z
          .string()
          .min(1, getValidationMessage("dependentsRequired"))
          .refine((value) => {
            const num = parseInt(value);
            return !isNaN(num) && num >= 0 && num <= 20;
          }, getValidationMessage("dependentsInvalidRange")),

        employmentStatus: z
          .string()
          .refine(
            (value) =>
              [
                EMPLOYMENT_STATUS_OPTIONS.EMPLOYED_FULL_TIME,
                EMPLOYMENT_STATUS_OPTIONS.EMPLOYED_PART_TIME,
                EMPLOYMENT_STATUS_OPTIONS.SELF_EMPLOYED,
                EMPLOYMENT_STATUS_OPTIONS.UNEMPLOYED,
                EMPLOYMENT_STATUS_OPTIONS.RETIRED,
                EMPLOYMENT_STATUS_OPTIONS.STUDENT,
                EMPLOYMENT_STATUS_OPTIONS.DISABLED,
              ].includes(value as any),
            { message: getSelectValidationMessage("employmentStatus") }
          ),

        monthlyIncome: z
          .string()
          .min(1, getValidationMessage("monthlyIncomeRequired"))
          .refine((value) => {
            const num = parseFloat(value);
            return !isNaN(num) && num >= 0 && num <= 1000000;
          }, getValidationMessage("monthlyIncomeInvalidRange")),

        housingStatus: z
          .string()
          .refine(
            (value) =>
              [
                HOUSING_STATUS_OPTIONS.OWNED,
                HOUSING_STATUS_OPTIONS.RENTED,
                HOUSING_STATUS_OPTIONS.LIVING_WITH_FAMILY,
                HOUSING_STATUS_OPTIONS.HOMELESS,
                HOUSING_STATUS_OPTIONS.TEMPORARY_HOUSING,
                HOUSING_STATUS_OPTIONS.OTHER,
              ].includes(value as any),
            { message: getSelectValidationMessage("housingStatus") }
          ),
      }),
    [i18n.language]
  );

  const SituationDescriptionsSchema = useMemo(
    () =>
      z.object({
        currentFinancialSituation: z
          .string()
          .min(10, getValidationMessage("financialSituationMinLength"))
          .max(1000, getValidationMessage("financialSituationMaxLength")),
        employmentCircumstances: z
          .string()
          .min(10, getValidationMessage("employmentCircumstancesMinLength"))
          .max(1000, getValidationMessage("employmentCircumstancesMaxLength")),
        reasonForApplying: z
          .string()
          .min(10, getValidationMessage("reasonForApplyingMinLength"))
          .max(1000, getValidationMessage("reasonForApplyingMaxLength")),
      }),
    [i18n.language]
  );

  return {
    PersonalInfoSchema,
    FamilyFinancialSchema,
    SituationDescriptionsSchema,
  };
};
