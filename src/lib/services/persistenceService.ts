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
import { STORAGE_KEYS, STEP_KEYS } from "../utils/constants";

export type WizardFormData = {
  [STEP_KEYS.PERSONAL_INFO]?: PersonalInfoFormData;
  [STEP_KEYS.PROFESSIONAL_INFO]?: FamilyFinancialFormData;
  [STEP_KEYS.ADDITIONAL_INFO]?: SituationDescriptionsFormData;
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
      const currentData = loadFromStorage<WizardFormData>(
        STORAGE_KEYS.WIZARD_DATA,
        {}
      );
      const updatedData = { ...currentData, [stepKey]: data };
      saveToStorage(STORAGE_KEYS.WIZARD_DATA, updatedData);
      this.timers.delete(stepKey);
    }, 1000);

    this.timers.set(stepKey, timer);
  }

  getStepData<T>(stepKey: keyof WizardFormData): T {
    const data = loadFromStorage<WizardFormData>(STORAGE_KEYS.WIZARD_DATA, {});
    return (data[stepKey] as T) || ({} as T);
  }

  clearAllData(): void {
    removeFromStorage(STORAGE_KEYS.WIZARD_DATA);
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}

export const autoSaveService = new AutoSaveService();
