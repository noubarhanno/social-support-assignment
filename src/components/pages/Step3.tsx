import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/button";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Template } from "../templates";
import { StepHeader } from "../atoms";
import { FormProvider } from "react-hook-form";
import { SituationDescriptionsFormElements } from "../organisms";
import { SituationDescriptionsFormData } from "../../lib/schema/validation";
import { useValidationSchemas } from "../../lib/hooks/useValidationSchemas";
import { useWizard } from "../../lib/hooks/useWizard";
import { useWizardNavigation } from "../../lib/contexts";
import { useAutoSave } from "../../lib/hooks";
import { useWizardFlowGuard } from "../../lib/hooks";
import { autoSaveService } from "../../lib/services/persistenceService";
import toast, { Toaster } from "react-hot-toast";

/**
 * Step 3 page component - Situation Descriptions
 * Uses AI assistance for writing situation descriptions following Step2 pattern
 */
const Step3: FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setWizardStep, nextStep } = useWizardNavigation();
  const { markStepCompleted } = useWizardFlowGuard();

  // Set wizard step to 2 when component mounts
  useEffect(() => {
    setWizardStep(2);
  }, []); // Remove setWizardStep from dependencies to prevent infinite loop

  // Initialize form with react-hook-form and load saved data
  const { getWizardGenerator, resetWizardGenerator } = useWizard();
  const { SituationDescriptionsSchema } = useValidationSchemas();
  const savedStep3Data =
    autoSaveService.getStepData<SituationDescriptionsFormData>(
      "additionalInfo"
    );
  const methods = useForm<SituationDescriptionsFormData>({
    resolver: zodResolver(SituationDescriptionsSchema),
    mode: "onBlur",
    defaultValues: {
      currentFinancialSituation: savedStep3Data.currentFinancialSituation || "",
      employmentCircumstances: savedStep3Data.employmentCircumstances || "",
      reasonForApplying: savedStep3Data.reasonForApplying || "",
    },
  });

  // Setup auto-save functionality with completion tracking
  useAutoSave(methods.watch, "additionalInfo", 3);

  // Simple AI accept handler
  const saveOnAIAccept = (
    fieldName: keyof SituationDescriptionsFormData,
    aiText: string
  ) => {
    methods.setValue(fieldName, aiText);
    methods.clearErrors(fieldName);
    autoSaveService.debouncedSave("additionalInfo", {
      ...methods.watch(),
      [fieldName]: aiText,
    });
  };

  /**
   * clear form errors on language change
   */
  useEffect(() => {
    methods.clearErrors();
  }, [i18n.language]);

  /**
   * Handle back navigation to Step 2
   */
  const handleBack = () => {
    navigate("/step2");
  };

  /**
   * Handle form submission using centralized generator
   */
  const handleSubmit = methods.handleSubmit(
    async (formData: SituationDescriptionsFormData) => {
      try {
        setIsSubmitting(true);

        // Reset and get a fresh wizard generator for submission
        resetWizardGenerator();
        const wizardGen = getWizardGenerator();

        // First call: get step 3 info (generator yields step info)
        let result = await wizardGen.next();

        // If we're not on step 3 yet, advance to it
        if (!result.done && result.value.step !== 3) {
          // Continue advancing until we reach step 3
          while (!result.done && result.value.step < 3) {
            result = await wizardGen.next();
          }
        }

        // Second call: send form data (generator processes the data)
        result = await wizardGen.next(formData);

        // Check if the result is an error
        if (!result.done && result.value.hasError) {
          toast.error(result.value.error || t("common.toast.step3.error"), {
            duration: 4000,
            position: "top-right",
          });
          return; // Don't navigate to next step on error
        }

        // If no error, continue to get next step info
        if (!result.done) {
          // Mark step as completed
          markStepCompleted(3);

          // Show success toast
          toast.success(t("common.toast.step3.success"), {
            duration: 2000,
            position: "top-right",
          });

          // Navigate to summary page using both ConfigContext and react-router
          nextStep();
          navigate("/summary");
        } else {
          // Mark step as completed and go to summary
          markStepCompleted(3);
          navigate("/summary");
        }
      } catch (error) {
        console.error("Failed to save step 3 data:", error);
        toast.error(t("common.toast.step3.errorWithRetry"), {
          duration: 4000,
          position: "top-right",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  );

  return (
    <Template>
      <Toaster />

      <div className="space-y-4 sm:space-y-6">
        <StepHeader
          title={t("pages.step3.title")}
          description={t("pages.step3.description")}
        />

        {/* Form with three textarea fields and AI assistance */}
        <div className="max-w-4xl mx-auto">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                // Submit form when Enter is pressed in any textarea (but allow Shift+Enter for newlines)
                if (e.key === "Enter" && !e.shiftKey) {
                  const target = e.target as HTMLElement;
                  if (target && target.tagName === "TEXTAREA") {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }
                }
              }}
              className="bg-white rounded-lg border border-primary p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8"
            >
              {/* Form Elements */}
              <SituationDescriptionsFormElements
                onAIAccept={saveOnAIAccept}
              />{" "}
              {/* Navigation Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                {/* Back Button */}
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  variant="outline"
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {i18n.language === "ar" ? (
                    <>
                      {t("common.buttons.backToPrevious")}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="h-4 w-4" />
                      {t("common.buttons.backToPrevious")}
                    </>
                  )}
                </Button>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("common.buttons.submitting")}
                    </>
                  ) : (
                    <>
                      {t("common.buttons.submit")}
                      {i18n.language !== "ar" && (
                        <ArrowRight className="h-4 w-4" />
                      )}
                      {i18n.language === "ar" && (
                        <ArrowLeft className="h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Template>
  );
};

export default Step3;
