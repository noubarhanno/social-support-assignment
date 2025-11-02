import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import { PhoneInput } from "../atoms/phone-input";
import { cn } from "@/lib/utils";

const phoneUtil = PhoneNumberUtil.getInstance();

export interface FormPhoneInputProps {
  /** The name of the field for react-hook-form registration */
  name: string;
  /** Default country code (ISO 3166-1 alpha-2) */
  defaultCountry?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Label for the input */
  label?: string;
}

/**
 * Validates a phone number using Google's libphonenumber
 * @param value - The phone number value to validate
 * @returns Error message if invalid, undefined if valid
 */
const validatePhoneNumber = (value: string): string | undefined => {
  if (!value) {
    return "Phone number is required";
  }

  try {
    const number = phoneUtil.parseAndKeepRawInput(value, undefined);

    if (!phoneUtil.isValidNumber(number)) {
      return "Please enter a valid phone number";
    }

    return undefined;
  } catch (error) {
    return "Please enter a valid phone number";
  }
};

/**
 * Formats a phone number for display using Google's libphonenumber
 * @param value - The phone number value to format
 * @returns Formatted phone number or original value if invalid
 */
const formatPhoneNumber = (value: string): string => {
  if (!value) return value;

  try {
    const number = phoneUtil.parseAndKeepRawInput(value, undefined);
    if (phoneUtil.isValidNumber(number)) {
      return phoneUtil.format(number, PhoneNumberFormat.INTERNATIONAL);
    }
  } catch (error) {
    // Return original value if formatting fails
  }

  return value;
};

/**
 * FormPhoneInput component with react-hook-form integration
 *
 * Features:
 * - Automatic form registration with react-hook-form
 * - Google libphonenumber validation
 * - Error display from form context
 * - Default value handling from form provider
 * - Reset functionality through form context
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <FormPhoneInput name="phoneNumber" defaultCountry="AE" />
 * </FormProvider>
 * ```
 */
export const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  name,
  defaultCountry = "AE", // Default to UAE
  placeholder = "Enter your phone number",
  disabled = false,
  className,
  label,
}) => {
  const formContext = useFormContext();

  if (!formContext) {
    throw new Error(
      "FormPhoneInput must be used within a FormProvider from react-hook-form"
    );
  }

  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control: formContext.control,
    rules: {
      validate: validatePhoneNumber,
    },
    defaultValue: "",
  });

  // Handle phone number change
  const handleChange = (phoneValue: string | undefined) => {
    onChange(phoneValue || "");
  };

  // Determine if input has error state
  const hasError = Boolean(error);

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <PhoneInput
          id={name}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          defaultCountry={defaultCountry as any}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full",
            // Error styles
            hasError && [
              "[&>input]:border-destructive",
              "[&>input]:focus-visible:ring-destructive",
              "[&>button]:border-destructive",
            ],
            className
          )}
          // International format preference
          international
          smartCaret={false}
          addInternationalOption={false}
        />
      </div>

      {hasError && error && (
        <p className="text-sm text-destructive" role="alert" aria-live="polite">
          {error.message}
        </p>
      )}

      {value && !hasError && (
        <p className="text-sm text-muted-foreground">
          Formatted: {formatPhoneNumber(value)}
        </p>
      )}
    </div>
  );
};

export { validatePhoneNumber, formatPhoneNumber };
