/**
 * Simple mock API for form submissions - Always returns success
 */

/**
 * Simple API response structure
 */
export interface ApiResponse {
  success: boolean;
  message: string;
}

/**
 * Simulate network delay
 */
const delay = (ms: number = 2000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Submit any form data - Always returns success
 * @param _data Any form data object (unused - always returns success)
 * @returns Promise<ApiResponse> Always successful response
 */
export async function submitForm(_data: any): Promise<ApiResponse> {
  // Simulate realistic network delay
  await delay(Math.random() * 1000 + 500);

  // Always return success with unique submission ID
  return {
    success: true,
    message: "Form submitted successfully!",
  };
}

export default { submitForm };
