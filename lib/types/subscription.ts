export type SubscriptionStatus = 
  | "APPROVAL_PENDING"
  | "APPROVED"
  | "ACTIVE"
  | "SUSPENDED"
  | "CANCELLED"
  | "EXPIRED";

export type BillingCycle = "MONTH" | "YEAR";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  features: PlanFeature[];
  paypalPlanId?: string;
  isPopular?: boolean;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number | "unlimited";
}

export interface UserSubscription {
  id: string;
  planId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  paypalSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageMetrics {
  repositoriesAnalyzed: number;
  repositoriesLimit: number;
  queriesUsed: number;
  queriesLimit: number;
  tokensUsed: number;
  tokensLimit: number;
  periodStart: Date;
  periodEnd: Date;
}

export interface PayPalSubscriptionResponse {
  id: string;
  status: SubscriptionStatus;
  plan_id: string;
  start_time: string;
  subscriber: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
  billing_info: {
    next_billing_time: string;
    last_payment: {
      amount: {
        currency_code: string;
        value: string;
      };
      time: string;
    };
  };
}
