/**
 * Countries data with ISO codes
 * Static data to replace external API dependency
 *
 * TODO: Replace with proper API integration
 * This static data should eventually be fetched from a reliable countries API service
 * Consider using:
 * - REST Countries API (https://restcountries.com/)
 * - Country State City API with proper authentication
 * - Self-hosted database with regular updates
 */

export interface Country {
  iso2: string; // 2-letter country code (ISO format)
  iso3: string; // 3-letter country code
  name: string; // Country name
}

export interface CountrySelectOption {
  value: string;
  label: string;
  code: string; // ISO2 country code for flag display
  flag?: string; // Optional flag URL or emoji
}

/**
 * Comprehensive list of countries with ISO codes
 */
export const COUNTRIES: Country[] = [
  { iso2: "US", iso3: "USA", name: "United States" },
  { iso2: "CA", iso3: "CAN", name: "Canada" },
  { iso2: "GB", iso3: "GBR", name: "United Kingdom" },
  { iso2: "AU", iso3: "AUS", name: "Australia" },
  { iso2: "DE", iso3: "DEU", name: "Germany" },
  { iso2: "FR", iso3: "FRA", name: "France" },
  { iso2: "IT", iso3: "ITA", name: "Italy" },
  { iso2: "ES", iso3: "ESP", name: "Spain" },
  { iso2: "NL", iso3: "NLD", name: "Netherlands" },
  { iso2: "BE", iso3: "BEL", name: "Belgium" },
  { iso2: "CH", iso3: "CHE", name: "Switzerland" },
  { iso2: "AT", iso3: "AUT", name: "Austria" },
  { iso2: "SE", iso3: "SWE", name: "Sweden" },
  { iso2: "NO", iso3: "NOR", name: "Norway" },
  { iso2: "DK", iso3: "DNK", name: "Denmark" },
  { iso2: "FI", iso3: "FIN", name: "Finland" },
  { iso2: "PL", iso3: "POL", name: "Poland" },
  { iso2: "CZ", iso3: "CZE", name: "Czech Republic" },
  { iso2: "GR", iso3: "GRC", name: "Greece" },
  { iso2: "PT", iso3: "PRT", name: "Portugal" },
  { iso2: "IE", iso3: "IRL", name: "Ireland" },
  { iso2: "NZ", iso3: "NZL", name: "New Zealand" },
  { iso2: "JP", iso3: "JPN", name: "Japan" },
  { iso2: "CN", iso3: "CHN", name: "China" },
  { iso2: "IN", iso3: "IND", name: "India" },
  { iso2: "BR", iso3: "BRA", name: "Brazil" },
  { iso2: "MX", iso3: "MEX", name: "Mexico" },
  { iso2: "AR", iso3: "ARG", name: "Argentina" },
  { iso2: "CL", iso3: "CHL", name: "Chile" },
  { iso2: "CO", iso3: "COL", name: "Colombia" },
  { iso2: "PE", iso3: "PER", name: "Peru" },
  { iso2: "ZA", iso3: "ZAF", name: "South Africa" },
  { iso2: "NG", iso3: "NGA", name: "Nigeria" },
  { iso2: "EG", iso3: "EGY", name: "Egypt" },
  { iso2: "KE", iso3: "KEN", name: "Kenya" },
  { iso2: "SA", iso3: "SAU", name: "Saudi Arabia" },
  { iso2: "AE", iso3: "ARE", name: "United Arab Emirates" },
  { iso2: "IL", iso3: "ISR", name: "Israel" },
  { iso2: "TR", iso3: "TUR", name: "Turkey" },
  { iso2: "RU", iso3: "RUS", name: "Russia" },
  { iso2: "UA", iso3: "UKR", name: "Ukraine" },
  { iso2: "KR", iso3: "KOR", name: "South Korea" },
  { iso2: "TH", iso3: "THA", name: "Thailand" },
  { iso2: "VN", iso3: "VNM", name: "Vietnam" },
  { iso2: "MY", iso3: "MYS", name: "Malaysia" },
  { iso2: "SG", iso3: "SGP", name: "Singapore" },
  { iso2: "PH", iso3: "PHL", name: "Philippines" },
  { iso2: "ID", iso3: "IDN", name: "Indonesia" },
  { iso2: "PK", iso3: "PAK", name: "Pakistan" },
  { iso2: "BD", iso3: "BGD", name: "Bangladesh" },
];

/**
 * Transform countries to select options with flags
 */
export function getCountrySelectOptions(): CountrySelectOption[] {
  return COUNTRIES.map((country) => ({
    value: country.name,
    label: country.name,
    code: country.iso2.toLowerCase(),
    flag: `https://flagcdn.com/20x15/${country.iso2.toLowerCase()}.png`,
  })).sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Get country by name
 */
export function getCountryByName(name: string): Country | undefined {
  return COUNTRIES.find((country) => country.name === name);
}

/**
 * Get country by ISO2 code
 */
export function getCountryByIso2(iso2: string): Country | undefined {
  return COUNTRIES.find(
    (country) => country.iso2.toLowerCase() === iso2.toLowerCase()
  );
}
