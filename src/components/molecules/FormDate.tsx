import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "../atoms/button";
import { Calendar } from "../atoms/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../atoms/popover";
import { cn } from "@/lib/utils";

export interface FormDateProps {
  /** The name of the field for react-hook-form registration */
  name: string;
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
  /** Date format for display (default: "MM/dd/yyyy") */
  dateFormat?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Whether to show calendar icon */
  showCalendarIcon?: boolean;
  /** Enable dropdown navigation for year/month (ideal for date of birth) */
  enableDropdownNavigation?: boolean;
}

/**
 * FormDate component with react-hook-form integration
 * @example
 * ```tsx
 * <FormDate
 *   name="dateOfBirth"
 *   label="Date of Birth"
 *   placeholder="Select your date of birth"
 *   maxDate={new Date()}
 *   enableDropdownNavigation={true}
 *   required
 * />
 * ```
 */
export const FormDate: React.FC<FormDateProps> = ({
  name,
  placeholder = "Select a date...",
  disabled = false,
  required = false,
  className,
  label,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  dateFormat = "MM/dd/yyyy",
  minDate,
  maxDate,
  showCalendarIcon = true,
  enableDropdownNavigation = false,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const formContext = useFormContext();

  if (!formContext) {
    throw new Error(
      "FormDate must be used within a FormProvider from react-hook-form"
    );
  }

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: formContext.control,
    rules: {
      required: required ? `${label || name} is required` : false,
      validate: (value) => {
        if (!value) return true; // Allow empty if not required

        // Parse the value (could be string or Date)
        let date: Date;
        if (typeof value === "string") {
          // Try to parse as formatted string first, then as ISO string
          date = parse(value, dateFormat, new Date());
          if (!isValid(date)) {
            date = new Date(value);
          }
        } else if (value instanceof Date) {
          date = value;
        } else {
          return "Invalid date format";
        }

        if (!isValid(date)) {
          return "Invalid date format";
        }

        if (minDate && date < minDate) {
          return `Date must be after ${format(minDate, dateFormat)}`;
        }

        if (maxDate && date > maxDate) {
          return `Date must be before ${format(maxDate, dateFormat)}`;
        }

        return true;
      },
    },
    defaultValue: "",
  });

  // Determine if input has error state
  const hasError = Boolean(error);

  // Generate IDs for accessibility
  const inputId = `${name}-date`;
  const errorId = `${name}-error`;
  const helperId = ariaDescribedBy || (hasError ? errorId : undefined);

  // Convert value to Date object for calendar
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined;

    let date: Date;
    if (typeof value === "string") {
      // Try to parse as formatted string first, then as ISO string
      date = parse(value, dateFormat, new Date());
      if (!isValid(date)) {
        date = new Date(value);
      }
    } else if (value instanceof Date) {
      date = value;
    } else {
      return undefined;
    }

    return isValid(date) ? date : undefined;
  }, [value, dateFormat]);

  // Format date for display in input
  const displayValue = React.useMemo(() => {
    if (!selectedDate) return "";
    return format(selectedDate, dateFormat);
  }, [selectedDate, dateFormat]);

  // Handle calendar date selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      // Store as formatted string for consistency
      onChange(format(date, dateFormat));
      setIsPopoverOpen(false);
    } else {
      onChange("");
    }
  };

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

      {/* Date Input */}
      <div className="relative">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-between text-left font-normal h-10 px-3 py-2",
                !displayValue && "text-muted-foreground",
                hasError && [
                  "border-destructive",
                  "focus-visible:ring-destructive",
                ],
                className
              )}
              disabled={disabled}
              id={inputId}
              aria-label={ariaLabel || `Select ${label || "date"}`}
              aria-describedby={helperId}
              aria-invalid={hasError}
              aria-expanded={isPopoverOpen}
              aria-haspopup="dialog"
            >
              <span className="truncate">
                {displayValue || (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </span>
              {showCalendarIcon && (
                <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return disabled || false;
              }}
              captionLayout={enableDropdownNavigation ? "dropdown" : "label"}
              startMonth={
                enableDropdownNavigation ? new Date(1900, 0) : undefined
              }
              endMonth={
                enableDropdownNavigation ? new Date(2030, 11) : undefined
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

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

export default FormDate;
