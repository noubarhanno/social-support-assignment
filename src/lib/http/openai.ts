/**
 * OpenAI HTTP Client
 *
 * Specialized HTTP client for OpenAI API requests with proper authentication,
 * error handling, and streaming support.
 */

import { env } from "../config/env";
import {
  AIServiceError,
  AINetworkError,
  AIRateLimitError,
  AIConfigurationError,
} from "../types/ai";

/**
 * OpenAI-specific HTTP client with authentication and error handling
 */
class OpenAIClient {
  private readonly baseURL = "https://api.openai.com/v1";
  private readonly apiKey: string;

  constructor() {
    // Validate API key on initialization
    if (!env.OPENAI_API_KEY) {
      throw new AIConfigurationError(
        "OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env.local file."
      );
    }

    this.apiKey = env.OPENAI_API_KEY;
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
          Authorization: `Bearer ${this.apiKey}`,
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
