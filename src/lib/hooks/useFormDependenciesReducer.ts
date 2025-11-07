import { useReducer, useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  fetchStateOptions,
  fetchCountrySelectOptions,
  type CountrySelectOption,
  type SelectOption,
} from "../api/countries";

// State management using reducer pattern (modern approach)
interface FormDependencyState {
  countries: CountrySelectOption[];
  states: SelectOption[];
  loadingCountries: boolean;
  loadingStates: boolean;
  selectedCountry: string | null;
  selectedState: string | null;
}

type FormDependencyAction =
  | { type: "SET_COUNTRIES"; payload: CountrySelectOption[] }
  | { type: "SET_STATES"; payload: SelectOption[] }
  | { type: "SET_LOADING_COUNTRIES"; payload: boolean }
  | { type: "SET_LOADING_STATES"; payload: boolean }
  | { type: "COUNTRY_CHANGED"; payload: string }
  | { type: "STATE_CHANGED"; payload: string }
  | { type: "CLEAR_STATES" }
  | { type: "CLEAR_DEPENDENCIES" };

const initialState: FormDependencyState = {
  countries: [],
  states: [],
  loadingCountries: true,
  loadingStates: false,
  selectedCountry: null,
  selectedState: null,
};

function formDependencyReducer(
  state: FormDependencyState,
  action: FormDependencyAction
): FormDependencyState {
  switch (action.type) {
    case "SET_COUNTRIES":
      return {
        ...state,
        countries: action.payload,
        loadingCountries: false,
      };

    case "SET_STATES":
      return {
        ...state,
        states: action.payload,
        loadingStates: false,
      };

    case "SET_LOADING_COUNTRIES":
      return {
        ...state,
        loadingCountries: action.payload,
      };

    case "SET_LOADING_STATES":
      return {
        ...state,
        loadingStates: action.payload,
      };

    case "COUNTRY_CHANGED":
      return {
        ...state,
        selectedCountry: action.payload,
        selectedState: null, // Clear state when country changes
        states: [], // Clear states list
      };

    case "STATE_CHANGED":
      return {
        ...state,
        selectedState: action.payload,
      };

    case "CLEAR_STATES":
      return {
        ...state,
        states: [],
        selectedState: null,
        loadingStates: false,
      };

    case "CLEAR_DEPENDENCIES":
      return {
        ...state,
        states: [],
        selectedCountry: null,
        selectedState: null,
      };

    default:
      return state;
  }
}

/**
 * Modern reducer-based hook for form dependencies
 *
 * Benefits:
 * - Predictable state updates
 * - Easy to test and debug
 * - Clear separation of concerns
 * - No complex useEffect chains
 * - Automatic dependency clearing through reducer logic
 */
export function useFormDependenciesReducer() {
  const { setValue, clearErrors, watch, setError, getValues } =
    useFormContext();
  const [state, dispatch] = useReducer(formDependencyReducer, initialState);
  const isInitialLoadRef = useRef(true);
  const savedValuesRef = useRef<{ state?: string; city?: string }>({});
  const processingCountryRef = useRef<string | null>(null);

  // Watch form values
  const watchedCountry = watch("country");
  const watchedState = watch("state");

  // Load countries on mount
  useEffect(() => {
    let isMounted = true;

    const loadCountries = async () => {
      try {
        dispatch({ type: "SET_LOADING_COUNTRIES", payload: true });
        const countries = await fetchCountrySelectOptions();

        if (isMounted) {
          dispatch({ type: "SET_COUNTRIES", payload: countries });
        }
      } catch (error) {
        if (isMounted) {
          dispatch({ type: "SET_LOADING_COUNTRIES", payload: false });
          setError("country", {
            type: "api",
            message: "Failed to load countries. Please try again.",
          });
        }
      }
    };

    loadCountries();

    return () => {
      isMounted = false;
    };
  }, [setError]);

  // Handle country changes with automatic state clearing
  const handleCountryChange = useCallback(
    async (newCountry: string) => {
      // Prevent duplicate calls for the same country
      if (processingCountryRef.current === newCountry) {
        return;
      }

      processingCountryRef.current = newCountry;
      dispatch({ type: "COUNTRY_CHANGED", payload: newCountry });

      // During initial load, preserve the saved state/city values
      if (isInitialLoadRef.current) {
        const currentValues = getValues();
        savedValuesRef.current = {
          state: currentValues.state,
          city: currentValues.city,
        };
      } else {
        // Normal behavior: clear form fields
        setValue("state", "");
        setValue("city", "");
        setValue("phoneNumber", "");
        clearErrors(["state", "city", "phoneNumber"]);
      }

      if (!newCountry) {
        processingCountryRef.current = null;
        return;
      }

      try {
        dispatch({ type: "SET_LOADING_STATES", payload: true });
        const states = await fetchStateOptions(newCountry);
        dispatch({ type: "SET_STATES", payload: states });

        // If this was initial load and we have saved values, restore them
        if (isInitialLoadRef.current && savedValuesRef.current.state) {
          setValue("state", savedValuesRef.current.state);

          if (savedValuesRef.current.city) {
            setValue("city", savedValuesRef.current.city);
          }
        }

        // Set initial load flag to false AFTER async operation completes
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
        }

        // Reset processing flag
        processingCountryRef.current = null;
      } catch (error) {
        console.error("❌ Error fetching states:", error);
        dispatch({ type: "CLEAR_STATES" });

        // Set flag to false even on error
        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
        }

        // Reset processing flag even on error
        processingCountryRef.current = null;
      }
    },
    [setValue, clearErrors, getValues]
  );

  // Handle state changes with city clearing
  const handleStateChange = useCallback(
    (newState: string) => {
      dispatch({ type: "STATE_CHANGED", payload: newState });

      // Clear city when state changes
      setValue("city", "");
      clearErrors(["city"]);
    },
    [setValue, clearErrors]
  );

  // React to watched value changes
  useEffect(() => {
    if (watchedCountry !== state.selectedCountry) {
      handleCountryChange(watchedCountry);
      // DON'T set flag to false here - let handleCountryChange do it after async completion
    }
  }, [watchedCountry, state.selectedCountry, handleCountryChange]);
  useEffect(() => {
    if (watchedState !== state.selectedState) {
      handleStateChange(watchedState);
    }
  }, [watchedState, state.selectedState, handleStateChange]);

  return {
    // Data
    countryOptions: state.countries,
    stateOptions: state.states,

    // Loading states
    loadingCountries: state.loadingCountries,
    loadingStates: state.loadingStates,

    // Current values
    selectedCountry: state.selectedCountry,
    selectedState: state.selectedState,

    // Actions
    dispatch,
  };
}
