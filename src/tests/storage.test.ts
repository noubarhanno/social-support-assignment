/**
 * Test suite for storage utility functions.
 * Tests localStorage operations with error handling and edge cases.
 */

import {
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  clearStorage,
} from "../lib/utils/storage";

describe("Storage Utilities", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("saveToStorage", () => {
    it("should save simple data to localStorage successfully", () => {
      // Arrange
      const testKey = "test-key";
      const testData = { name: "John", age: 30 };

      // Act
      saveToStorage(testKey, testData);

      // Assert
      expect(localStorage.setItem).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(testData)
      );
      expect(localStorage.getItem(testKey)).toBe(JSON.stringify(testData));
    });

    it("should handle localStorage errors gracefully and log error", () => {
      // Arrange
      const testKey = "test-key";
      const testData = { name: "John" };
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage.setItem to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error("Storage quota exceeded");
      });

      // Act
      saveToStorage(testKey, testData);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save to localStorage:",
        expect.any(Error)
      );

      // Restore
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe("loadFromStorage", () => {
    it("should load existing data or return default value", () => {
      // Test successful load
      const testData = { name: "Jane", age: 25 };
      const defaultValue = { name: "Default", age: 0 };
      localStorage.setItem("test-key", JSON.stringify(testData));

      expect(loadFromStorage("test-key", defaultValue)).toEqual(testData);

      // Test missing key returns default
      expect(loadFromStorage("missing-key", defaultValue)).toEqual(
        defaultValue
      );
    });

    it("should handle errors and return default value", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const defaultValue = { name: "Default", age: 0 };

      // Test invalid JSON
      localStorage.setItem("invalid-json", "invalid-json-{");
      expect(loadFromStorage("invalid-json", defaultValue)).toEqual(
        defaultValue
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load from localStorage:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("removeFromStorage", () => {
    it("should remove existing key from localStorage successfully", () => {
      // Arrange
      const testKey = "test-key";
      const testData = { name: "John" };

      localStorage.setItem(testKey, JSON.stringify(testData));
      expect(localStorage.getItem(testKey)).toBeTruthy();

      // Act
      removeFromStorage(testKey);

      // Assert
      expect(localStorage.removeItem).toHaveBeenCalledWith(testKey);
      expect(localStorage.getItem(testKey)).toBeNull();
    });

    it("should handle localStorage errors gracefully when removing", () => {
      // Arrange
      const testKey = "test-key";
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock localStorage.removeItem to throw an error
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error("localStorage is not available");
      });

      // Act
      removeFromStorage(testKey);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to remove from localStorage:",
        expect.any(Error)
      );

      // Restore
      localStorage.removeItem = originalRemoveItem;
      consoleSpy.mockRestore();
    });
  });

  describe("clearStorage", () => {
    it("should clear all localStorage data successfully", () => {
      localStorage.setItem("key1", "value1");
      localStorage.setItem("key2", "value2");

      clearStorage();

      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle different data types", () => {
      // Test complex object
      const complexData = { user: { name: "John" }, permissions: ["read"] };
      saveToStorage("complex", complexData);
      expect(loadFromStorage("complex", {})).toEqual(complexData);

      // Test primitives
      saveToStorage("string", "hello");
      expect(loadFromStorage("string", "")).toBe("hello");

      saveToStorage("number", 42);
      expect(loadFromStorage("number", 0)).toBe(42);
    });
  });
});
