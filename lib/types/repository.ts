export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  default_branch: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  visibility: string;
}

export interface TreeNode {
  path: string;
  name: string;
  type: "file" | "dir";
  sha: string;
  size?: number;
  url: string;
  children?: TreeNode[];
  isExpanded?: boolean;
}

export interface RepositoryTree {
  sha: string;
  url: string;
  tree: TreeNode[];
  truncated: boolean;
}

export interface RepositoryContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

export interface RepositoryContext {
  repository: Repository | null;
  tree: TreeNode[] | null;
  selectedFile: TreeNode | null;
  isLoading: boolean;
  error: string | null;
}

export interface ParsedRepoInput {
  owner: string;
  repo: string;
  isValid: boolean;
}
