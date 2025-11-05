import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormTextarea } from "../../molecules/FormTextarea";
import AITextGenerator from "../AITextGenerator";

// Form data structure is now defined in the validation schema
import type { SituationDescriptionsFormData } from "../../../lib/schema/validation";

/**
 * SituationDescriptionsFormElements organism component
 *
 * A comprehensive form for collecting situation descriptions with AI assistance.
 * Must be wrapped with FormProvider from react-hook-form.
 *
 * Features:
 * - Full accessibility with ARIA roles and keyboard navigation
 * - AI-powered text generation assistance for each field
 * - Comprehensive validation for all textarea fields
 * - Error handling with user feedback
 * - Consistent styling with other form organisms
 *
 * Form Fields:
 * - Current Financial Situation (textarea with AI assistance)
 * - Employment Circumstances (textarea with AI assistance)
 * - Reason for Applying (textarea with AI assistance)
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <SituationDescriptionsFormElements />
 * </FormProvider>
 * ```
 */
export const SituationDescriptionsFormElements: React.FC = () => {
  const { t } = useTranslation();
  const formContext = useFormContext<SituationDescriptionsFormData>();

  if (!formContext) {
    throw new Error(
      "SituationDescriptionsFormElements must be used within a FormProvider from react-hook-form"
    );
  }

  const { watch, setValue } = formContext;

  return (
    <div
      className="space-y-6 lg:space-y-8"
      role="form"
      aria-label={t("forms.situationDescriptions.title")}
    >
      {/* Current Financial Situation */}
      <div className="space-y-2 sm:space-y-3">
        <FormTextarea
          name="currentFinancialSituation"
          label={t(
            "forms.situationDescriptions.fields.currentFinancialSituation.label"
          )}
          placeholder={t(
            "forms.situationDescriptions.fields.currentFinancialSituation.placeholder"
          )}
          rows={4}
          required
          aria-label={t(
            "forms.situationDescriptions.fields.currentFinancialSituation.placeholder"
          )}
        />
        <div className="flex items-center gap-3 justify-start">
          <AITextGenerator
            prompt={t("ai.prompts.financialSituation")}
            context={watch("currentFinancialSituation")}
            onTextGenerated={(text) =>
              setValue("currentFinancialSituation", text)
            }
            buttonText={t("common.actions.helpMeWrite")}
          />
        </div>
      </div>

      {/* Employment Circumstances */}
      <div className="space-y-2 sm:space-y-3">
        <FormTextarea
          name="employmentCircumstances"
          label={t(
            "forms.situationDescriptions.fields.employmentCircumstances.label"
          )}
          placeholder={t(
            "forms.situationDescriptions.fields.employmentCircumstances.placeholder"
          )}
          rows={4}
          required
          aria-label={t(
            "forms.situationDescriptions.fields.employmentCircumstances.placeholder"
          )}
        />
        <div className="flex items-center gap-3 justify-start">
          <AITextGenerator
            prompt={t("ai.prompts.employmentCircumstances")}
            context={watch("employmentCircumstances")}
            onTextGenerated={(text) =>
              setValue("employmentCircumstances", text)
            }
            buttonText={t("common.actions.helpMeWrite")}
          />
        </div>
      </div>

      {/* Reason for Applying */}
      <div className="space-y-2 sm:space-y-3">
        <FormTextarea
          name="reasonForApplying"
          label={t(
            "forms.situationDescriptions.fields.reasonForApplying.label"
          )}
          placeholder={t(
            "forms.situationDescriptions.fields.reasonForApplying.placeholder"
          )}
          rows={4}
          required
          aria-label={t(
            "forms.situationDescriptions.fields.reasonForApplying.placeholder"
          )}
        />
        <div className="flex items-center gap-3 justify-start">
          <AITextGenerator
            prompt={t("ai.prompts.reasonForApplying")}
            context={watch("reasonForApplying")}
            onTextGenerated={(text) => setValue("reasonForApplying", text)}
            buttonText={t("common.actions.helpMeWrite")}
          />
        </div>
      </div>
    </div>
  );
};
