/**
 * Chat Streaming API Route (SSE)
 * 
 * POST /api/chat/stream
 * 
 * Handles streaming chat requests using Server-Sent Events (SSE).
 * Streams AI responses in real-time for better UX.
 * 
 * Request Body:
 * {
 *   message: string;
 *   conversationId?: string;
 *   repositoryContext?: {
 *     owner: string;
 *     repo: string;
 *     branch: string;
 *     structure?: string;
 *     selectedNodes?: Array<{id, type, path, name}>;
 *   };
 * }
 * 
 * Response: Server-Sent Events stream
 * - data: {"content": "..."} - Text chunks
 * - data: {"type": "tool_call", "toolName": "...", "toolArgs": {...}} - Tool calls
 * - data: {"type": "tool_result", "toolName": "...", "result": {...}} - Tool results
 * - data: {"error": "..."} - Errors
 * - data: [DONE] - Stream complete
 */

import { NextRequest } from 'next/server';
import { aiService, StreamChunk } from '@/lib/services/ai.service';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, repositoryContext } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required and must be a string' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create encoder for streaming
    const encoder = new TextEncoder();

    // Create readable stream for SSE
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream AI response
          await aiService.streamChat(
            { message, repositoryContext },
            (chunk: StreamChunk) => {
              // Format SSE data based on chunk type
              let data: string;

              switch (chunk.type) {
                case 'text':
                  data = JSON.stringify({ content: chunk.content });
                  break;
                case 'tool_call':
                  data = JSON.stringify({
                    type: 'tool_call',
                    toolName: chunk.toolName,
                    toolArgs: chunk.toolArgs,
                  });
                  break;
                case 'tool_result':
                  data = JSON.stringify({
                    type: 'tool_result',
                    toolName: chunk.toolName,
                    result: chunk.toolResult,
                  });
                  break;
                case 'error':
                  data = JSON.stringify({ error: chunk.error });
                  break;
                case 'done':
                  data = '[DONE]';
                  break;
                default:
                  return; // Skip unknown chunk types
              }

              // Send SSE formatted data
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          );

          // Close the stream
          controller.close();
        } catch (error) {
          // Send error in SSE format
          const errorMessage = error instanceof Error ? error.message : 'Stream failed';
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        }
      },
    });

    // Return SSE response
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx buffering
      },
    });
  } catch (error) {
    // Handle JSON parse errors or other initial errors
    const errorMessage = error instanceof Error ? error.message : 'Request failed';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
