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
import { FamilyFinancialFormElements } from "../organisms";
import {
  FamilyFinancialSchema,
  FamilyFinancialFormData,
} from "../../lib/schema/validation";
import { useWizard } from "../../lib/hooks/useWizard";
import { useWizardNavigation } from "../../lib/contexts";
import toast, { Toaster } from "react-hot-toast";

/**
 * Step 2 page component - Family & Financial Information
 * Uses centralized generator for wizard flow following Step1 pattern
 */
const Step2: FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setWizardStep, nextStep } = useWizardNavigation();

  // Set wizard step to 1 when component mounts
  useEffect(() => {
    setWizardStep(1);
  }, []); // Remove setWizardStep from dependencies to prevent infinite loop

  // Initialize form with react-hook-form and load saved data
  const { getStepData, getWizardGenerator, resetWizardGenerator } = useWizard();
  const savedStep2Data = getStepData(2);
  const methods = useForm<FamilyFinancialFormData>({
    resolver: zodResolver(FamilyFinancialSchema),
    mode: "onBlur",
    defaultValues: {
      maritalStatus: savedStep2Data.maritalStatus || "",
      dependents: savedStep2Data.dependents || "",
      employmentStatus: savedStep2Data.employmentStatus || "",
      monthlyIncome: savedStep2Data.monthlyIncome || "",
      housingStatus: savedStep2Data.housingStatus || "",
    },
  });

  /**
   * Handle back navigation to Step 1
   */
  const handleBack = () => {
    navigate("/step1");
  };

  /**
   * Handle form submission using centralized generator
   */
  const handleNext = methods.handleSubmit(
    async (formData: FamilyFinancialFormData) => {
      try {
        setIsSubmitting(true);

        // Reset and get a fresh wizard generator for submission
        resetWizardGenerator();
        const wizardGen = getWizardGenerator();

        // First call: get step 2 info (generator yields step info)
        let result = await wizardGen.next();

        // If we're not on step 2 yet, advance to it
        if (!result.done && result.value.step !== 2) {
          // Continue advancing until we reach step 2
          while (!result.done && result.value.step < 2) {
            result = await wizardGen.next();
          }
        }

        // Second call: send form data (generator processes the data)
        result = await wizardGen.next(formData);

        // Check if the result is an error
        if (!result.done && result.value.hasError) {
          toast.error(
            result.value.error ||
              "Failed to save family & financial information",
            {
              duration: 4000,
              position: "top-right",
            }
          );
          return; // Don't navigate to next step on error
        }

        // If no error, continue to get next step info
        if (!result.done) {
          // Show success toast
          toast.success("Family & financial information saved!", {
            duration: 2000,
            position: "top-right",
          });

          // Navigate to next step using both ConfigContext and react-router
          nextStep();
          navigate("/step3");
        } else {
          // Wizard completed (shouldn't happen from step 2)
        }
      } catch (error) {
        console.error("Failed to save step 2 data:", error);
        toast.error(
          "Failed to save family & financial information. Please try again.",
          {
            duration: 4000,
            position: "top-right",
          }
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  );

  return (
    <Template>
      <Toaster />

      <div className="space-y-6">
        <StepHeader
          title={t("pages.step2.title")}
          description={t("pages.step2.description")}
        />

        {/* Simple form with generator-powered navigation */}
        <div className="max-w-4xl mx-auto">
          <FormProvider {...methods}>
            <div className="bg-white rounded-lg border border-primary p-8 space-y-6">
              {/* Form Elements */}
              <FamilyFinancialFormElements />

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                {/* Back Button */}
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  variant="outline"
                  className="flex items-center gap-2"
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

                {/* Continue Button */}
                <Button
                  type="submit"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("common.buttons.saving")}
                    </>
                  ) : (
                    <>
                      {i18n.language === "ar" ? (
                        <>
                          {t("common.buttons.continueToStep", { step: "3" })}
                          <ArrowLeft className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          {t("common.buttons.continueToStep", { step: "3" })}
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </Template>
  );
};

export default Step2;
