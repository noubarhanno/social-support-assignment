import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Template } from "../templates";
import { useWizardNavigation } from "../../lib/contexts";
import { useWizard } from "../../lib/hooks/useWizard";
import { Button } from "../atoms/button";
import { RotateCcw } from "lucide-react";
import { StepHeader } from "../atoms";

/**
 * Summary page component that displays the final results.
 * Shows a summary of all form submissions after completion.
 */
const Summary: FC = () => {
  const { t } = useTranslation();
  const { setWizardStep } = useWizardNavigation();
  const { resetWizard } = useWizard();
  const navigate = useNavigate();

  // Summary page - set wizard step to 3 (all steps completed)
  useEffect(() => {
    setWizardStep(3);
  }, [setWizardStep]);

  /**
   * Handle starting a new application
   */
  const handleStartNew = () => {
    resetWizard();
    setWizardStep(0);
    navigate("/step1");
  };

  return (
    <Template>
      <div className="space-y-6">
        <StepHeader
          title={t("pages.summary.stepHeader", "Summary")}
          description={t("pages.summary.description")}
        />

        {/* Summary content */}
        <div className="mt-8 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              {t("pages.summary.nextSteps", "What happens next?")}
            </h2>
            <ul className="text-green-700 space-y-1">
              <li>
                •{" "}
                {t(
                  "pages.summary.reviewTime",
                  "We will review your application within 2-3 business days"
                )}
              </li>
              <li>
                •{" "}
                {t(
                  "pages.summary.emailConfirmation",
                  "You will receive an email confirmation shortly"
                )}
              </li>
            </ul>
          </div>

          {/* Start New Application Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleStartNew}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t("pages.summary.startNew", "Start New Application")}
            </Button>
          </div>
        </div>
      </div>
    </Template>
  );
};

export default Summary;
