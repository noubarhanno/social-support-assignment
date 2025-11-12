/**
 * Simple auto-save service for form data persistence
 */
import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
} from "../utils/storage";
import { PersonalInfoFormData } from "../schema/validation";
import { FamilyFinancialFormData } from "../schema/validation";
import { SituationDescriptionsFormData } from "../schema/validation";

const STORAGE_KEY = "wizard-form-data";

export type WizardFormData = {
  personalInfo?: PersonalInfoFormData;
  professionalInfo?: FamilyFinancialFormData;
  additionalInfo?: SituationDescriptionsFormData;
};

class AutoSaveService {
  private timers: Map<string, number> = new Map();

  debouncedSave<T>(stepKey: keyof WizardFormData, data: T): void {
    // Clear existing timer
    const existingTimer = this.timers.get(stepKey);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      const currentData = loadFromStorage<WizardFormData>(STORAGE_KEY, {});
      const updatedData = { ...currentData, [stepKey]: data };
      saveToStorage(STORAGE_KEY, updatedData);
      this.timers.delete(stepKey);
    }, 1000);

    this.timers.set(stepKey, timer);
  }

  getStepData<T>(stepKey: keyof WizardFormData): T {
    const data = loadFromStorage<WizardFormData>(STORAGE_KEY, {});
    return (data[stepKey] as T) || ({} as T);
  }

  clearAllData(): void {
    removeFromStorage(STORAGE_KEY);
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}

export const autoSaveService = new AutoSaveService();
