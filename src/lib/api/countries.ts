/**
 * Country State City API integration
 * Provides real-time data for countries, states, and cities
 */

import { httpClient } from "../http/client";

/**
 * Country data structure from Country State City API
 */
export interface Country {
  iso2: string; // 2-letter country code (ISO format)
  iso3: string; // 3-letter country code
  name: string; // Country name
}

/**
 * State data structure from Country State City API
 */
export interface State {
  name: string;
  state_code?: string; // State code (if available)
}

/**
 * State data structure from Country State City API with cities
 */
export interface CountryWithState extends Country {
  states: State[];
}

/**
 * Select option interface for form components
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Enhanced country select option interface with flag support
 */
export interface CountrySelectOption extends SelectOption {
  code: string; // ISO2 country code for flag display
  flag?: string; // Optional flag URL or emoji
}

/**
 * API response structure for countries endpoint
 */
interface CountriesResponse {
  error: boolean;
  msg: string;
  data: Country[];
}

/**
 * API response structure for states endpoint (with country data)
 */
interface CountryStatesResponse {
  error: boolean;
  msg: string;
  data: CountryWithState;
}

/**
 * Base URL for Country State City API
 */
const API_BASE_URL = "https://countriesnow.space/api/v0.1/countries";

/**
 * Fetches countries from Country State City API
 * @returns Promise<Country[]> List of countries
 */
export async function fetchCountries(): Promise<Country[]> {
  try {
    // Using the countries endpoint that includes basic country info
    const result: CountriesResponse = await httpClient.get(
      `${API_BASE_URL}/positions`
    );

    if (result.error) {
      throw new Error(result.msg || "Failed to fetch countries");
    }
    return result.data;
  } catch (error) {
    throw new Error("Unable to load countries. Please try again.");
  }
}

/**
 * Transforms countries data to select options format
 * @param countries - Array of country objects
 * @returns SelectOption[] - Formatted options for select components
 */
export function transformCountriesToOptions(
  countries: Country[]
): SelectOption[] {
  return countries
    .filter((country) => country.name) // Filter out invalid entries
    .map((country) => ({
      value: country.name, // Use full country name as value for API calls
      label: country.name,
    }))
    .sort((a, b) => (a.label || "").localeCompare(b.label || ""));
}

/**
 * Transforms countries data to enhanced select options format with flag support
 * @param countries - Array of country objects
 * @returns CountrySelectOption[] - Formatted options with flag support
 */
export function transformCountriesToSelectOptions(
  countries: Country[]
): CountrySelectOption[] {
  return countries
    .filter((country) => country.name && country.iso2) // Filter out invalid entries
    .map((country) => ({
      value: country.name, // Use full country name as value for API calls
      label: country.name,
      code: country.iso2.toLowerCase(), // ISO2 code for flag URLs
      flag: `https://flagcdn.com/20x15/${country.iso2.toLowerCase()}.png`, // Flag URL
    }))
    .sort((a, b) => (a.label || "").localeCompare(b.label || ""));
}

/**
 * Fetches countries and transforms them to select options
 * @returns Promise<SelectOption[]> - Formatted country options
 */
export async function fetchCountryOptions(): Promise<SelectOption[]> {
  const countries = await fetchCountries();
  return transformCountriesToOptions(countries);
}

/**
 * Fetches countries and transforms them to enhanced select options with flag support
 * @returns Promise<CountrySelectOption[]> - Formatted country options with flags
 */
export async function fetchCountrySelectOptions(): Promise<
  CountrySelectOption[]
> {
  const countries = await fetchCountries();
  return transformCountriesToSelectOptions(countries);
}

/**
 * Fetches states for a specific country
 * @param countryName - Full country name (e.g., "United States")
 * @returns Promise<State[]> - List of states/provinces
 */
export async function fetchStates(
  countryName: string
): Promise<CountryWithState | null> {
  try {
    const result: CountryStatesResponse = await httpClient.post(
      `${API_BASE_URL}/states`,
      {
        country: countryName,
      }
    );

    if (result.error) {
      // Some countries might not have states - return empty array instead of error
      return null;
    }

    return result.data;
  } catch (error) {
    // Return empty array instead of throwing to handle countries without states
    return null;
  }
}

/**
 * Transforms states data to select options format
 * @param states - Array of state objects
 * @returns SelectOption[] - Formatted options for select components
 */
export function transformStatesToOptions(states: State[]): SelectOption[] {
  return states
    .filter((state) => state.name) // Filter out invalid entries
    .map((state) => ({
      value: state.name, // Use full state name for API calls
      label: state.name,
    }))
    .sort((a, b) => (a.label || "").localeCompare(b.label || ""));
}

/**
 * Fetches states for a country and transforms them to select options
 * @param countryName - Full country name
 * @returns Promise<SelectOption[]> - Formatted state options
 */
export async function fetchStateOptions(
  countryName: string
): Promise<SelectOption[]> {
  const states = await fetchStates(countryName);
  return transformStatesToOptions(states?.states || []);
}
