import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm, FormProvider } from "react-hook-form";
import {
  FormPhoneInput,
  validatePhoneNumber,
  formatPhoneNumber,
} from "../components/molecules/FormPhoneInput";

/**
 * Test wrapper component that provides FormProvider context
 */
const TestFormWrapper: React.FC<{
  children: React.ReactNode;
  defaultValues?: Record<string, any>;
}> = ({ children, defaultValues = {} }) => {
  const methods = useForm({
    defaultValues,
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <form>{children}</form>
    </FormProvider>
  );
};

/**
 * Test suite for FormPhoneInput component functionality.
 * Tests react-hook-form integration, validation, and user interactions.
 */
describe("FormPhoneInput Component", () => {
  beforeEach(() => {
    // Clear any previous test state
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("should render phone input components", () => {
      render(
        <TestFormWrapper>
          <FormPhoneInput name="phoneNumber" />
        </TestFormWrapper>
      );

      // Check for country selector button and phone input
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should render with label when provided", () => {
      render(
        <TestFormWrapper>
          <FormPhoneInput name="phoneNumber" label="Phone Number" />
        </TestFormWrapper>
      );

      expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    });

    it("should render with placeholder text", () => {
      render(
        <TestFormWrapper>
          <FormPhoneInput name="phoneNumber" placeholder="Enter phone number" />
        </TestFormWrapper>
      );

      expect(
        screen.getByPlaceholderText("Enter phone number")
      ).toBeInTheDocument();
    });
  });

  describe("Form Integration", () => {
    it("should register with react-hook-form", async () => {
      const user = userEvent.setup();

      render(
        <TestFormWrapper>
          <FormPhoneInput name="phoneNumber" />
        </TestFormWrapper>
      );

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "501234567");

      expect(input).toHaveValue();
    });

    it("should display default value from form provider", () => {
      render(
        <TestFormWrapper defaultValues={{ phoneNumber: "+971501234567" }}>
          <FormPhoneInput name="phoneNumber" />
        </TestFormWrapper>
      );

      const input = screen.getByRole("textbox") as HTMLInputElement;
      // Should have a formatted phone number
      expect(input.value).toContain("50");
      expect(input.value).toContain("123");
    });
  });

  describe("Context Validation", () => {
    it("should throw error when used outside FormProvider", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<FormPhoneInput name="phoneNumber" />);
      }).toThrow(
        "FormPhoneInput must be used within a FormProvider from react-hook-form"
      );

      console.error = originalError;
    });
  });

  describe("Component Props", () => {
    it("should render as disabled when disabled prop is true", () => {
      render(
        <TestFormWrapper>
          <FormPhoneInput name="phoneNumber" disabled={true} />
        </TestFormWrapper>
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("should apply custom className", () => {
      render(
        <TestFormWrapper>
          <FormPhoneInput name="phoneNumber" className="custom-class" />
        </TestFormWrapper>
      );

      // Check if custom class is applied to the container
      const container = screen.getByRole("textbox").closest(".PhoneInput");
      expect(container).toHaveClass("custom-class");
    });
  });
});

/**
 * Test suite for phone number validation utility functions.
 */
describe("Phone Number Utilities", () => {
  describe("validatePhoneNumber", () => {
    it("should return error for empty value", () => {
      const result = validatePhoneNumber("");
      expect(result).toBe("Phone number is required");
    });

    it("should return error for invalid format", () => {
      const result = validatePhoneNumber("123");
      expect(result).toBe("Please enter a valid phone number");
    });

    it("should return undefined for valid UAE number", () => {
      const result = validatePhoneNumber("+971501234567");
      expect(result).toBeUndefined();
    });

    it("should return error for malformed international number", () => {
      // +1234567890 is not a valid format (US numbers need area code)
      const result = validatePhoneNumber("+1234567890");
      expect(result).toBe("Please enter a valid phone number");
    });

    it("should return undefined for valid US number", () => {
      const result = validatePhoneNumber("+12125551234");
      expect(result).toBeUndefined();
    });
  });

  describe("formatPhoneNumber", () => {
    it("should return empty string for empty value", () => {
      const result = formatPhoneNumber("");
      expect(result).toBe("");
    });

    it("should return original value for invalid number", () => {
      const result = formatPhoneNumber("invalid");
      expect(result).toBe("invalid");
    });

    it("should format valid UAE phone number internationally", () => {
      const result = formatPhoneNumber("+971501234567");
      expect(result).toBe("+971 50 123 4567");
    });

    it("should format valid US phone number internationally", () => {
      const result = formatPhoneNumber("+12125551234");
      expect(result).toBe("+1 212-555-1234");
    });
  });
});
