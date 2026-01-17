/**
 * GitHub Repository Tree API Route
 * 
 * GET /api/github/[owner]/[repo]/tree?branch=<branch>
 * 
 * Gets the complete file tree for a repository.
 * 
 * Path Parameters:
 * - owner: Repository owner
 * - repo: Repository name
 * 
 * Query Parameters:
 * - branch: Branch name (optional, defaults to default branch)
 * 
 * Response:
 * {
 *   tree: GitHubTree
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
    const { owner, repo } = await params;
    const branch = request.nextUrl.searchParams.get('branch') || undefined;

    const tree = await githubBackendService.getRepositoryTree(owner, repo, branch);

    return NextResponse.json({ tree });
  } catch (error) {
    return handleApiError(error);
  }
}
