import React, { useState, useMemo } from "react";
import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Search, X, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountrySelectOption } from "../../lib/api/countries";
import { useRTL } from "../../lib/hooks/useRTL";

export interface FormCountrySelectProps {
  /** The name of the field for react-hook-form registration */
  name: string;
  /** Array of country options to display */
  countries: CountrySelectOption[];
  /** Whether countries are currently loading */
  loading?: boolean;
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
  /** Whether to show flags next to country names */
  showFlags?: boolean;
  /** Size of the flag image */
  flagSize?: "sm" | "md" | "lg";
}

/**
 * FormCountrySelect - A high-performance country select component with search functionality
 */
export const FormCountrySelect: React.FC<FormCountrySelectProps> = ({
  name,
  countries,
  loading = false,
  placeholder = "Select country...",
  disabled = false,
  required = false,
  className = "",
  label,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  showFlags = true,
  flagSize = "md",
}) => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  // Form integration
  const formContext = useFormContext();
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

  // Component state
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);

  // Memoized filtered countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countries;
    }

    const query = searchQuery.toLowerCase().trim();
    return countries.filter(
      (country) =>
        country.label.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [countries, searchQuery]);

  // Get selected country
  const selectedCountry = countries.find((country) => country.value === value);

  // Get flag size classes
  const getFlagSizeClasses = () => {
    switch (flagSize) {
      case "sm":
        return "w-4 h-3";
      case "lg":
        return "w-8 h-6";
      default: // 'md'
        return "w-6 h-4";
    }
  };

  // Handle country selection
  const handleSelect = (countryValue: string) => {
    onChange(countryValue);
    onBlur(); // Trigger validation after selection
    setIsOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCountries.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredCountries.length) {
          handleSelect(filteredCountries[focusedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setFocusedIndex(-1);
  };

  // Reset focused index when dropdown opens or search changes
  React.useEffect(() => {
    if (isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen, searchQuery]);

  // Handle error state
  const hasError = Boolean(error);
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

      {/* Custom Select Container */}
      <div className="relative">
        {/* Select Trigger */}
        <button
          id={selectId}
          type="button"
          className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            hasError && [
              "border-destructive",
              "focus-visible:ring-destructive",
            ],
            className
          )}
          disabled={disabled || loading}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          aria-label={ariaLabel}
          aria-describedby={helperId}
          aria-invalid={hasError}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {isRTL && <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />}
          <span
            className={cn(
              "flex items-center gap-2 flex-1",
              isRTL ? "justify-end" : "justify-start"
            )}
          >
            {loading ? (
              "Loading countries..."
            ) : selectedCountry ? (
              <>
                {showFlags && (
                  <img
                    src={selectedCountry.flag}
                    alt={`${selectedCountry.label} flag`}
                    className={`${getFlagSizeClasses()} object-cover rounded-sm shrink-0`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <span className="truncate">{selectedCountry.label}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          {!isRTL && <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />}
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md">
            {/* Search Input */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("common.placeholders.searchCountries")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-auto">
              {loading ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  Loading countries...
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  {searchQuery
                    ? "No countries found"
                    : "No countries available"}
                </div>
              ) : (
                filteredCountries.map((country, index) => (
                  <button
                    key={country.value}
                    type="button"
                    className={cn(
                      "w-full px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none flex items-center gap-2",
                      value === country.value &&
                        "bg-accent text-accent-foreground",
                      focusedIndex === index &&
                        "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handleSelect(country.value)}
                  >
                    {showFlags && (
                      <img
                        src={country.flag}
                        alt={`${country.label} flag`}
                        className={`${getFlagSizeClasses()} object-cover rounded-sm shrink-0`}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <span className="truncate flex-1">{country.label}</span>
                    {value === country.value && (
                      <Check className="h-4 w-4 shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
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

      {/* Click outside handler */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default FormCountrySelect;
