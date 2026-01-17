import { create } from "zustand";
import type { Repository, TreeNode, ParsedRepoInput } from "@/lib/types";

export type ViewTab = "chat" | "canvas";

interface RepositoryState {
  // Repository data
  repository: Repository | null;
  tree: TreeNode[] | null;
  selectedFile: TreeNode | null;
  
  // UI state
  activeTab: ViewTab;
  isLoading: boolean;
  isTreeLoading: boolean;
  error: string | null;
  
  // Search/input
  searchQuery: string;
  recentRepositories: Repository[];
  
  // Actions
  setRepository: (repo: Repository | null) => void;
  setTree: (tree: TreeNode[] | null) => void;
  setSelectedFile: (file: TreeNode | null) => void;
  setActiveTab: (tab: ViewTab) => void;
  setIsLoading: (loading: boolean) => void;
  setIsTreeLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  addRecentRepository: (repo: Repository) => void;
  toggleTreeNode: (path: string) => void;
  clearRepository: () => void;
  reset: () => void;
}

const initialState = {
  repository: null,
  tree: null,
  selectedFile: null,
  activeTab: "chat" as ViewTab,
  isLoading: false,
  isTreeLoading: false,
  error: null,
  searchQuery: "",
  recentRepositories: [],
};

export const useRepositoryStore = create<RepositoryState>((set, get) => ({
  ...initialState,

  setRepository: (repo) => {
    set({ repository: repo, error: null });
    if (repo) {
      get().addRecentRepository(repo);
    }
  },

  setTree: (tree) => set({ tree }),

  setSelectedFile: (file) => set({ selectedFile: file }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setIsTreeLoading: (loading) => set({ isTreeLoading: loading }),

  setError: (error) => set({ error, isLoading: false, isTreeLoading: false }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  addRecentRepository: (repo) => {
    const { recentRepositories } = get();
    const filtered = recentRepositories.filter((r) => r.id !== repo.id);
    const updated = [repo, ...filtered].slice(0, 10); // Keep last 10
    set({ recentRepositories: updated });
  },

  toggleTreeNode: (path) => {
    const { tree } = get();
    if (!tree) return;

    const toggleNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.path === path) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };

    set({ tree: toggleNode(tree) });
  },

  clearRepository: () => {
    set({
      repository: null,
      tree: null,
      selectedFile: null,
      error: null,
    });
  },

  reset: () => set(initialState),
}));

// Helper function to parse repository input
export function parseRepoInput(input: string): ParsedRepoInput {
  const trimmed = input.trim();
  
  // Handle full GitHub URL
  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\s]+)/i
  );
  if (urlMatch) {
    return {
      owner: urlMatch[1],
      repo: urlMatch[2].replace(/\.git$/, ""),
      isValid: true,
    };
  }

  // Handle owner/repo format
  const shortMatch = trimmed.match(/^([^\/\s]+)\/([^\/\s]+)$/);
  if (shortMatch) {
    return {
      owner: shortMatch[1],
      repo: shortMatch[2],
      isValid: true,
    };
  }

  return {
    owner: "",
    repo: "",
    isValid: false,
  };
}
