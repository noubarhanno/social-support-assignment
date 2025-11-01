import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from "axios";

/**
 * HTTP client instance with interceptors for error handling.
 * Provides centralized configuration and error handling for API calls.
 */
class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add any default headers or auth tokens here
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // You can process the response here if needed
        return response;
      },
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  private handleError(error: AxiosError): Promise<never> {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear session or redirect
      console.warn("Unauthorized access detected");
    }

    // Map error codes to user-friendly messages
    const message = this.getErrorMessage(error);
    return Promise.reject(new Error(message));
  }

  private getErrorMessage(error: AxiosError): string {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return "Invalid request. Please check your input.";
        case 401:
          return "Authentication required. Please log in.";
        case 403:
          return "Access denied. You do not have permission.";
        case 404:
          return "The requested resource was not found.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return "An unexpected error occurred. Please try again.";
      }
    } else if (error.request) {
      return "Network error. Please check your connection.";
    } else {
      return "An unexpected error occurred.";
    }
  }

  /**
   * Get the axios instance for direct use if needed
   */
  getInstance(): AxiosInstance {
    return this.instance;
  }

  /**
   * Make a GET request
   */
  async get<T>(url: string, config = {}): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, config = {}): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

// Export a singleton instance
export const httpClient = new HttpClient();
export default httpClient;
