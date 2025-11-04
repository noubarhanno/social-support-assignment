import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Template } from "../templates";
import { useWizardNavigation } from "../../lib/contexts";
import { StepHeader } from "../atoms";

/**
 * Step 2 page component for the wizard form.
 * Family & Financial Information step - second step of the wizard.
 */
const Step2: FC = () => {
  const { t } = useTranslation();
  const { setWizardStep } = useWizardNavigation();

  // Set wizard step to 1 when component mounts
  useEffect(() => {
    setWizardStep(1);
  }, [setWizardStep]);

  return (
    <Template>
      <div className="space-y-6">
        <StepHeader
          title={t("pages.step2.title")}
          description={t("pages.step2.description")}
        />

        {/* Form content will go here */}
        <div className="mt-8">
          <p className="text-gray-500 text-center">
            Fields: Marital Status, Dependents, Employment Status, Monthly
            Income, Housing Status
          </p>
        </div>
      </div>
    </Template>
  );
};

export default Step2;
