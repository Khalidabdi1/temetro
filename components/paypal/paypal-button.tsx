"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { paypalService, PAYPAL_PLAN_IDS } from "@/lib/services/paypal.service";
import { useSubscriptionStore } from "@/lib/stores/subscription-store";
import { Loader2 } from "lucide-react";

interface PayPalButtonProps {
  planId: string;
  billingCycle: "monthly" | "yearly";
  className?: string;
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: Error) => void;
  children?: React.ReactNode;
}

export function PayPalSubscribeButton({
  planId,
  billingCycle,
  className,
  onSuccess,
  onError,
  children,
}: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setSubscription } = useSubscriptionStore();

  const handleSubscribe = useCallback(async () => {
    setIsLoading(true);

    try {
      const paypalPlanId = paypalService.getPayPalPlanId(planId, billingCycle);
      
      if (!paypalPlanId || paypalPlanId.startsWith("P-XXXXX")) {
        // Demo mode - simulate subscription
        console.log("Demo mode: Simulating PayPal subscription");
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // In production, this would be handled by PayPal's SDK
        // For now, we'll show an alert
        alert(
          `PayPal integration requires setup!\n\n` +
          `To enable real PayPal subscriptions:\n` +
          `1. Create a PayPal Developer account\n` +
          `2. Create subscription plans in PayPal\n` +
          `3. Add the plan IDs to your .env file\n` +
          `4. Install @paypal/react-paypal-js\n\n` +
          `Selected Plan: ${planId}\n` +
          `Billing: ${billingCycle}`
        );

        onSuccess?.("demo_subscription_id");
        return;
      }

      // In production, you would use PayPal's SDK here
      // The actual PayPal button would be rendered using @paypal/react-paypal-js
      
      // For now, redirect to a checkout page or open PayPal popup
      // This is a placeholder for the actual PayPal integration
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Subscription failed");
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [planId, billingCycle, onSuccess, onError, setSubscription]);

  return (
    <Button
      onClick={handleSubscribe}
      disabled={isLoading}
      className={cn("w-full", className)}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children || "Subscribe with PayPal"
      )}
    </Button>
  );
}

/**
 * PayPal Provider wrapper component
 * In production, wrap your app with PayPalScriptProvider from @paypal/react-paypal-js
 * 
 * Example:
 * ```tsx
 * import { PayPalScriptProvider } from "@paypal/react-paypal-js";
 * 
 * function App() {
 *   return (
 *     <PayPalScriptProvider options={{ 
 *       clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
 *       vault: true,
 *       intent: "subscription"
 *     }}>
 *       <YourApp />
 *     </PayPalScriptProvider>
 *   );
 * }
 * ```
 */
export function PayPalProvider({ children }: { children: React.ReactNode }) {
  // In production, use PayPalScriptProvider from @paypal/react-paypal-js
  // For now, just render children
  return <>{children}</>;
}
