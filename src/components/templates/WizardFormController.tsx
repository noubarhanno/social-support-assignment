import React, { useState } from "react";
import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/button";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "../../lib/api/externalMockedApi";

/**
 * Props for WizardFormController component
 */
export interface WizardFormControllerProps<T extends FieldValues> {
  /** React Hook Form methods object */
  formMethods: UseFormReturn<T>;
  /** Form submission handler - should return a Promise */
  onSubmit: (data: T) => Promise<ApiResponse>;
  /** Callback when form is successfully submitted */
  onSuccess?: (response: ApiResponse) => void;
  /** Callback when form submission fails */
  onError?: (error: Error) => void;
  /** Children components (form elements) */
  children: React.ReactNode;
  /** Submit button text */
  submitButtonText?: string;
  /** Loading button text */
  loadingButtonText?: string;
  /** Whether to show success toast */
  showSuccessToast?: boolean;
  /** Whether to show error toast */
  showErrorToast?: boolean;
  /** Custom success toast message */
  successToastMessage?: string;
  /** Whether the form is part of a multi-step wizard */
  isWizardStep?: boolean;
  /** Current step number (for wizard) */
  currentStep?: number;
  /** Total steps (for wizard) */
  totalSteps?: number;
  /** Additional CSS classes for the form container */
  className?: string;
  /** Whether to disable the submit button */
  disabled?: boolean;
  /** Custom submit button variant */
  submitButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

/**
 * WizardFormController - A comprehensive form controller for multi-step wizard forms
 *
 * Features:
 * - React Hook Form integration with FormProvider
 * - Toast notifications for success/error states
 * - Loading states during submission
 * - Error handling with field-level error mapping
 * - Multi-step wizard support
 * - Customizable submit buttons and messages
 * - Accessibility support
 *
 * Note: Progress indication is handled by the parent Template component
 *
 * @example
 * ```tsx
 * const methods = useForm<PersonalInfoFormData>();
 *
 * <WizardFormController
 *   formMethods={methods}
 *   onSubmit={async (data) => await submitPersonalInfo(data)}
 *   onSuccess={() => navigate('/step2')}
 *   isWizardStep={true}
 * >
 *   <PersonalInfoFormElements />
 * </WizardFormController>
 * ```
 */
export const WizardFormController = <T extends FieldValues>({
  formMethods,
  onSubmit,
  onSuccess,
  onError,
  children,
  submitButtonText,
  loadingButtonText,
  showSuccessToast = true,
  showErrorToast = true,
  successToastMessage,
  isWizardStep = false,
  currentStep,
  totalSteps,
  className = "",
  disabled = false,
  submitButtonVariant = "default",
}: WizardFormControllerProps<T>) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate wizard-specific messages
  const getWizardMessages = () => {
    if (!isWizardStep || !currentStep) {
      return {
        submitText: submitButtonText || t("common.buttons.submit"),
        loadingText: loadingButtonText || t("common.buttons.submitting"),
        successText:
          successToastMessage || t("common.messages.formSubmittedSuccessfully"),
      };
    }

    const isLastStep = totalSteps && currentStep === totalSteps;

    return {
      submitText: isLastStep
        ? t("common.buttons.completeApplication")
        : t("common.buttons.continueToStep", { step: currentStep + 1 }),
      loadingText: isLastStep
        ? t("common.buttons.completing")
        : t("common.buttons.savingAndContinuing"),
      successText:
        successToastMessage ||
        (isLastStep
          ? t("common.messages.applicationCompletedSuccessfully")
          : t("common.messages.stepCompletedMovingToNext", {
              step: currentStep,
            })),
    };
  };

  const { submitText, loadingText, successText } = getWizardMessages();

  /**
   * Handle form submission with comprehensive error handling
   */
  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true);

      // Clear any existing field errors
      formMethods.clearErrors();

      // Submit the form data
      const response = await onSubmit(data);

      // Show success toast
      if (showSuccessToast) {
        toast.success(successText, {
          duration: 4000,
          position: "top-right",
          icon: "✅",
          style: {
            background: "#10B981",
            color: "white",
          },
        });
      }

      // Call success callback
      onSuccess?.(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";

      // Show error toast
      if (showErrorToast) {
        toast.error(errorMessage, {
          duration: 6000,
          position: "top-right",
          icon: "❌",
          style: {
            background: "#EF4444",
            color: "white",
          },
        });
      }

      // Call error callback
      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster />

      {/* Form Provider Wrapper */}
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(handleSubmit)}
          className={`space-y-6 ${className}`}
          noValidate
          aria-label={
            isWizardStep
              ? t("common.accessibility.wizardForm")
              : t("common.accessibility.form")
          }
        >
          {/* Form Content */}
          <div className="space-y-6">{children}</div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              variant={submitButtonVariant}
              disabled={disabled || isSubmitting}
              className="min-w-[140px]"
              aria-describedby={isSubmitting ? "submit-loading" : undefined}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingText}
                </>
              ) : (
                submitText
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default WizardFormController;
