import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { Textarea } from "../atoms/textarea";
import { cn } from "@/lib/utils";
import { useRTL } from "../../lib/hooks/useRTL";

export interface FormTextareaProps {
  /** The name of the field for react-hook-form registration */
  name: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Label for the textarea */
  label?: string;
  /** Number of rows */
  rows?: number;
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** ARIA described by for accessibility */
  "aria-describedby"?: string;
}

/**
 * FormTextarea component with react-hook-form integration
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <FormTextarea name="description" label="Description" rows={4} required />
 * </FormProvider>
 * ```
 */
export const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  placeholder,
  disabled = false,
  required = false,
  className,
  label,
  rows = 3,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}) => {
  const formContext = useFormContext();
  const { isRTL } = useRTL();

  if (!formContext) {
    throw new Error(
      "FormTextarea must be used within a FormProvider from react-hook-form"
    );
  }

  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control: formContext.control,
    rules: { required },
  });

  const textareaId = `${name}-textarea`;
  const errorId = `${name}-error`;
  const hasError = invalid && error;

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label
          htmlFor={textareaId}
          className={cn(
            "block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            hasError ? "text-destructive" : "text-foreground",
            isRTL ? "text-right" : "text-left"
          )}
        >
          {label}
          {required && (
            <span className={cn("text-destructive", isRTL ? "mr-1" : "ml-1")}>
              *
            </span>
          )}
        </label>
      )}

      {/* Textarea */}
      <Textarea
        id={textareaId}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          "min-h-[100px] sm:min-h-[120px] resize-y",
          hasError && "border-red-500 focus:ring-red-500",
          isRTL ? "text-right" : "text-left",
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={hasError ? errorId : ariaDescribedBy}
        aria-invalid={Boolean(hasError)}
        {...field}
      />

      {/* Error Message */}
      {hasError && (
        <p
          id={errorId}
          className={cn(
            "text-sm text-destructive",
            isRTL ? "text-right" : "text-left"
          )}
          role="alert"
          aria-live="polite"
        >
          {error.message}
        </p>
      )}
    </div>
  );
};
