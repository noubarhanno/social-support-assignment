import type { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/button";
import { Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Template } from "../templates";
import { StepHeader } from "../atoms";
import { FormProvider } from "react-hook-form";
import { PersonalInfoFormElements, PersonalInfoFormData } from "../organisms";
import { getWizardGenerator } from "../../lib/hooks/useWizardGenerator";
import { useWizardNavigation } from "../../lib/contexts";
import toast, { Toaster } from "react-hot-toast";

/**
 * Step 1 page component - Uses centralized generator for wizard flow
 */
const Step1: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setWizardStep, nextStep } = useWizardNavigation();

  // Set wizard step to 0 when component mounts
  useEffect(() => {
    setWizardStep(0);
  }, [setWizardStep]);

  // Initialize form with react-hook-form
  const methods = useForm<PersonalInfoFormData>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      nationalId: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      country: "",
      state: "",
      city: "",
      phoneNumber: "",
      email: "",
    },
  });

  /**
   * Handle form submission using centralized generator
   */
  const handleNext = methods.handleSubmit(
    async (formData: PersonalInfoFormData) => {
      try {
        setIsSubmitting(true);

        // Get the centralized wizard generator
        const wizardGen = getWizardGenerator();

        // Send form data to generator and get next step info
        const result = wizardGen.next(formData);

        if (!result.done) {
          // Show success toast
          toast.success("Personal information saved!", {
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
        toast.error("Failed to save information. Please try again.", {
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
            <div className="bg-white rounded-lg border border-primary p-8 space-y-6">
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
                      {t("common.buttons.continue")}
                      <ArrowRight className="h-4 w-4" />
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
