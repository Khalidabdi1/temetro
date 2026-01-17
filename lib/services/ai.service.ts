/**
 * AI Service for Next.js API Routes
 * 
 * Handles AI chat completions with OpenAI, including:
 * - Streaming responses
 * - Tool/function calling for repository analysis
 * - Context-aware prompts
 * 
 * Migration Note: Moved from backend/src/services/ai.service.ts
 * Changes: Updated imports for Next.js, removed .js extensions
 */

import OpenAI from 'openai';
import { buildSystemPrompt } from '@/lib/config/ai';
import { GitHubBackendService } from './github-backend.service';

// Initialize services
const githubService = new GitHubBackendService();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Model configuration
const AI_MODEL = 'gpt-4o';

// Type definitions
export interface RepositoryContext {
  owner: string;
  repo: string;
  branch: string;
  structure?: string;
  selectedNodes?: SelectedNode[];
}

export interface SelectedNode {
  id: string;
  type: 'file' | 'folder';
  path: string;
  name: string;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  repositoryContext?: RepositoryContext;
}

export interface StreamChunk {
  type: 'text' | 'tool_call' | 'tool_result' | 'error' | 'done';
  content?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  toolResult?: unknown;
  error?: string;
}

/**
 * Create tools for function calling based on repository context
 */
function createTools(context: RepositoryContext): OpenAI.Chat.Completions.ChatCompletionTool[] {
  return [
    {
      type: 'function',
      function: {
        name: 'fetchFileContent',
        description: 'Fetch the content of a specific file from the repository. Use this to read code files and understand their implementation.',
        parameters: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'The file path relative to repository root (e.g., "src/index.ts")',
            },
          },
          required: ['path'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'searchRepository',
        description: 'Search for files or code patterns in the repository. Use this to find relevant files.',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for files or code patterns',
            },
          },
          required: ['query'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'listDirectory',
        description: 'List files and folders in a specific directory. Use this to explore the repository structure.',
        parameters: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Directory path relative to root, empty string for root directory',
            },
          },
          required: [],
        },
      },
    },
  ];
}

/**
 * Execute a tool call and return the result
 */
async function executeTool(
  name: string,
  args: Record<string, string>,
  context: RepositoryContext
): Promise<string> {
  try {
    switch (name) {
      case 'fetchFileContent': {
        const content = await githubService.getFileContent(
          context.owner,
          context.repo,
          args.path,
          context.branch
        );
        return JSON.stringify({ 
          success: true, 
          path: args.path, 
          content: content.substring(0, 50000) // Limit content size
        });
      }
      
      case 'searchRepository': {
        const results = await githubService.searchCode(
          context.owner,
          context.repo,
          args.query
        );
        return JSON.stringify({ 
          success: true, 
          query: args.query, 
          results: results.slice(0, 20) // Limit results
        });
      }
      
      case 'listDirectory': {
        const contents = await githubService.getDirectoryContents(
          context.owner,
          context.repo,
          args.path || '',
          context.branch
        );
        return JSON.stringify({ 
          success: true, 
          path: args.path || '', 
          contents: contents.slice(0, 100) // Limit items
        });
      }
      
      default:
        return JSON.stringify({ success: false, error: 'Unknown tool' });
    }
  } catch (error) {
    return JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Tool execution failed',
    });
  }
}

/**
 * AI Service class for chat completions
 */
export class AIService {
  /**
   * Stream a chat response with tool support
   * 
   * @param request - Chat request with message and context
   * @param onChunk - Callback for each streamed chunk
   * @returns Full response content
   */
  async streamChat(
    request: ChatRequest,
    onChunk: (chunk: StreamChunk) => void
  ): Promise<string> {
    const { message, repositoryContext } = request;

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(
      repositoryContext
        ? {
            owner: repositoryContext.owner,
            repo: repositoryContext.repo,
            structure: repositoryContext.structure,
            selectedNodes: repositoryContext.selectedNodes,
          }
        : undefined
    );

    // Build initial messages
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ];

    // Only add tools if we have valid repository context
    const tools =
      repositoryContext?.owner && repositoryContext?.repo
        ? createTools(repositoryContext)
        : undefined;

    try {
      // Start streaming
      const stream = await openai.chat.completions.create({
        model: AI_MODEL,
        messages,
        tools,
        stream: true,
        max_tokens: 4096,
        temperature: 0.7,
      });

      let fullContent = '';
      let currentToolCall: {
        id: string;
        name: string;
        arguments: string;
      } | null = null;

      // Process stream chunks
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;

        // Handle text content
        if (delta?.content) {
          fullContent += delta.content;
          onChunk({
            type: 'text',
            content: delta.content,
          });
        }

        // Handle tool calls
        if (delta?.tool_calls) {
          for (const toolCall of delta.tool_calls) {
            if (toolCall.function?.name) {
              currentToolCall = {
                id: toolCall.id || '',
                name: toolCall.function.name,
                arguments: toolCall.function.arguments || '',
              };
            } else if (toolCall.function?.arguments && currentToolCall) {
              currentToolCall.arguments += toolCall.function.arguments;
            }
          }
        }

        // Handle tool call completion
        if (chunk.choices[0]?.finish_reason === 'tool_calls' && currentToolCall && repositoryContext) {
          // Notify about tool call
          onChunk({
            type: 'tool_call',
            toolName: currentToolCall.name,
            toolArgs: JSON.parse(currentToolCall.arguments || '{}'),
          });

          // Execute the tool
          const toolResult = await executeTool(
            currentToolCall.name,
            JSON.parse(currentToolCall.arguments || '{}'),
            repositoryContext
          );

          // Notify about tool result
          onChunk({
            type: 'tool_result',
            toolName: currentToolCall.name,
            toolResult: JSON.parse(toolResult),
          });

          // Continue conversation with tool result
          const continuedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
            ...messages,
            {
              role: 'assistant',
              content: null,
              tool_calls: [
                {
                  id: currentToolCall.id,
                  type: 'function',
                  function: {
                    name: currentToolCall.name,
                    arguments: currentToolCall.arguments,
                  },
                },
              ],
            },
            {
              role: 'tool',
              tool_call_id: currentToolCall.id,
              content: toolResult,
            },
          ];

          // Get final response after tool execution
          const finalStream = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: continuedMessages,
            stream: true,
            max_tokens: 4096,
            temperature: 0.7,
          });

          for await (const finalChunk of finalStream) {
            const finalDelta = finalChunk.choices[0]?.delta;
            if (finalDelta?.content) {
              fullContent += finalDelta.content;
              onChunk({
                type: 'text',
                content: finalDelta.content,
              });
            }
          }

          currentToolCall = null;
        }
      }

      onChunk({ type: 'done' });
      return fullContent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      onChunk({
        type: 'error',
        error: errorMessage,
      });
      throw error;
    }
  }

  /**
   * Generate a non-streaming response
   */
  async generateResponse(request: ChatRequest): Promise<string> {
    const { message, repositoryContext } = request;

    const systemPrompt = buildSystemPrompt(
      repositoryContext
        ? {
            owner: repositoryContext.owner,
            repo: repositoryContext.repo,
            structure: repositoryContext.structure,
            selectedNodes: repositoryContext.selectedNodes,
          }
        : undefined
    );

    const result = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    });

    return result.choices[0]?.message?.content || '';
  }
}

// Export singleton instance
export const aiService = new AIService();
