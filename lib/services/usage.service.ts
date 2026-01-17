import type { UsageMetrics } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

class UsageService {
  private headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  /**
   * Get current usage metrics for the user
   */
  async getUsage(): Promise<UsageMetrics> {
    const response = await fetch(`${API_BASE}/api/usage`, {
      headers: this.headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch usage metrics");
    }

    const data = await response.json();
    return {
      repositoriesAnalyzed: data.repositories_analyzed || 0,
      repositoriesLimit: data.repositories_limit || 5,
      queriesUsed: data.queries_used || 0,
      queriesLimit: data.queries_limit || 50,
      tokensUsed: data.tokens_used || 0,
      tokensLimit: data.tokens_limit || 100000,
      periodStart: new Date(data.period_start || Date.now()),
      periodEnd: new Date(data.period_end || Date.now()),
    };
  }

  /**
   * Record a new repository analysis
   */
  async recordRepositoryAnalysis(repositoryId: string): Promise<void> {
    await fetch(`${API_BASE}/api/usage/repository`, {
      method: "POST",
      headers: this.headers,
      credentials: "include",
      body: JSON.stringify({ repositoryId }),
    });
  }

  /**
   * Record a chat query
   */
  async recordQuery(data: { 
    conversationId: string; 
    tokensUsed?: number 
  }): Promise<void> {
    await fetch(`${API_BASE}/api/usage/query`, {
      method: "POST",
      headers: this.headers,
      credentials: "include",
      body: JSON.stringify(data),
    });
  }
}

export const usageService = new UsageService();

// Mock usage data for development/demo
export const mockUsageMetrics: UsageMetrics = {
  repositoriesAnalyzed: 3,
  repositoriesLimit: 5,
  queriesUsed: 27,
  queriesLimit: 50,
  tokensUsed: 45000,
  tokensLimit: 100000,
  periodStart: new Date(new Date().setDate(1)), // First of current month
  periodEnd: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), // Last of current month
};
