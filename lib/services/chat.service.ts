import type { ChatMessage, ChatResponse, SendMessagePayload, Conversation } from "@/lib/types";

// Same origin - use relative URLs (migrated from Express backend to Next.js API routes)
const API_BASE = "";

// Callback types for streaming
export interface StreamCallbacks {
  onChunk: (chunk: string) => void;
  onToolCall?: (toolName: string, toolArgs: Record<string, unknown>) => void;
  onToolResult?: (toolName: string, result: unknown) => void;
  onComplete: (response: ChatResponse) => void;
  onError: (error: Error) => void;
}

class ChatService {
  private headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  /**
   * Send a message to the AI chat API
   */
  async sendMessage(payload: SendMessagePayload): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: "POST",
      headers: this.headers,
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || "Failed to send message");
    }

    return response.json();
  }

  /**
   * Send a message and stream the response
   */
  async sendMessageStream(
    payload: SendMessagePayload,
    onChunk: (chunk: string) => void,
    onComplete: (response: ChatResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    return this.sendMessageStreamWithCallbacks(payload, {
      onChunk,
      onComplete,
      onError,
    });
  }

  /**
   * Send a message with full streaming callbacks including tool calls
   */
  async sendMessageStreamWithCallbacks(
    payload: SendMessagePayload,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const { onChunk, onToolCall, onToolResult, onComplete, onError } = callbacks;
    
    try {
      const response = await fetch(`${API_BASE}/api/chat/stream`, {
        method: "POST",
        headers: this.headers,
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.error || "Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let fullContent = "";
      let conversationId = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        
        // Keep the last potentially incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              onComplete({
                id: `msg_${Date.now()}`,
                content: fullContent,
                role: "assistant",
                timestamp: new Date().toISOString(),
                conversationId,
              });
              return;
            }

            try {
              const parsed = JSON.parse(data);
              
              // Handle text content
              if (parsed.content) {
                fullContent += parsed.content;
                onChunk(parsed.content);
              }
              
              // Handle tool calls
              if (parsed.type === "tool_call" && onToolCall) {
                onToolCall(parsed.toolName, parsed.toolArgs);
              }
              
              // Handle tool results
              if (parsed.type === "tool_result" && onToolResult) {
                onToolResult(parsed.toolName, parsed.result);
              }
              
              // Handle errors
              if (parsed.error) {
                throw new Error(parsed.error);
              }
              
              // Track conversation ID
              if (parsed.conversationId) {
                conversationId = parsed.conversationId;
              }
            } catch (parseError) {
              // Only throw if it's an actual error message, not a parse failure
              if (parseError instanceof Error && parseError.message !== "Unexpected end of JSON input") {
                // Log but don't throw for parse errors
                console.warn("Failed to parse SSE data:", data);
              }
            }
          }
        }
      }
      
      // Handle case where stream ends without [DONE]
      if (fullContent) {
        onComplete({
          id: `msg_${Date.now()}`,
          content: fullContent,
          role: "assistant",
          timestamp: new Date().toISOString(),
          conversationId,
        });
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error("Unknown error"));
    }
  }
}

class ConversationService {
  private headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  /**
   * Get all conversations for the current user
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE}/api/conversations`, {
      headers: this.headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const data = await response.json();
    return data.conversations || [];
  }

  /**
   * Get a single conversation with its messages
   */
  async getConversation(id: string): Promise<{ conversation: Conversation; messages: ChatMessage[] }> {
    const response = await fetch(`${API_BASE}/api/conversations/${id}`, {
      headers: this.headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversation");
    }

    return response.json();
  }

  /**
   * Create a new conversation
   */
  async createConversation(data: {
    title: string;
    repositoryId: string;
    repositoryName: string;
  }): Promise<Conversation> {
    const response = await fetch(`${API_BASE}/api/conversations`, {
      method: "POST",
      headers: this.headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }

    return response.json();
  }

  /**
   * Update a conversation
   */
  async updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation> {
    const response = await fetch(`${API_BASE}/api/conversations/${id}`, {
      method: "PATCH",
      headers: this.headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update conversation");
    }

    return response.json();
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/conversations/${id}`, {
      method: "DELETE",
      headers: this.headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete conversation");
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const response = await fetch(
      `${API_BASE}/api/conversations/${conversationId}/messages`,
      {
        headers: this.headers,
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    return data.messages || [];
  }
}

export const chatService = new ChatService();
export const conversationService = new ConversationService();
