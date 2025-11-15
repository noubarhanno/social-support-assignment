/**
 * Auto-save hook with step completion tracking
 * Enhanced to track step completion state and handle form modifications
 */
import { useEffect, useRef } from "react";
import { UseFormWatch, FieldValues } from "react-hook-form";
import {
  autoSaveService,
  WizardFormData,
} from "../services/persistenceService";
import { useWizardFlowGuard } from "./useWizardFlowGuard";

export const useAutoSave = <T extends FieldValues>(
  watch: UseFormWatch<T>,
  stepKey: keyof WizardFormData,
  stepNumber: 1 | 2 | 3
) => {
  const lastSavedData = useRef<string>("");
  const { getStepCompletion, markStepIncomplete } = useWizardFlowGuard();
  const formData = watch();

  useEffect(() => {
    const dataString = JSON.stringify(formData);

    // Only save if data changed and is not empty
    if (dataString !== lastSavedData.current && dataString !== "{}") {
      autoSaveService.debouncedSave(stepKey, formData);

      // If this step was previously completed and user is now modifying it,
      // mark it as incomplete and invalidate subsequent steps
      const completion = getStepCompletion(stepNumber);
      if (completion.isCompleted) {
        markStepIncomplete(stepNumber);
      }

      lastSavedData.current = dataString;
    }
  }, [formData, stepKey, stepNumber, getStepCompletion, markStepIncomplete]);
};
