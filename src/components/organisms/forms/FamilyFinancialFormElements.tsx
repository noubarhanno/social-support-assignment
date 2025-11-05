import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../molecules/FormInput";
import { FormSelect, type SelectOption } from "../../molecules/FormSelect";
import {
  MARITAL_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  HOUSING_STATUS_OPTIONS,
} from "../../../lib/utils/constants";

// Form data structure is now defined in the validation schema
import type { FamilyFinancialFormData } from "../../../lib/schema/validation";

/**
 * FamilyFinancialFormElements organism component
 *
 * A comprehensive form for collecting family and financial information.
 * Must be wrapped with FormProvider from react-hook-form.
 *
 * Features:
 * - Full accessibility with ARIA roles and keyboard navigation
 * - Comprehensive validation for all fields
 * - Error handling with user feedback
 * - Consistent styling with PersonalInfoFormElements
 *
 * Form Fields:
 * - Marital Status (select dropdown)
 * - Number of Dependents (numeric input)
 * - Employment Status (select dropdown)
 * - Monthly Income (numeric input)
 * - Housing Status (select dropdown)
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <FamilyFinancialFormElements />
 * </FormProvider>
 * ```
 */
export const FamilyFinancialFormElements: React.FC = () => {
  const { t, i18n } = useTranslation();
  const formContext = useFormContext<FamilyFinancialFormData>();

  if (!formContext) {
    throw new Error(
      "FamilyFinancialFormElements must be used within a FormProvider from react-hook-form"
    );
  }

  // Memoized marital status options for performance
  const maritalStatusOptions: SelectOption[] = useMemo(
    () => [
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
    ],
    [t]
  );

  // Memoized employment status options for performance
  const employmentStatusOptions: SelectOption[] = useMemo(
    () => [
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
    ],
    [t]
  );

  // Memoized housing status options for performance
  const housingStatusOptions: SelectOption[] = useMemo(
    () => [
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
    ],
    [t]
  );

  return (
    <div
      className="space-y-6"
      role="form"
      aria-label={t("forms.familyFinancial.title")}
    >
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marital Status - Takes one column */}
        <div>
          <FormSelect
            name="maritalStatus"
            label={t("forms.familyFinancial.fields.maritalStatus.label")}
            placeholder={t(
              "forms.familyFinancial.fields.maritalStatus.placeholder"
            )}
            options={maritalStatusOptions}
            required
            aria-label={t(
              "forms.familyFinancial.fields.maritalStatus.placeholder"
            )}
          />
        </div>

        {/* Number of Dependents - Takes one column */}
        <div>
          <FormInput
            name="dependents"
            label={t("forms.familyFinancial.fields.dependents.label")}
            placeholder={t(
              "forms.familyFinancial.fields.dependents.placeholder"
            )}
            type="number"
            required
            aria-label={t(
              "forms.familyFinancial.fields.dependents.placeholder"
            )}
          />
        </div>

        {/* Employment Status - Takes one column */}
        <div>
          <FormSelect
            name="employmentStatus"
            label={t("forms.familyFinancial.fields.employmentStatus.label")}
            placeholder={t(
              "forms.familyFinancial.fields.employmentStatus.placeholder"
            )}
            options={employmentStatusOptions}
            required
            aria-label={t(
              "forms.familyFinancial.fields.employmentStatus.placeholder"
            )}
          />
        </div>

        {/* Monthly Income with AED Currency Symbol - Takes one column */}
        <div>
          <div className="space-y-2">
            <label
              htmlFor="monthlyIncome-input"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("forms.familyFinancial.fields.monthlyIncome.label")}
              <span className="ml-1 text-destructive" aria-label="required">
                *
              </span>
            </label>
            <div className="relative">
              {/* Currency symbol positioning based on language direction */}
              <div
                className={`absolute top-0 bottom-0 ${
                  i18n.language === "ar" ? "right-0 pr-3" : "left-0 pl-3"
                } flex items-center pointer-events-none z-10 h-9`}
              >
                <span className="text-gray-500 font-medium text-sm">
                  {i18n.language === "ar" ? "د.إ" : "AED"}
                </span>
              </div>
              <FormInput
                name="monthlyIncome"
                placeholder="0.00"
                type="number"
                required
                className={`${
                  i18n.language === "ar"
                    ? "pr-14 text-right" // Arabic: Currency on right, text from right - increased padding
                    : "pl-14 text-left" // English: Currency on left, text from left - increased padding
                }`}
                aria-label={`${t(
                  "forms.familyFinancial.fields.monthlyIncome.placeholder"
                )} in UAE Dirhams`}
              />
            </div>
          </div>
        </div>

        {/* Housing Status - Takes full width */}
        <div className="md:col-span-2">
          <FormSelect
            name="housingStatus"
            label={t("forms.familyFinancial.fields.housingStatus.label")}
            placeholder={t(
              "forms.familyFinancial.fields.housingStatus.placeholder"
            )}
            options={housingStatusOptions}
            required
            aria-label={t(
              "forms.familyFinancial.fields.housingStatus.placeholder"
            )}
          />
        </div>
      </div>
    </div>
  );
};
