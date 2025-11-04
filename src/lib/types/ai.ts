/**
 * OpenAI API Types and Interfaces
 *
 * Type definitions for OpenAI API requests and responses
 */

// OpenAI API Request Types
export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAICompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
  stop?: string[];
}

// OpenAI API Response Types
export interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Streaming Response Types
export interface OpenAIStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: "assistant";
      content?: string;
    };
    finish_reason?: string;
  }>;
}

// Error Types
export interface OpenAIError {
  message: string;
  type: string;
  param?: string;
  code?: string;
}

export interface OpenAIErrorResponse {
  error: OpenAIError;
}

// Custom Application Types
export interface AIAssistantRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIAssistantResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  timestamp: number;
}

export interface AIStreamingResponse {
  content: string;
  isComplete: boolean;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

// Streaming callback types
export type StreamingCallback = (chunk: AIStreamingResponse) => void;
export type StreamingErrorCallback = (error: Error) => void;

// AI Assistant Configuration
export interface AIAssistantConfig {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

// AI Service Error Types
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public cause?: Error
  ) {
    super(message);
    this.name = "AIServiceError";
  }
}

export class AIConfigurationError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = "AIConfigurationError";
  }
}

export class AINetworkError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: Error
  ) {
    super(message);
    this.name = "AINetworkError";
  }
}

export class AIRateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = "AIRateLimitError";
  }
}
