/**
 * GitHub File Content API Route
 * 
 * GET /api/github/[owner]/[repo]/file?path=<filepath>&branch=<branch>
 * 
 * Gets the content of a specific file from a repository.
 * 
 * Path Parameters:
 * - owner: Repository owner
 * - repo: Repository name
 * 
 * Query Parameters:
 * - path: File path relative to repo root (required)
 * - branch: Branch name (optional)
 * 
 * Response:
 * {
 *   content: string;
 *   path: string;
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { githubBackendService } from '@/lib/services/github-backend.service';
import { handleApiError, Errors } from '@/lib/utils/errors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    const branch = searchParams.get('branch') || undefined;

    if (!path) {
      throw Errors.BadRequest('Query parameter "path" is required');
    }

    const content = await githubBackendService.getFileContent(owner, repo, path, branch);

    return NextResponse.json({ content, path });
  } catch (error) {
    return handleApiError(error);
  }
}
