import { create } from "zustand";
import type { UserSubscription, SubscriptionPlan, SubscriptionStatus } from "@/lib/types";

interface SubscriptionState {
  // Subscription data
  subscription: UserSubscription | null;
  availablePlans: SubscriptionPlan[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSubscription: (subscription: UserSubscription | null) => void;
  setAvailablePlans: (plans: SubscriptionPlan[]) => void;
  updateSubscriptionStatus: (status: SubscriptionStatus) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  subscription: null,
  availablePlans: [],
  isLoading: false,
  error: null,
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  ...initialState,

  setSubscription: (subscription) => set({ subscription, error: null }),

  setAvailablePlans: (plans) => set({ availablePlans: plans }),

  updateSubscriptionStatus: (status) => {
    const { subscription } = get();
    if (subscription) {
      set({
        subscription: {
          ...subscription,
          status,
          updatedAt: new Date(),
        },
      });
    }
  },

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  reset: () => set(initialState),
}));

// Default plans configuration
export const defaultPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For developers exploring repositories",
    price: 0,
    currency: "USD",
    billingCycle: "MONTH",
    features: [
      { name: "5 repositories per month", included: true, limit: 5 },
      { name: "50 AI queries per month", included: true, limit: 50 },
      { name: "Public repositories only", included: true },
      { name: "Basic file tree view", included: true },
      { name: "Community support", included: true },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professional developers",
    price: 19,
    currency: "USD",
    billingCycle: "MONTH",
    isPopular: true,
    features: [
      { name: "Unlimited repositories", included: true, limit: "unlimited" },
      { name: "500 AI queries per month", included: true, limit: 500 },
      { name: "Public repositories", included: true },
      { name: "Advanced file tree view", included: true },
      { name: "Conversation history", included: true },
      { name: "Priority support", included: true },
    ],
  },
  {
    id: "team",
    name: "Team",
    description: "For development teams",
    price: 49,
    currency: "USD",
    billingCycle: "MONTH",
    features: [
      { name: "Unlimited repositories", included: true, limit: "unlimited" },
      { name: "2000 AI queries per month", included: true, limit: 2000 },
      { name: "Public repositories", included: true },
      { name: "Advanced file tree view", included: true },
      { name: "Conversation history", included: true },
      { name: "Team collaboration", included: true },
      { name: "Dedicated support", included: true },
      { name: "API access", included: true },
    ],
  },
];

// Helper to check if subscription is active
export function isSubscriptionActive(status: SubscriptionStatus): boolean {
  return status === "ACTIVE" || status === "APPROVED";
}

// Helper to get current plan
export function getCurrentPlan(
  subscription: UserSubscription | null,
  plans: SubscriptionPlan[]
): SubscriptionPlan {
  if (!subscription) {
    return plans.find((p) => p.id === "free") || plans[0];
  }
  return subscription.plan;
}
