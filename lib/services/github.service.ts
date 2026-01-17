import type { Repository, TreeNode, RepositoryContent } from "@/lib/types";

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: {
    path: string;
    mode: string;
    type: "blob" | "tree";
    sha: string;
    size?: number;
    url: string;
  }[];
  truncated: boolean;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: Repository[];
}

class GitHubService {
  private headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };

  /**
   * Fetch repository details by owner and repo name
   */
  async getRepository(owner: string, repo: string): Promise<Repository> {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      { headers: this.headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository "${owner}/${repo}" not found`);
      }
      if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please try again later.");
      }
      throw new Error(`Failed to fetch repository: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search repositories by query
   */
  async searchRepositories(query: string, limit = 10): Promise<Repository[]> {
    if (!query.trim()) return [];

    const response = await fetch(
      `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(query)}&per_page=${limit}&sort=stars`,
      { headers: this.headers }
    );

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please try again later.");
      }
      throw new Error(`Failed to search repositories: ${response.statusText}`);
    }

    const data: GitHubSearchResponse = await response.json();
    return data.items;
  }

  /**
   * Fetch the full file tree of a repository
   */
  async getRepositoryTree(
    owner: string,
    repo: string,
    branch?: string
  ): Promise<TreeNode[]> {
    // First, get the default branch if not provided
    let targetBranch = branch;
    if (!targetBranch) {
      const repoData = await this.getRepository(owner, repo);
      targetBranch = repoData.default_branch;
    }

    // Fetch the tree recursively
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${targetBranch}?recursive=1`,
      { headers: this.headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Branch "${targetBranch}" not found`);
      }
      if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please try again later.");
      }
      throw new Error(`Failed to fetch repository tree: ${response.statusText}`);
    }

    const data: GitHubTreeResponse = await response.json();
    return this.buildTreeStructure(data.tree);
  }

  /**
   * Convert flat tree response to hierarchical structure
   */
  private buildTreeStructure(
    flatTree: GitHubTreeResponse["tree"]
  ): TreeNode[] {
    const root: TreeNode[] = [];
    const nodeMap = new Map<string, TreeNode>();

    // Sort by path to ensure parents are processed before children
    const sortedTree = [...flatTree].sort((a, b) => 
      a.path.localeCompare(b.path)
    );

    for (const item of sortedTree) {
      const pathParts = item.path.split("/");
      const name = pathParts[pathParts.length - 1];
      const parentPath = pathParts.slice(0, -1).join("/");

      const node: TreeNode = {
        path: item.path,
        name,
        type: item.type === "tree" ? "dir" : "file",
        sha: item.sha,
        size: item.size,
        url: item.url,
        children: item.type === "tree" ? [] : undefined,
        isExpanded: false,
      };

      nodeMap.set(item.path, node);

      if (parentPath === "") {
        // Root level item
        root.push(node);
      } else {
        // Find parent and add as child
        const parent = nodeMap.get(parentPath);
        if (parent && parent.children) {
          parent.children.push(node);
        }
      }
    }

    // Sort: directories first, then alphabetically
    const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes
        .sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === "dir" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        })
        .map((node) => ({
          ...node,
          children: node.children ? sortNodes(node.children) : undefined,
        }));
    };

    return sortNodes(root);
  }

  /**
   * Fetch contents of a directory
   */
  async getDirectoryContents(
    owner: string,
    repo: string,
    path = ""
  ): Promise<RepositoryContent[]> {
    const encodedPath = path ? `/${encodeURIComponent(path)}` : "";
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents${encodedPath}`,
      { headers: this.headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Path "${path}" not found`);
      }
      if (response.status === 403) {
        throw new Error("GitHub API rate limit exceeded. Please try again later.");
      }
      throw new Error(`Failed to fetch directory contents: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [data];
  }

  /**
   * Get README content for a repository
   */
  async getReadme(owner: string, repo: string): Promise<string | null> {
    try {
      const response = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`,
        { 
          headers: {
            ...this.headers,
            Accept: "application/vnd.github.raw+json",
          }
        }
      );

      if (!response.ok) {
        return null;
      }

      return response.text();
    } catch {
      return null;
    }
  }

  /**
   * Get repository languages
   */
  async getLanguages(
    owner: string,
    repo: string
  ): Promise<Record<string, number>> {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`,
      { headers: this.headers }
    );

    if (!response.ok) {
      return {};
    }

    return response.json();
  }

  /**
   * Generate a simple text representation of the tree for AI context
   */
  generateTreeContext(tree: TreeNode[], maxDepth = 3): string {
    const lines: string[] = [];

    const traverse = (nodes: TreeNode[], depth: number, prefix = "") => {
      if (depth > maxDepth) return;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const isLast = i === nodes.length - 1;
        const connector = isLast ? "└── " : "├── ";
        const childPrefix = prefix + (isLast ? "    " : "│   ");

        lines.push(`${prefix}${connector}${node.name}${node.type === "dir" ? "/" : ""}`);

        if (node.children && node.children.length > 0) {
          traverse(node.children, depth + 1, childPrefix);
        }
      }
    };

    traverse(tree, 0);
    return lines.join("\n");
  }
}

export const githubService = new GitHubService();
