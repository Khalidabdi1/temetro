import type { 
  UserSubscription, 
  SubscriptionPlan, 
  PayPalSubscriptionResponse 
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// PayPal Plans mapping (these would be created in PayPal dashboard)
// You'll need to replace these with actual PayPal plan IDs
export const PAYPAL_PLAN_IDS = {
  pro_monthly: process.env.NEXT_PUBLIC_PAYPAL_PRO_MONTHLY_PLAN_ID || "P-XXXXXXX",
  pro_yearly: process.env.NEXT_PUBLIC_PAYPAL_PRO_YEARLY_PLAN_ID || "P-XXXXXXX",
  team_monthly: process.env.NEXT_PUBLIC_PAYPAL_TEAM_MONTHLY_PLAN_ID || "P-XXXXXXX",
  team_yearly: process.env.NEXT_PUBLIC_PAYPAL_TEAM_YEARLY_PLAN_ID || "P-XXXXXXX",
};

class PayPalService {
  private headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  /**
   * Get PayPal client ID for frontend
   */
  getClientId(): string {
    return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  }

  /**
   * Create a subscription through the backend
   */
  async createSubscription(data: {
    planId: string;
    paypalPlanId: string;
    paypalSubscriptionId: string;
  }): Promise<UserSubscription> {
    const response = await fetch(`${API_BASE}/api/subscriptions`, {
      method: "POST",
      headers: this.headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create subscription");
    }

    return response.json();
  }

  /**
   * Get current subscription
   */
  async getSubscription(): Promise<UserSubscription | null> {
    const response = await fetch(`${API_BASE}/api/subscriptions/current`, {
      headers: this.headers,
      credentials: "include",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch subscription");
    }

    return response.json();
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(reason?: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/subscriptions/cancel`, {
      method: "POST",
      headers: this.headers,
      credentials: "include",
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error("Failed to cancel subscription");
    }
  }

  /**
   * Reactivate a cancelled subscription (if still in billing period)
   */
  async reactivateSubscription(): Promise<UserSubscription> {
    const response = await fetch(`${API_BASE}/api/subscriptions/reactivate`, {
      method: "POST",
      headers: this.headers,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to reactivate subscription");
    }

    return response.json();
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(data: {
    newPlanId: string;
    paypalPlanId: string;
  }): Promise<UserSubscription> {
    const response = await fetch(`${API_BASE}/api/subscriptions/update`, {
      method: "POST",
      headers: this.headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update subscription");
    }

    return response.json();
  }

  /**
   * Get available subscription plans
   */
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await fetch(`${API_BASE}/api/subscriptions/plans`, {
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch plans");
    }

    return response.json();
  }

  /**
   * Get PayPal plan ID for a given internal plan and billing cycle
   */
  getPayPalPlanId(planId: string, billingCycle: "monthly" | "yearly"): string {
    const key = `${planId}_${billingCycle}` as keyof typeof PAYPAL_PLAN_IDS;
    return PAYPAL_PLAN_IDS[key] || "";
  }
}

export const paypalService = new PayPalService();
