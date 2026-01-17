/**
 * GitHub Search API Route
 * 
 * GET /api/github/search?q=<query>&limit=<number>
 * 
 * Searches GitHub repositories by query string.
 * Uses server-side GITHUB_TOKEN for higher rate limits.
 * 
 * Query Parameters:
 * - q: Search query (required)
 * - limit: Max results to return (optional, default: 10)
 * 
 * Response:
 * {
 *   repositories: Array<GitHubRepository>
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { githubBackendService } from '@/lib/services/github-backend.service';
import { handleApiError, Errors } from '@/lib/utils/errors';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const limit = searchParams.get('limit');

    // Validate required query parameter
    if (!q) {
      throw Errors.BadRequest('Query parameter "q" is required');
    }

    // Search repositories
    const repositories = await githubBackendService.searchRepositories(
      q,
      limit ? parseInt(limit, 10) : 10
    );

    return NextResponse.json({ repositories });
  } catch (error) {
    return handleApiError(error);
  }
}
