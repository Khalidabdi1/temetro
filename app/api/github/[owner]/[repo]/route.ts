/**
 * GitHub Repository Details API Route
 * 
 * GET /api/github/[owner]/[repo]
 * 
 * Gets details for a specific GitHub repository.
 * 
 * Path Parameters:
 * - owner: Repository owner (e.g., "facebook")
 * - repo: Repository name (e.g., "react")
 * 
 * Response:
 * {
 *   repository: GitHubRepository
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { githubBackendService } from '@/lib/services/github-backend.service';
import { handleApiError } from '@/lib/utils/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    // In Next.js 15+, params is a Promise
    const { owner, repo } = await params;

    // Get repository details
    const repository = await githubBackendService.getRepository(owner, repo);

    return NextResponse.json({ repository });
  } catch (error) {
    return handleApiError(error);
  }
}
