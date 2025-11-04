import { openaiClient } from "../http/openai";
import { env } from "../config/env";
import {
  AIAssistantRequest,
  AIAssistantResponse,
  StreamingCallback,
  StreamingErrorCallback,
  OpenAICompletionRequest,
  OpenAICompletionResponse,
  OpenAIStreamChunk,
  AIAssistantConfig,
  AIServiceError,
} from "../types/ai";

/**
 * OpenAI API Service class with streaming and standard completion support
 */
class OpenAIService {
  private readonly defaultConfig: Required<AIAssistantConfig> = {
    model: env.OPENAI_MODEL,
    maxTokens: env.OPENAI_MAX_TOKENS,
    temperature: env.OPENAI_TEMPERATURE,
    systemPrompt:
      "You are a helpful AI assistant that provides clear, concise, and accurate responses.",
  };

  /**
   * Generate AI completion using standard (non-streaming) API
   * @param request - AI assistant request parameters
   * @param config - Optional configuration overrides
   * @returns Promise resolving to AI response
   */
  async generateCompletion(
    request: AIAssistantRequest,
    config?: Partial<AIAssistantConfig>
  ): Promise<AIAssistantResponse> {
    const finalConfig = { ...this.defaultConfig, ...config };

    const openaiRequest: OpenAICompletionRequest = {
      model: finalConfig.model,
      messages: [
        {
          role: "system",
          content: finalConfig.systemPrompt,
        },
        {
          role: "user",
          content: this.buildUserPrompt(request),
        },
      ],
      max_tokens: request.maxTokens || finalConfig.maxTokens,
      temperature: request.temperature ?? finalConfig.temperature,
      stream: false,
    };

    try {
      const response = await openaiClient.request<OpenAICompletionResponse>(
        "POST",
        "/chat/completions",
        openaiRequest
      );

      return this.processCompletionResponse(response);
    } catch (error) {
      throw this.handleServiceError(error);
    }
  }

  /**
   * Generate AI completion using streaming API
   * @param request - AI assistant request parameters
   * @param onChunk - Callback for each streaming chunk
   * @param onError - Error callback
   * @param config - Optional configuration overrides
   * @returns Promise resolving when stream is complete
   */
  async generateStreamingCompletion(
    request: AIAssistantRequest,
    onChunk: StreamingCallback,
    onError: StreamingErrorCallback,
    config?: Partial<AIAssistantConfig>
  ): Promise<void> {
    const finalConfig = { ...this.defaultConfig, ...config };

    const openaiRequest: OpenAICompletionRequest = {
      model: finalConfig.model,
      messages: [
        {
          role: "system",
          content: finalConfig.systemPrompt,
        },
        {
          role: "user",
          content: this.buildUserPrompt(request),
        },
      ],
      max_tokens: request.maxTokens || finalConfig.maxTokens,
      temperature: request.temperature ?? finalConfig.temperature,
      stream: true,
    };

    try {
      const stream = await openaiClient.streamRequest(
        "/chat/completions",
        openaiRequest
      );

      await this.processStreamingResponse(stream, onChunk, onError);
    } catch (error) {
      const serviceError = this.handleServiceError(error);
      onError(serviceError);
    }
  }



  /**
   * Build user prompt from request
   */
  private buildUserPrompt(request: AIAssistantRequest): string {
    let prompt = request.prompt;

    if (request.context) {
      prompt += `\n\nContext: ${request.context}`;
    }

    return prompt;
  }



  /**
   * Process non-streaming completion response
   */
  private processCompletionResponse(
    response: OpenAICompletionResponse
  ): AIAssistantResponse {
    const choice = response.choices[0];
    if (!choice) {
      throw new AIServiceError(
        "No completion choices returned from OpenAI",
        "NO_CHOICES"
      );
    }

    return {
      content: choice.message.content.trim(),
      usage: response.usage,
      model: response.model,
      timestamp: Date.now(),
    };
  }

  /**
   * Process streaming response with proper chunk parsing
   */
  private async processStreamingResponse(
    stream: ReadableStream<Uint8Array>,
    onChunk: StreamingCallback,
    _onError: StreamingErrorCallback
  ): Promise<void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let completeContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Send final complete response
          onChunk({
            content: completeContent,
            isComplete: true,
          });
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();

          // Skip empty lines and non-data lines
          if (!trimmedLine || !trimmedLine.startsWith("data: ")) {
            continue;
          }

          const data = trimmedLine.slice(6); // Remove 'data: ' prefix

          // Check for stream end
          if (data === "[DONE]") {
            onChunk({
              content: completeContent,
              isComplete: true,
            });
            return;
          }

          try {
            const chunk: OpenAIStreamChunk = JSON.parse(data);
            const delta = chunk.choices[0]?.delta;

            if (delta?.content) {
              completeContent += delta.content;

              onChunk({
                content: completeContent,
                isComplete: false,
              });
            }
          } catch (parseError) {
            console.warn("Failed to parse streaming chunk:", parseError);
            // Continue processing other chunks
          }
        }
      }
    } catch (error) {
      throw new AIServiceError(
        "Error processing streaming response",
        "STREAMING_PROCESSING_ERROR",
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Handle and normalize service errors
   */
  private handleServiceError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }

    return new AIServiceError(
      "Unknown error occurred during AI service operation",
      "UNKNOWN_ERROR",
      undefined,
      new Error(String(error))
    );
  }

  /**
   * Test OpenAI API connectivity and configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.generateCompletion(
        {
          prompt: 'Say "Hello" if you can read this.',
        },
        {
          maxTokens: 10,
          temperature: 0,
        }
      );

      return true;
    } catch (error) {
      console.error("OpenAI connection test failed:", error);
      return false;
    }
  }
}

/**
 * Singleton instance of OpenAI service
 */
export const openaiService = new OpenAIService();
