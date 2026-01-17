/**
 * GitHub Directory Contents API Route
 * 
 * GET /api/github/[owner]/[repo]/contents?path=<dirpath>&branch=<branch>
 * 
 * Gets the contents of a directory in a repository.
 * 
 * Path Parameters:
 * - owner: Repository owner
 * - repo: Repository name
 * 
 * Query Parameters:
 * - path: Directory path (optional, defaults to root)
 * - branch: Branch name (optional)
 * 
 * Response:
 * {
 *   contents: Array<{name, path, type, size?}>
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
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path') || '';
    const branch = searchParams.get('branch') || undefined;

    const contents = await githubBackendService.getDirectoryContents(
      owner,
      repo,
      path,
      branch
    );

    return NextResponse.json({ contents });
  } catch (error) {
    return handleApiError(error);
  }
}
