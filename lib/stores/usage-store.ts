import { create } from "zustand";
import type { UsageMetrics } from "@/lib/types";

interface UsageState {
  // Usage data
  metrics: UsageMetrics | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMetrics: (metrics: UsageMetrics) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  incrementQueriesUsed: () => void;
  incrementRepositoriesAnalyzed: () => void;
  addTokensUsed: (tokens: number) => void;
  reset: () => void;
}

const initialState = {
  metrics: null,
  isLoading: false,
  error: null,
};

export const useUsageStore = create<UsageState>((set, get) => ({
  ...initialState,

  setMetrics: (metrics) => set({ metrics, error: null }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  incrementQueriesUsed: () => {
    const { metrics } = get();
    if (metrics) {
      set({
        metrics: {
          ...metrics,
          queriesUsed: metrics.queriesUsed + 1,
        },
      });
    }
  },

  incrementRepositoriesAnalyzed: () => {
    const { metrics } = get();
    if (metrics) {
      set({
        metrics: {
          ...metrics,
          repositoriesAnalyzed: metrics.repositoriesAnalyzed + 1,
        },
      });
    }
  },

  addTokensUsed: (tokens) => {
    const { metrics } = get();
    if (metrics) {
      set({
        metrics: {
          ...metrics,
          tokensUsed: metrics.tokensUsed + tokens,
        },
      });
    }
  },

  reset: () => set(initialState),
}));

// Helper to calculate usage percentage
export function getUsagePercentage(used: number, limit: number): number {
  if (limit === 0) return 0;
  return Math.min(Math.round((used / limit) * 100), 100);
}

// Helper to check if user is near limit
export function isNearLimit(used: number, limit: number, threshold = 80): boolean {
  return getUsagePercentage(used, limit) >= threshold;
}

// Helper to check if user has exceeded limit
export function hasExceededLimit(used: number, limit: number): boolean {
  return used >= limit;
}
