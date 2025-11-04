/**
 * OpenAI HTTP Client
 *
 * Specialized HTTP client for OpenAI API requests with proper authentication,
 * error handling, and streaming support.
 */

import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import { env } from "../config/env";
import {
  AIServiceError,
  AINetworkError,
  AIRateLimitError,
  AIConfigurationError,
  OpenAIErrorResponse,
} from "../types/ai";

/**
 * OpenAI-specific HTTP client with authentication and error handling
 */
class OpenAIClient {
  private instance: AxiosInstance;
  private readonly baseURL = "https://api.openai.com/v1";

  constructor() {
    // Validate API key on initialization
    if (!env.OPENAI_API_KEY) {
      throw new AIConfigurationError(
        "OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env.local file."
      );
    }

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 60000, // 60 seconds for AI requests
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors for error handling
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Add request ID for debugging
        config.headers["X-Request-ID"] = this.generateRequestId();

        // Log request in development
        if (env.ENV === "development") {
          console.debug("🤖 OpenAI Request:", {
            url: config.url,
            method: config.method,
            requestId: config.headers["X-Request-ID"],
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(this.handleRequestError(error));
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful response in development
        if (env.ENV === "development") {
          console.debug("✅ OpenAI Response:", {
            status: response.status,
            requestId: response.config.headers["X-Request-ID"],
          });
        }

        return response;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleResponseError(error));
      }
    );
  }

  /**
   * Handle request-level errors
   */
  private handleRequestError(error: any): Error {
    return new AIServiceError(
      "Failed to prepare OpenAI request",
      "REQUEST_PREPARATION_FAILED",
      undefined,
      error
    );
  }

  /**
   * Handle response-level errors with OpenAI-specific error mapping
   */
  private handleResponseError(error: AxiosError): Error {
    const response = error.response;
    const status = response?.status;

    // Network or timeout errors
    if (!response) {
      if (error.code === "ECONNABORTED") {
        return new AINetworkError(
          "OpenAI request timed out. The AI service may be experiencing high load.",
          undefined,
          error
        );
      }

      return new AINetworkError(
        "Failed to connect to OpenAI service. Please check your internet connection.",
        undefined,
        error
      );
    }

    // Parse OpenAI error response
    const errorData = response.data as OpenAIErrorResponse;
    const errorMessage =
      errorData?.error?.message || "Unknown OpenAI API error";
    const errorType = errorData?.error?.type || "unknown_error";

    switch (status) {
      case 400:
        return new AIServiceError(
          `Invalid request: ${errorMessage}`,
          "INVALID_REQUEST",
          status,
          error
        );

      case 401:
        return new AIServiceError(
          "Invalid OpenAI API key. Please check your configuration.",
          "INVALID_API_KEY",
          status,
          error
        );

      case 403:
        return new AIServiceError(
          "OpenAI API access forbidden. Check your API key permissions.",
          "ACCESS_FORBIDDEN",
          status,
          error
        );

      case 404:
        return new AIServiceError(
          `OpenAI endpoint not found: ${errorMessage}`,
          "ENDPOINT_NOT_FOUND",
          status,
          error
        );

      case 429:
        const retryAfter = response.headers["retry-after"];
        const retrySeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;

        return new AIRateLimitError(
          `OpenAI rate limit exceeded: ${errorMessage}`,
          retrySeconds
        );

      case 500:
      case 502:
      case 503:
      case 504:
        return new AINetworkError(
          `OpenAI service error: ${errorMessage}. Please try again later.`,
          status,
          error
        );

      default:
        return new AIServiceError(
          `OpenAI API error (${status}): ${errorMessage}`,
          errorType.toUpperCase(),
          status,
          error
        );
    }
  }

  /**
   * Generate unique request ID for debugging
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Make a standard HTTP request to OpenAI API
   */
  async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any,
    config?: any
  ): Promise<T> {
    try {
      const response = await this.instance.request({
        method,
        url: endpoint,
        data,
        ...config,
      });

      return response.data;
    } catch (error) {
      // Error is already processed by interceptors
      throw error;
    }
  }

  /**
   * Make a streaming request to OpenAI API
   * Returns a ReadableStream for processing streaming responses
   */
  async streamRequest(
    endpoint: string,
    data: any
  ): Promise<ReadableStream<Uint8Array>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          "X-Request-ID": this.generateRequestId(),
        },
        body: JSON.stringify({ ...data, stream: true }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.createFetchError(response.status, errorData);
      }

      if (!response.body) {
        throw new AIServiceError(
          "No response body received from OpenAI streaming endpoint",
          "NO_RESPONSE_BODY"
        );
      }

      return response.body;
    } catch (error) {
      if (error instanceof AIServiceError) {
        throw error;
      }

      throw new AINetworkError(
        "Failed to establish streaming connection with OpenAI",
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Create error from fetch response for streaming requests
   */
  private createFetchError(status: number, errorData: any): Error {
    const message =
      errorData?.error?.message || "OpenAI streaming request failed";

    switch (status) {
      case 401:
        return new AIServiceError(
          "Invalid OpenAI API key for streaming request",
          "INVALID_API_KEY",
          status
        );
      case 429:
        return new AIRateLimitError(message);
      default:
        return new AIServiceError(message, "STREAMING_ERROR", status);
    }
  }


}

/**
 * Singleton instance of OpenAI client
 */
export const openaiClient = new OpenAIClient();
