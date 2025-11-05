import i18n from "../i18n";

/**
 * Get translated validation messages for form fields
 * This ensures all validation messages are properly internationalized
 */
export const getValidationMessages = () => {
  return {
    // General messages
    required: i18n.t("validation.messages.required"),

    // Select field messages
    selectRequired: i18n.t("validation.messages.selectRequired"),
    genderRequired: i18n.t("validation.messages.genderRequired"),
    maritalStatusRequired: i18n.t("validation.messages.maritalStatusRequired"),
    employmentStatusRequired: i18n.t(
      "validation.messages.employmentStatusRequired"
    ),
    housingStatusRequired: i18n.t("validation.messages.housingStatusRequired"),

    // Name field messages
    nameRequired: i18n.t("validation.messages.nameRequired"),
    nameMinLength: i18n.t("validation.messages.nameMinLength"),
    nameMaxLength: i18n.t("validation.messages.nameMaxLength"),
    nameInvalidFormat: i18n.t("validation.messages.nameInvalidFormat"),

    // National ID messages
    nationalIdRequired: i18n.t("validation.messages.nationalIdRequired"),
    nationalIdMinLength: i18n.t("validation.messages.nationalIdMinLength"),
    nationalIdMaxLength: i18n.t("validation.messages.nationalIdMaxLength"),
    nationalIdInvalidFormat: i18n.t(
      "validation.messages.nationalIdInvalidFormat"
    ),

    // Date of birth messages
    dateOfBirthRequired: i18n.t("validation.messages.dateOfBirthRequired"),
    dateOfBirthInvalidAge: i18n.t("validation.messages.dateOfBirthInvalidAge"),

    // Address messages
    addressRequired: i18n.t("validation.messages.addressRequired"),
    addressMinLength: i18n.t("validation.messages.addressMinLength"),
    addressMaxLength: i18n.t("validation.messages.addressMaxLength"),

    // Location messages
    countryRequired: i18n.t("validation.messages.countryRequired"),
    stateRequired: i18n.t("validation.messages.stateRequired"),
    cityRequired: i18n.t("validation.messages.cityRequired"),

    // Contact messages
    phoneRequired: i18n.t("validation.messages.phoneRequired"),
    phoneInvalidFormat: i18n.t("validation.messages.phoneInvalidFormat"),
    emailRequired: i18n.t("validation.messages.emailRequired"),
    emailInvalidFormat: i18n.t("validation.messages.emailInvalidFormat"),
    emailMaxLength: i18n.t("validation.messages.emailMaxLength"),

    // Family & Financial messages
    dependentsRequired: i18n.t("validation.messages.dependentsRequired"),
    dependentsInvalidRange: i18n.t(
      "validation.messages.dependentsInvalidRange"
    ),
    monthlyIncomeRequired: i18n.t("validation.messages.monthlyIncomeRequired"),
    monthlyIncomeInvalidRange: i18n.t(
      "validation.messages.monthlyIncomeInvalidRange"
    ),

    // Situation descriptions messages
    financialSituationMinLength: i18n.t(
      "validation.messages.financialSituationMinLength"
    ),
    financialSituationMaxLength: i18n.t(
      "validation.messages.financialSituationMaxLength"
    ),
    employmentCircumstancesMinLength: i18n.t(
      "validation.messages.employmentCircumstancesMinLength"
    ),
    employmentCircumstancesMaxLength: i18n.t(
      "validation.messages.employmentCircumstancesMaxLength"
    ),
    reasonForApplyingMinLength: i18n.t(
      "validation.messages.reasonForApplyingMinLength"
    ),
    reasonForApplyingMaxLength: i18n.t(
      "validation.messages.reasonForApplyingMaxLength"
    ),
  };
};

/**
 * Generic helper to get select field validation message
 * @param fieldType - The type of select field (gender, maritalStatus, etc.)
 * @returns Translated validation message
 */
export const getSelectValidationMessage = (
  fieldType: "gender" | "maritalStatus" | "employmentStatus" | "housingStatus"
): string => {
  const messages = getValidationMessages();
  return messages[`${fieldType}Required` as keyof typeof messages];
};

/**
 * Get a specific validation message by key
 * @param messageKey - The validation message key
 * @returns Translated validation message
 */
export const getValidationMessage = (messageKey: string): string => {
  return i18n.t(`validation.messages.${messageKey}`);
};
