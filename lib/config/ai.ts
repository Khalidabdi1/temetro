/**
 * AI Configuration for Next.js API Routes
 * 
 * This module provides OpenAI configuration and system prompt builder.
 * 
 * Migration Note: Moved from backend/src/config/ai.ts
 * Changes: Removed dotenv (Next.js handles .env automatically)
 */

import { createOpenAI } from '@ai-sdk/openai';

// Initialize OpenAI client
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Model configurations
export const AI_MODELS = {
  chat: 'gpt-4o',      // Best for complex analysis
  fast: 'gpt-4o-mini', // Fast responses for simple queries
} as const;

/**
 * Selected node in the canvas (file or folder)
 */
interface SelectedNode {
  path: string;
  name: string;
  type?: 'file' | 'folder';
}

/**
 * Context for building the AI system prompt
 */
interface PromptContext {
  owner?: string;
  repo?: string;
  structure?: string;
  selectedNodes?: SelectedNode[];
}

/**
 * Build a system prompt for the AI assistant
 * Includes repository context if provided
 * 
 * @param context - Optional repository context
 * @returns Complete system prompt string
 */
export function buildSystemPrompt(context?: PromptContext): string {
  // Base prompt defining the AI's role and capabilities
  let prompt = `You are an expert code assistant specialized in analyzing GitHub repositories. You help developers understand codebases, explain code structure, identify patterns, and answer questions about any repository.

Your capabilities:
- Analyze repository structure and architecture
- Explain code files and their purposes
- Identify design patterns and best practices
- Suggest improvements and optimizations
- Answer specific questions about code functionality
- Trace data flow and understand how components interact

Guidelines:
- Be concise but thorough
- Reference specific files and paths when relevant
- Use markdown formatting for code blocks and lists
- Provide actionable insights when possible
- If you're unsure about something, say so
- When explaining code, use code snippets with proper syntax highlighting`;

  // Add repository context if available
  if (context?.owner && context?.repo) {
    prompt += `\n\n## Current Repository
You are currently analyzing the repository: **${context.owner}/${context.repo}**`;
  }

  // Add repository structure if available
  if (context?.structure) {
    prompt += `\n\n## Repository Structure
\`\`\`
${context.structure}
\`\`\``;
  }

  // Add selected context nodes if available
  if (context?.selectedNodes && context.selectedNodes.length > 0) {
    prompt += `\n\n## Selected Context
The user has selected the following files/folders for context:
${context.selectedNodes.map(n => `- \`${n.path}\` (${n.type || 'unknown'})`).join('\n')}

Focus your responses on these selected items when relevant.`;
  }

  return prompt;
}

export default openai;
