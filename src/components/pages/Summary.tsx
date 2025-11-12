import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Template } from "../templates";
import { useWizardNavigation } from "../../lib/contexts";
import { useWizard } from "../../lib/hooks/useWizard";
import { useRTL } from "../../lib/hooks/useRTL";
import { autoSaveService } from "../../lib/services/persistenceService";
import { generateApplicationNumber } from "../../lib/utils/constants";
import {
  loadFromStorage,
  saveToStorage,
  removeFromStorage,
} from "../../lib/utils/storage";
import { Button } from "../atoms/button";
import { RotateCcw, CheckCircle, Copy } from "lucide-react";
import { StepHeader } from "../atoms";
import { useState } from "react";
import clsx from "clsx";

/**
 * Summary page component that displays the final results.
 * Shows a summary of all form submissions after completion.
 */
const Summary: FC = () => {
  const { t } = useTranslation();
  const { setWizardStep } = useWizardNavigation();
  const { resetWizard } = useWizard();
  const navigate = useNavigate();
  const { isRTL } = useRTL();
  const [applicationNumber, setApplicationNumber] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // Initialize application number on component mount
  useEffect(() => {
    const existingNumber = loadFromStorage<string | null>(
      "application-number",
      null
    );
    if (existingNumber) {
      setApplicationNumber(existingNumber);
    } else {
      const newNumber = generateApplicationNumber();
      setApplicationNumber(newNumber);
      saveToStorage("application-number", newNumber);
    }
  }, []);

  // Summary page - set wizard step to 3 (all steps completed) and clear form data
  useEffect(() => {
    setWizardStep(3);

    // Clear form data from localStorage on first load
    // Set a flag to indicate wizard is completed (disable editing)
    const isWizardCompleted = loadFromStorage<string | null>(
      "wizard-completed",
      null
    );
    if (!isWizardCompleted) {
      autoSaveService.clearAllData();
      saveToStorage("wizard-completed", "true");
    }
  }, [setWizardStep]);

  /**
   * Handle copying application number to clipboard
   */
  const handleCopyApplicationNumber = async () => {
    try {
      await navigator.clipboard.writeText(applicationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy application number:", err);
    }
  };

  /**
   * Handle starting a new application - clear all data and restart
   */
  const handleStartNew = () => {
    // Clear all auto-saved data
    autoSaveService.clearAllData();

    // Clear wizard completion flag to allow editing again
    removeFromStorage("wizard-completed");

    // Clear application number from storage and state
    removeFromStorage("application-number");
    setApplicationNumber("");

    // Reset wizard state
    resetWizard();
    setWizardStep(0);

    // Navigate to first step
    navigate("/step1");
  };

  return (
    <Template>
      <div className="space-y-6">
        <StepHeader
          title={t("pages.summary.stepHeader")}
          description={t("pages.summary.description")}
        />

        {/* Summary content */}
        <div className="mt-8 space-y-8">
          {/* Application Success Message + What's Next (merged) */}
          <div className="text-center bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="sm:text-2xl text-[20px] font-bold text-green-800 mb-2">
              {t("pages.summary.success")}
            </h2>
            <p className="text-green-700 mb-6">{t("pages.summary.thankYou")}</p>

            {/* Application Number */}
            <div className="bg-white border border-green-300 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                {t("pages.summary.applicationNumberIntro")}
              </h3>
              <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-4">
                <span className="font-mono text-lg font-bold text-gray-900 tracking-wide">
                  {applicationNumber}
                </span>
                <Button
                  onClick={handleCopyApplicationNumber}
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-8 w-8 p-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t("pages.summary.applicationNumberNote")}
              </p>
            </div>

            {/* Separation line */}
            <div className="mt-8 mb-6">
              <hr className="border-gray-300" />
            </div>

            {/* What's Next (plain text in same container) */}
            <div
              className={`max-w-2xl mx-auto ${clsx({
                "text-right": isRTL,
                "text-left": !isRTL,
              })}`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t("pages.summary.nextSteps")}
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>• {t("pages.summary.reviewTime")}</p>
                <p>• {t("pages.summary.emailConfirmation")}</p>
              </div>
            </div>
          </div>

          {/* Start New Application Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleStartNew}
              variant="outline"
              className="flex items-center gap-2 px-6 py-3"
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
