import React, { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput } from "../../molecules/FormInput";
import { FormSelect, type SelectOption } from "../../molecules/FormSelect";
import { FormPhoneInput } from "../../molecules/FormPhoneInput";
import { FormDate } from "../../molecules/FormDate";
import { FormCountrySelect } from "../../molecules/FormCountrySelect";
import { useFormDependenciesReducer } from "../../../lib/hooks/useFormDependenciesReducer";
import { GENDER_OPTIONS } from "../../../lib/utils/constants";

// Form data structure is now defined in the validation schema
import type { PersonalInfoFormData } from "../../../lib/schema/validation";

/**
 * PersonalInfoFormElements organism component
 *
 * A comprehensive form for collecting personal information with intelligent
 * dependencies between country, state, and city fields. Must be wrapped
 * with FormProvider from react-hook-form.
 *
 * Features:
 * - Full accessibility with ARIA roles and keyboard navigation
 * - Smart field dependencies (country -> state -> city)
 * - Real-time country/state/city data fetching
 * - Comprehensive validation
 * - Error handling with user feedback
 *
 * Dependencies:
 * - Country selection clears state and city
 * - State selection clears city
 * - All selections are cascading and real-time
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <PersonalInfoFormElements />
 * </FormProvider>
 * ```
 */
export const PersonalInfoFormElements: React.FC = () => {
  const { t } = useTranslation();
  const formContext = useFormContext<PersonalInfoFormData>();

  if (!formContext) {
    throw new Error(
      "PersonalInfoFormElements must be used within a FormProvider from react-hook-form"
    );
  }

  // Modern approach: Reducer-based form dependencies
  const {
    countryOptions,
    stateOptions,
    loadingCountries,
    loadingStates,
    selectedCountry,
  } = useFormDependenciesReducer();

  // Memoized gender options for performance
  const genderOptions: SelectOption[] = useMemo(
    () => [
      {
        value: GENDER_OPTIONS.MALE,
        label: t("forms.personalInfo.genderOptions.male"),
      },
      {
        value: GENDER_OPTIONS.FEMALE,
        label: t("forms.personalInfo.genderOptions.female"),
      },
      {
        value: GENDER_OPTIONS.OTHER,
        label: t("forms.personalInfo.genderOptions.other"),
      },
      {
        value: GENDER_OPTIONS.PREFER_NOT_TO_SAY,
        label: t("forms.personalInfo.genderOptions.preferNotToSay"),
      },
    ],
    [t]
  );

  return (
    <div
      className="space-y-6"
      role="form"
      aria-label={t("forms.personalInfo.title")}
    >
      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name - Takes one column */}
        <div>
          <FormInput
            name="name"
            label={t("forms.personalInfo.fields.fullName.label")}
            placeholder={t("forms.personalInfo.fields.fullName.placeholder")}
            required
            aria-label={t("forms.personalInfo.fields.fullName.placeholder")}
          />
        </div>

        {/* National ID */}
        <div>
          <FormInput
            name="nationalId"
            label={t("forms.personalInfo.fields.nationalId.label")}
            placeholder={t("forms.personalInfo.fields.nationalId.placeholder")}
            required
            aria-label={t("forms.personalInfo.fields.nationalId.placeholder")}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <FormDate
            name="dateOfBirth"
            label={t("forms.personalInfo.fields.dateOfBirth.label")}
            placeholder={t("forms.personalInfo.fields.dateOfBirth.placeholder")}
            maxDate={new Date()} // Can't be born in the future
            enableDropdownNavigation={true} // Easy year/month selection
            required
            aria-label={t("forms.personalInfo.fields.dateOfBirth.placeholder")}
          />
        </div>

        {/* Gender */}
        <div>
          <FormSelect
            name="gender"
            label={t("forms.personalInfo.fields.gender.label")}
            options={genderOptions}
            placeholder={t("forms.personalInfo.fields.gender.placeholder")}
            required
            aria-label={t("forms.personalInfo.fields.gender.placeholder")}
          />
        </div>

        {/* Address - One column */}
        <div>
          <FormInput
            name="address"
            label={t("forms.personalInfo.fields.address.label")}
            placeholder={t("forms.personalInfo.fields.address.placeholder")}
            required
            aria-label={t("forms.personalInfo.fields.address.placeholder")}
          />
        </div>

        {/* Country */}
        <div>
          <FormCountrySelect
            name="country"
            countries={countryOptions}
            loading={loadingCountries}
            label={t("forms.personalInfo.fields.country.label")}
            placeholder={t("forms.personalInfo.fields.country.placeholder")}
            required
            aria-label={t("forms.personalInfo.fields.country.placeholder")}
            aria-describedby="country-help"
          />
          <div id="country-help" className="sr-only">
            Selecting a country will load available states and cities
          </div>
        </div>

        {/* State - Dynamic: Select if states available, Input if no states */}
        <div>
          {selectedCountry && !loadingStates && stateOptions.length === 0 ? (
            // Render input for countries without predefined states
            <FormInput
              name="state"
              label={t("forms.personalInfo.fields.state.label")}
              placeholder={t(
                "forms.personalInfo.fields.state.placeholderInput"
              )}
              required
              aria-label={t("forms.personalInfo.fields.state.placeholderInput")}
              aria-describedby="state-help-input"
            />
          ) : (
            // Render select for countries with predefined states
            <FormSelect
              name="state"
              label={t("forms.personalInfo.fields.state.label")}
              options={stateOptions}
              placeholder={
                selectedCountry
                  ? t("forms.personalInfo.fields.state.placeholder")
                  : t(
                      "forms.personalInfo.fields.state.placeholderSelectCountry"
                    )
              }
              disabled={!selectedCountry || loadingStates}
              loading={loadingStates}
              required
              aria-label={t("forms.personalInfo.fields.state.placeholder")}
              aria-describedby="state-help"
            />
          )}
          <div id="state-help" className="sr-only">
            Available after selecting a country. Selecting a state will load
            available cities.
          </div>
          <div id="state-help-input" className="sr-only">
            Enter your state/province/region name.
          </div>
        </div>

        {/* City */}
        <div>
          <FormInput
            name="city"
            label={t("forms.personalInfo.fields.city.label")}
            placeholder={t("forms.personalInfo.fields.city.placeholder")}
            required
            aria-label={t("forms.personalInfo.fields.city.placeholder")}
          />
        </div>

        {/* Phone Number */}
        <div>
          <FormPhoneInput
            name="phoneNumber"
            label={t("forms.personalInfo.fields.phoneNumber.label")}
            placeholder={t("forms.personalInfo.fields.phoneNumber.placeholder")}
            defaultCountry="AE"
          />
        </div>

        {/* Email */}
        <div>
          <FormInput
            name="email"
            type="email"
            label={t("forms.personalInfo.fields.email.label")}
            placeholder={t("forms.personalInfo.fields.email.placeholder")}
            required
            aria-label={t("forms.personalInfo.fields.email.placeholder")}
          />
        </div>
      </div>
    </div>
  );
};
