/**
 * Local storage utility functions for persisting wizard progress.
 * Provides type-safe methods for storing and retrieving data.
 */

/**
 * Save data to localStorage with error handling
 * @param key - Storage key
 * @param data - Data to store
 */
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

/**
 * Load data from localStorage with error handling
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Retrieved data or default value
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param key - Storage key to remove
 */
export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
};

/**
 * Clear all localStorage data
 */
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};
