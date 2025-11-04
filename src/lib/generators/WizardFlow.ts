/**
 * Wizard Flow Generator
 * Handles 3-step wizard flow with data submission and persistence
 */
import { saveToStorage, loadFromStorage } from "../utils/storage";
import { submitForm } from "../api/externalMockedApi";

export interface WizardStep {
  step: number;
  message: string;
  isComplete: boolean;
  error?: string; // Error message if submission failed
  hasError?: boolean; // Flag to indicate if there was an error
}

// Storage keys for wizard data
const WIZARD_DATA_KEY = "wizard-form-data";
const WIZARD_PROGRESS_KEY = "wizard-progress";

/**
 * Wizard Flow Generator Function with data persistence and API submission
 * Manages the 3-step wizard flow, data collection, persistence, and API calls
 *
 * @returns Generator that yields current step info and handles form submission
 */
export async function* wizardFlowGenerator(): AsyncGenerator<
  WizardStep,
  any,
  any
> {
  // Load existing form data and progress from localStorage
  const savedFormData = loadFromStorage<Record<string, any>>(
    WIZARD_DATA_KEY,
    {}
  );
  const savedProgress = loadFromStorage<number>(WIZARD_PROGRESS_KEY, 0);

  const allFormData: Record<string, any> = { ...savedFormData };

  // Step 1: Personal Information
  const step1Data = yield {
    step: 1,
    message: "Please fill in your personal information",
    isComplete: savedProgress > 0,
  };

  if (step1Data !== null && step1Data !== undefined) {
    allFormData.personalInfo = step1Data;

    // Save to localStorage immediately
    saveToStorage(WIZARD_DATA_KEY, allFormData);
    saveToStorage(WIZARD_PROGRESS_KEY, 1);

    // Submit to API using async/await
    try {
      await submitForm(step1Data);
    } catch (error) {
      // Yield error information for the calling code to handle
      yield {
        step: 1,
        message: "Failed to submit personal information",
        isComplete: false,
        hasError: true,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit data to server. Please try again.",
      };
      return; // Stop processing further steps on error
    }
  }

  // Step 2: Professional Information
  const step2Data = yield {
    step: 2,
    message: "Please provide your professional details",
    isComplete: savedProgress > 1,
  };

  if (step2Data !== null && step2Data !== undefined) {
    allFormData.professionalInfo = step2Data;

    // Save to localStorage immediately
    saveToStorage(WIZARD_DATA_KEY, allFormData);
    saveToStorage(WIZARD_PROGRESS_KEY, 2);

    // Submit to API using async/await
    try {
      await submitForm(step2Data);
    } catch (error) {
      console.error("Failed to submit step 2 data:", error);
      // Yield error information for the calling code to handle
      yield {
        step: 2,
        message: "Failed to submit professional information",
        isComplete: false,
        hasError: true,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit data to server. Please try again.",
      };
      return; // Stop processing further steps on error
    }
  }

  // Step 3: Review & Additional Info
  const step3Data = yield {
    step: 3,
    message: "Please review and add any additional information",
    isComplete: savedProgress > 2,
  };

  if (step3Data !== null && step3Data !== undefined) {
    allFormData.additionalInfo = step3Data;

    // Save to localStorage immediately
    saveToStorage(WIZARD_DATA_KEY, allFormData);
    saveToStorage(WIZARD_PROGRESS_KEY, 3);

    // Submit to API using async/await
    try {
      await submitForm(step3Data);
    } catch (error) {
      console.error("Failed to submit step 3 data:", error);
      // Yield error information for the calling code to handle
      yield {
        step: 3,
        message: "Failed to submit additional information",
        isComplete: false,
        hasError: true,
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit data to server. Please try again.",
      };
      return; // Stop processing further steps on error
    }
  }

  // Final submission - return data for completion
  return {
    success: true,
    allData: allFormData,
    message: "Wizard completed successfully!",
  };
}
