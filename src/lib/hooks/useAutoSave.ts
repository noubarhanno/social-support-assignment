/**
 * Simple auto-save hook for form data
 */
import { useEffect, useRef } from "react";
import { UseFormWatch, FieldValues } from "react-hook-form";
import {
  autoSaveService,
  WizardFormData,
} from "../services/persistenceService";

export const useAutoSave = <T extends FieldValues>(
  watch: UseFormWatch<T>,
  stepKey: keyof WizardFormData
) => {
  const lastSavedData = useRef<string>("");
  const formData = watch();

  useEffect(() => {
    const dataString = JSON.stringify(formData);

    // Only save if data changed and is not empty
    if (dataString !== lastSavedData.current && dataString !== "{}") {
      autoSaveService.debouncedSave(stepKey, formData);
      lastSavedData.current = dataString;
    }
  }, [formData, stepKey]);
};
