/**
 * Chat API Route (Non-Streaming)
 * 
 * POST /api/chat
 * 
 * Handles non-streaming chat requests.
 * For streaming responses, use /api/chat/stream instead.
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
 * Response:
 * {
 *   id: string;
 *   content: string;
 *   role: "assistant";
 *   timestamp: string;
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/services/ai.service';
import { handleApiError, Errors } from '@/lib/utils/errors';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, repositoryContext } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      throw Errors.BadRequest('Message is required and must be a string');
    }

    // Generate AI response (non-streaming)
    const content = await aiService.generateResponse({
      message,
      repositoryContext,
    });

    // Return formatted response
    return NextResponse.json({
      id: `msg_${Date.now()}`,
      content,
      role: 'assistant',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
