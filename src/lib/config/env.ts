/**
 * Environment Configuration
 *
 * Handles environment variables with validation and type safety.
 * All environment variables in Vite must be prefixed with VITE_
 */

export interface EnvConfig {
  // OpenAI Configuration
  OPENAI_API_KEY: string;
  OPENAI_MODEL: string;
  OPENAI_MAX_TOKENS: number;
  OPENAI_TEMPERATURE: number;

  // App Configuration
  ENV: "development" | "production" | "test";
  API_BASE_URL: string;
}

/**
 * Get environment variable with validation
 * @param key - Environment variable key (without VITE_ prefix)
 * @param defaultValue - Default value if not found
 * @param required - Whether the variable is required
 */
function getEnvVar(
  key: string,
  defaultValue?: string,
  required: boolean = false
): string {
  const fullKey = key.startsWith("VITE_") ? key : `VITE_${key}`;
  const value = import.meta.env[fullKey] || defaultValue;

  if (required && !value) {
    throw new Error(
      `Environment variable ${fullKey} is required but not provided. ` +
        `Please check your .env.local file or environment configuration.`
    );
  }

  return value || "";
}

/**
 * Parse environment variable as number
 * @param key - Environment variable key
 * @param defaultValue - Default numeric value
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse environment variable as float
 * @param key - Environment variable key
 * @param defaultValue - Default numeric value
 */
function getEnvFloat(key: string, defaultValue: number): number {
  const value = getEnvVar(key);
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate OpenAI API key format
 * @param key - API key to validate
 */
function validateOpenAIKey(key: string): boolean {
  // OpenAI API keys typically start with 'sk-' and are 51 characters long
  return key.startsWith("sk-") && key.length >= 40;
}

/**
 * Create and validate environment configuration
 */
function createEnvConfig(): EnvConfig {
  const apiKey = getEnvVar("OPENAI_API_KEY", "", true);

  // Validate OpenAI API key format in production
  if (import.meta.env.PROD && !validateOpenAIKey(apiKey)) {
    console.warn(
      "Invalid OpenAI API key format. Please ensure you have a valid API key from https://platform.openai.com/api-keys"
    );
  }

  return {
    // OpenAI Configuration
    OPENAI_API_KEY: apiKey,
    OPENAI_MODEL: getEnvVar("OPENAI_MODEL", "gpt-3.5-turbo"),
    OPENAI_MAX_TOKENS: getEnvNumber("OPENAI_MAX_TOKENS", 1000),
    OPENAI_TEMPERATURE: getEnvFloat("OPENAI_TEMPERATURE", 0.7),

    // App Configuration
    ENV: getEnvVar("ENV", "development") as EnvConfig["ENV"],
    API_BASE_URL: getEnvVar("API_BASE_URL", "https://api.openai.com/v1"),
  };
}

/**
 * Environment configuration singleton
 * Throws descriptive errors if required variables are missing
 */
export const env = (() => {
  try {
    return createEnvConfig();
  } catch (error) {
    console.error("❌ Environment Configuration Error:", error);

    if (import.meta.env.DEV) {
      console.info(
        "💡 To fix this:\n" +
          "1. Copy .env.example to .env.local\n" +
          "2. Add your OpenAI API key to .env.local\n" +
          "3. Get your API key from: https://platform.openai.com/api-keys"
      );
    }

    // Re-throw to prevent app from running with invalid config
    throw error;
  }
})();

/**
 * Check if OpenAI is properly configured
 */
export const isOpenAIConfigured = (): boolean => {
  try {
    return !!env.OPENAI_API_KEY && validateOpenAIKey(env.OPENAI_API_KEY);
  } catch {
    return false;
  }
};

/**
 * Development helpers
 */
export const isDevelopment = env.ENV === "development";
export const isProduction = env.ENV === "production";
export const isTesting = env.ENV === "test";
