import React from "react";
import { useController, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface EnhancedSelectOption extends SelectOption {
  [key: string]: any; // Allow additional properties for enhanced options
}

export interface FormSelectProps {
  /** The name of the field for react-hook-form registration */
  name: string;
  /** Select options */
  options: SelectOption[] | EnhancedSelectOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Label for the select */
  label?: string;
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** ARIA described by for accessibility */
  "aria-describedby"?: string;
  /** Loading state for async options */
  loading?: boolean;
  /** Custom option renderer */
  renderOption?: (
    option: SelectOption | EnhancedSelectOption
  ) => React.ReactNode;
  /** Custom selected value renderer */
  renderSelectedValue?: (
    option: SelectOption | EnhancedSelectOption | undefined
  ) => React.ReactNode;
}

/**
 * FormSelect component with react-hook-form integration
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <FormSelect
 *     name="country"
 *     label="Country"
 *     options={countryOptions}
 *     required
 *   />
 * </FormProvider>
 * ```
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  options,
  placeholder,
  disabled = false,
  required = false,
  className,
  label,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  loading = false,
  renderOption,
  renderSelectedValue,
}) => {
  const formContext = useFormContext();

  if (!formContext) {
    throw new Error(
      "FormSelect must be used within a FormProvider from react-hook-form"
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

  // Determine if select has error state
  const hasError = Boolean(error);

  // Generate IDs for accessibility
  const selectId = `${name}-select`;
  const errorId = `${name}-error`;
  const helperId = ariaDescribedBy || (hasError ? errorId : undefined);

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
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

      {/* Select */}
      <Select
        value={value || ""}
        onValueChange={onChange}
        disabled={disabled || loading}
        required={required}
        aria-label={ariaLabel}
        aria-describedby={helperId}
        aria-invalid={hasError}
      >
        <SelectTrigger
          id={selectId}
          className={cn(
            // Error styles
            hasError && [
              "border-destructive",
              "focus-visible:ring-destructive",
            ],
            className
          )}
          onBlur={onBlur}
        >
          <SelectValue placeholder={loading ? "Loading..." : placeholder}>
            {renderSelectedValue && value
              ? renderSelectedValue(options.find((opt) => opt.value === value))
              : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem value="__loading__" disabled>
              Loading options...
            </SelectItem>
          ) : options.length === 0 ? (
            <SelectItem value="__no_options__" disabled>
              No options available
            </SelectItem>
          ) : (
            options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {renderOption ? renderOption(option) : option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

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
