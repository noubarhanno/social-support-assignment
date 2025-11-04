/**
 * useAI Hook
 *
 * React hook for integrating OpenAI functionality into React components.
 * Provides both streaming and standard completion capabilities with proper
 * error handling and loading states.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { openaiService } from "../api/openai";
import {
  AIAssistantRequest,
  AIAssistantResponse,
  AIStreamingResponse,
  AIAssistantConfig,
  AIServiceError,
  AINetworkError,
  AIRateLimitError,
} from "../types/ai";

/**
 * Hook state interface
 */
interface UseAIState {
  // Data
  response: string;
  fullResponse: AIAssistantResponse | null;

  // Loading states
  isLoading: boolean;
  isStreaming: boolean;

  // Error handling
  error: string | null;
  errorDetails: Error | null;

  // Meta information
  usage: AIAssistantResponse["usage"] | null;
  requestId: string | null;
}

/**
 * Hook return interface
 */
interface UseAIReturn extends UseAIState {
  // Actions
  generateCompletion: (
    request: AIAssistantRequest,
    config?: Partial<AIAssistantConfig>
  ) => Promise<void>;
  generateStreaming: (
    request: AIAssistantRequest,
    config?: Partial<AIAssistantConfig>
  ) => Promise<void>;

  // Control
  reset: () => void;
  cancel: () => void;

  // Utilities
  testConnection: () => Promise<boolean>;
  retry: () => Promise<void>;
}

/**
 * Configuration options for the hook
 */
interface UseAIOptions {
  // Auto-reset error after delay
  autoResetError?: boolean;
  errorResetDelay?: number;

  // Default configuration
  defaultConfig?: Partial<AIAssistantConfig>;
}

/**
 * Custom hook for OpenAI integration
 */
export const useAI = (options: UseAIOptions = {}): UseAIReturn => {
  const {
    autoResetError = true,
    errorResetDelay = 5000,
    defaultConfig = {},
  } = options;

  // State management
  const [state, setState] = useState<UseAIState>({
    response: "",
    fullResponse: null,
    isLoading: false,
    isStreaming: false,
    error: null,
    errorDetails: null,
    usage: null,
    requestId: null,
  });

  // Refs for cleanup and retry functionality
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<{
    type: "completion" | "streaming" | "form";
    params: any;
  } | null>(null);
  const errorTimeoutRef = useRef<number | null>(null);

  /**
   * Set error with auto-reset functionality
   */
  const setError = useCallback(
    (error: string, errorDetails: Error | null = null) => {
      setState((prev) => ({
        ...prev,
        error,
        errorDetails,
        isLoading: false,
        isStreaming: false,
      }));

      // Auto-reset error after delay
      if (autoResetError) {
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }

        errorTimeoutRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            error: null,
            errorDetails: null,
          }));
        }, errorResetDelay);
      }
    },
    [autoResetError, errorResetDelay]
  );

  /**
   * Handle different types of AI service errors
   */
  const handleError = useCallback(
    (error: Error) => {
      if (error instanceof AIRateLimitError) {
        setError(
          `Rate limit exceeded. ${
            error.retryAfter
              ? `Please try again in ${error.retryAfter} seconds.`
              : "Please try again later."
          }`,
          error
        );
      } else if (error instanceof AINetworkError) {
        setError(
          "Network error. Please check your connection and try again.",
          error
        );
      } else if (error instanceof AIServiceError) {
        switch (error.code) {
          case "INVALID_API_KEY":
            setError(
              "Invalid API key. Please check your OpenAI configuration.",
              error
            );
            break;
          case "ACCESS_FORBIDDEN":
            setError(
              "Access denied. Please verify your API key permissions.",
              error
            );
            break;
          default:
            setError(error.message || "AI service error occurred.", error);
        }
      } else {
        setError("An unexpected error occurred. Please try again.", error);
      }
    },
    [setError]
  );

  /**
   * Generate standard completion
   */
  const generateCompletion = useCallback(
    async (
      request: AIAssistantRequest,
      config?: Partial<AIAssistantConfig>
    ) => {
      try {
        // Store request for retry functionality
        lastRequestRef.current = {
          type: "completion",
          params: { request, config },
        };

        setState((prev) => ({
          ...prev,
          isLoading: true,
          isStreaming: false,
          error: null,
          errorDetails: null,
          response: "",
          fullResponse: null,
          requestId: `req_${Date.now()}`,
        }));

        const finalConfig = { ...defaultConfig, ...config };
        const response = await openaiService.generateCompletion(
          request,
          finalConfig
        );

        setState((prev) => ({
          ...prev,
          isLoading: false,
          response: response.content,
          fullResponse: response,
          usage: response.usage,
        }));
      } catch (error) {
        handleError(error instanceof Error ? error : new Error(String(error)));
      }
    },
    [defaultConfig, handleError]
  );

  /**
   * Generate streaming completion
   */
  const generateStreaming = useCallback(
    async (
      request: AIAssistantRequest,
      config?: Partial<AIAssistantConfig>
    ) => {
      try {
        // Store request for retry functionality
        lastRequestRef.current = {
          type: "streaming",
          params: { request, config },
        };

        setState((prev) => ({
          ...prev,
          isLoading: true,
          isStreaming: true,
          error: null,
          errorDetails: null,
          response: "",
          fullResponse: null,
          requestId: `stream_${Date.now()}`,
        }));

        const finalConfig = { ...defaultConfig, ...config };

        await openaiService.generateStreamingCompletion(
          request,
          (chunk: AIStreamingResponse) => {
            setState((prev) => ({
              ...prev,
              response: chunk.content,
              isLoading: chunk.isComplete ? false : prev.isLoading,
              isStreaming: !chunk.isComplete,
              usage: chunk.usage || prev.usage,
            }));

            if (chunk.isComplete) {
              // Streaming completed
            }
          },
          (error: Error) => {
            handleError(error);
          },
          finalConfig
        );
      } catch (error) {
        handleError(error instanceof Error ? error : new Error(String(error)));
      }
    },
    [defaultConfig, handleError]
  );

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear error timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setState({
      response: "",
      fullResponse: null,
      isLoading: false,
      isStreaming: false,
      error: null,
      errorDetails: null,
      usage: null,
      requestId: null,
    });

    lastRequestRef.current = null;
  }, []);

  /**
   * Cancel ongoing request
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState((prev) => ({
      ...prev,
      isLoading: false,
      isStreaming: false,
    }));
  }, []);

  /**
   * Test OpenAI connection
   */
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const result = await openaiService.testConnection();
      return result;
    } catch (error) {
      return false;
    }
  }, []);

  /**
   * Retry last request
   */
  const retry = useCallback(async () => {
    const lastRequest = lastRequestRef.current;
    if (!lastRequest) {
      return;
    }

    switch (lastRequest.type) {
      case "completion":
        await generateCompletion(
          lastRequest.params.request,
          lastRequest.params.config
        );
        break;
      case "streaming":
        await generateStreaming(
          lastRequest.params.request,
          lastRequest.params.config
        );
        break;
    }
  }, [generateCompletion, generateStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    ...state,

    // Actions
    generateCompletion,
    generateStreaming,

    // Control
    reset,
    cancel,

    // Utilities
    testConnection,
    retry,
  };
};
