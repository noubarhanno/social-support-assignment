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
import { PersonalInfoFormElements } from "../organisms";
import { PersonalInfoFormData } from "../../lib/schema/validation";
import { useValidationSchemas } from "../../lib/hooks/useValidationSchemas";
import { useWizard } from "../../lib/hooks/useWizard";
import { useWizardNavigation } from "../../lib/contexts";
import toast, { Toaster } from "react-hot-toast";

/**
 * Step 1 page component - Uses centralized generator for wizard flow
 */
const Step1: FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setWizardStep, nextStep } = useWizardNavigation();

  // Set wizard step to 0 when component mounts
  useEffect(() => {
    setWizardStep(0);
  }, []); // Remove setWizardStep from dependencies to prevent infinite loop

  // Initialize form with react-hook-form and load saved data
  const { getStepData, getWizardGenerator, resetWizardGenerator } = useWizard();
  const { PersonalInfoSchema } = useValidationSchemas();
  const savedStep1Data = getStepData(1);
  const methods = useForm<PersonalInfoFormData>({
    resolver: zodResolver(PersonalInfoSchema),
    mode: "onBlur",
    defaultValues: {
      name: savedStep1Data.name || "",
      nationalId: savedStep1Data.nationalId || "",
      dateOfBirth: savedStep1Data.dateOfBirth || "",
      gender: savedStep1Data.gender || "",
      address: savedStep1Data.address || "",
      country: savedStep1Data.country || "",
      state: savedStep1Data.state || "",
      city: savedStep1Data.city || "",
      phoneNumber: savedStep1Data.phoneNumber || "",
      email: savedStep1Data.email || "",
    },
  });

  /**
   * clear form errors on language change
   */
  useEffect(() => {
    methods.clearErrors();
  }, [i18n.language]);

  /**
   * Handle form submission using centralized generator
   */
  const handleNext = methods.handleSubmit(
    async (formData: PersonalInfoFormData) => {
      try {
        setIsSubmitting(true);

        // Reset and get a fresh wizard generator for submission
        resetWizardGenerator();
        const wizardGen = getWizardGenerator();

        // First call: get step 1 info (generator yields step info)
        await wizardGen.next();

        // Second call: send form data (generator processes the data)
        let result = await wizardGen.next(formData);

        // Check if the first result is an error
        if (!result.done && result.value.hasError) {
          toast.error(result.value.error || t("common.toast.step1.error"), {
            duration: 4000,
            position: "top-right",
          });
          return; // Don't navigate to next step on error
        }

        // If no error, continue to get next step info
        if (!result.done) {
          // Show success toast
          toast.success(t("common.toast.step1.success"), {
            duration: 2000,
            position: "top-right",
          });

          // Navigate to next step using both ConfigContext and react-router
          nextStep();
          navigate("/step2");
        } else {
          // Wizard completed (shouldn't happen from step 1)
        }
      } catch (error) {
        console.error("Failed to save step 1 data:", error);
        toast.error(t("common.toast.step1.errorWithRetry"), {
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

      <div className="space-y-6">
        <StepHeader
          title={t("pages.step1.title")}
          description={t("pages.step1.description")}
        />

        {/* Simple form with generator-powered navigation */}
        <div className="max-w-4xl mx-auto">
          <FormProvider {...methods}>
            <div className="bg-white rounded-lg border border-primary p-6 lg:p-8 space-y-6">
              {/* Form Elements */}
              <PersonalInfoFormElements />

              {/* Generator-powered Next Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200">
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
                          {t("common.buttons.continue")}
                          <ArrowLeft className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          {t("common.buttons.continue")}
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

export default Step1;
