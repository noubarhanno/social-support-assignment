import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { Input } from "../atoms/input";
import { cn } from "@/lib/utils";

export interface FormInputProps {
  /** The name of the field for react-hook-form registration */
  name: string;
  /** Input type */
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date";
  /** Placeholder text */
  placeholder?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Label for the input */
  label?: string;
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** ARIA described by for accessibility */
  "aria-describedby"?: string;
}

/**
 * FormInput component with react-hook-form integration
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <FormInput name="firstName" label="First Name" required />
 * </FormProvider>
 * ```
 */
export const FormInput: React.FC<FormInputProps> = ({
  name,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  className,
  label,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}) => {
  const formContext = useFormContext();

  if (!formContext) {
    throw new Error(
      "FormInput must be used within a FormProvider from react-hook-form"
    );
  }

  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({
    name,
    control: formContext.control,
    rules: {
      required: required ? `${label || name} is required` : false,
    },
    defaultValue: "",
  });

  // Determine if input has error state
  const hasError = Boolean(error);

  // Generate IDs for accessibility
  const inputId = `${name}-input`;
  const errorId = `${name}-error`;
  const helperId = ariaDescribedBy || (hasError ? errorId : undefined);

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && (
            <span className="ml-1 text-destructive" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Input */}
      <Input
        id={inputId}
        type={type}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-label={ariaLabel}
        aria-describedby={helperId}
        aria-invalid={hasError}
        className={cn(
          // Error styles
          hasError && ["border-destructive", "focus-visible:ring-destructive"],
          className
        )}
      />

      {/* Error Message */}
      {hasError && error && (
        <p
          id={errorId}
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </p>
      )}
    </div>
  );
};
