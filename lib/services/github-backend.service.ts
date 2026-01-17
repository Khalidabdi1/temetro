/**
 * GitHub Backend Service for Next.js API Routes
 * 
 * This service runs server-side only and can use GITHUB_TOKEN for higher rate limits.
 * Used by AI service for tool calls (fetchFileContent, searchRepository, etc.)
 * 
 * Migration Note: Moved from backend/src/services/github.service.ts
 * Changes: Removed .js extensions, updated for Next.js environment
 */

const GITHUB_API_BASE = 'https://api.github.com';

// Type definitions
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  default_branch: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  visibility: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubTree {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

interface GitHubContentItem {
  name: string;
  path: string;
  type: string;
  size?: number;
}

interface GitHubSearchResult {
  items: Array<{ path: string; name: string; html_url: string }>;
}

interface GitHubSearchRepoResult {
  items: GitHubRepository[];
}

interface GitHubFileContent {
  encoding: string;
  content: string;
}

/**
 * GitHub Service class for server-side operations
 * Uses GITHUB_TOKEN when available for higher rate limits
 */
export class GitHubBackendService {
  private headers: Record<string, string>;

  constructor() {
    // Build headers with optional authentication
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Temetro-App',
    };

    // Add token if available (increases rate limit from 60 to 5000 req/hr)
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  /**
   * Search GitHub repositories by query
   */
  async searchRepositories(query: string, limit = 10): Promise<GitHubRepository[]> {
    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&per_page=${limit}`;

    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json() as GitHubSearchRepoResult;
    return data.items || [];
  }

  /**
   * Get repository details by owner and repo name
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;

    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository "${owner}/${repo}" not found`);
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json() as Promise<GitHubRepository>;
  }

  /**
   * Get repository file tree (structure)
   */
  async getRepositoryTree(
    owner: string,
    repo: string,
    branch?: string
  ): Promise<GitHubTree> {
    // Get default branch if not specified
    let targetBranch = branch;
    if (!targetBranch) {
      const repoInfo = await this.getRepository(owner, repo);
      targetBranch = repoInfo.default_branch;
    }

    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${targetBranch}?recursive=1`;

    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Branch "${targetBranch}" not found`);
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json() as Promise<GitHubTree>;
  }

  /**
   * Get file content from repository
   */
  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    branch?: string
  ): Promise<string> {
    const ref = branch ? `?ref=${branch}` : '';
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}${ref}`;

    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`File "${path}" not found`);
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json() as GitHubFileContent;

    // Decode base64 content
    if (data.encoding === 'base64' && data.content) {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    throw new Error('Unable to decode file content');
  }

  /**
   * Get directory contents
   */
  async getDirectoryContents(
    owner: string,
    repo: string,
    path: string = '',
    branch?: string
  ): Promise<Array<{ name: string; path: string; type: string; size?: number }>> {
    const ref = branch ? `?ref=${branch}` : '';
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}${ref}`;

    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Path "${path}" not found`);
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json() as GitHubContentItem[];

    if (Array.isArray(data)) {
      return data.map(item => ({
        name: item.name,
        path: item.path,
        type: item.type,
        size: item.size,
      }));
    }

    return [];
  }

  /**
   * Search code in repository
   */
  async searchCode(
    owner: string,
    repo: string,
    query: string
  ): Promise<Array<{ path: string; name: string; url: string }>> {
    const url = `${GITHUB_API_BASE}/search/code?q=${encodeURIComponent(query)}+repo:${owner}/${repo}`;

    const response = await fetch(url, { headers: this.headers });

    if (!response.ok) {
      // Code search requires authentication
      if (response.status === 401 || response.status === 403) {
        throw new Error('Code search requires authentication. Please set GITHUB_TOKEN.');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json() as GitHubSearchResult;

    return (data.items || []).map((item) => ({
      path: item.path,
      name: item.name,
      url: item.html_url,
    }));
  }

  /**
   * Generate a text representation of the tree for AI context
   */
  generateTreeContext(tree: GitHubTree, maxDepth = 3): string {
    const lines: string[] = [];
    const items = tree.tree.filter(item => {
      const depth = item.path.split('/').length;
      return depth <= maxDepth;
    });

    // Sort by path
    items.sort((a, b) => a.path.localeCompare(b.path));

    for (const item of items) {
      const depth = item.path.split('/').length - 1;
      const indent = '  '.repeat(depth);
      const name = item.path.split('/').pop() || item.path;
      const icon = item.type === 'tree' ? '📁' : '📄';
      lines.push(`${indent}${icon} ${name}`);
    }

    return lines.join('\n');
  }
}

// Export singleton instance
export const githubBackendService = new GitHubBackendService();
