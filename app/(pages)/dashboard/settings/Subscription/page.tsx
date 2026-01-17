"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { defaultPlans } from "@/lib/stores/subscription-store";
import { 
  Check, 
  CreditCard, 
  Zap, 
  Calendar,
  ArrowRight,
  Shield,
  X,
} from "lucide-react";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Current plan (mock - would come from subscription store)
  const currentPlanId = "free";

  return (
    <div className="container max-w-5xl py-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the plan that best fits your needs. Upgrade anytime to unlock more features.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            billingCycle === "monthly"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            billingCycle === "yearly"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Yearly
          <Badge variant="secondary" className="ml-2 text-xs">
            Save 20%
          </Badge>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {defaultPlans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlanId;
          const price = billingCycle === "monthly" 
            ? plan.price 
            : Math.floor(plan.price * 12 * 0.8);

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative",
                plan.isPopular && "border-primary shadow-lg",
                selectedPlan === plan.id && "ring-2 ring-primary"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription className="min-h-[40px]">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">
                      ${price}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && plan.price > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${plan.price}/mo billed annually
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                      <span className={cn(
                        "text-sm",
                        !feature.included && "text-muted-foreground"
                      )}>
                        {feature.name}
                        {feature.limit && feature.limit !== "unlimited" && (
                          <span className="text-muted-foreground"> ({feature.limit})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={plan.isPopular ? "default" : "outline"}
                  disabled={isCurrentPlan}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {isCurrentPlan ? (
                    "Current Plan"
                  ) : plan.price === 0 ? (
                    "Get Started"
                  ) : (
                    <>
                      Upgrade to {plan.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Free Plan</p>
                <p className="text-sm text-muted-foreground">
                  5 repositories, 50 queries per month
                </p>
              </div>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="font-medium">N/A (Free Plan)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">None configured</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PayPal Notice */}
      <Card className="bg-muted/30">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="p-3 rounded-lg bg-[#0070BA]/10">
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
              <path
                d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.72a.77.77 0 01.76-.654h6.39c2.149 0 3.705.42 4.622 1.247.872.787 1.217 1.95 1.053 3.545-.025.24-.058.49-.1.75-.54 3.372-2.467 5.088-5.893 5.248H9.78l-.84 5.267a.642.642 0 01-.634.54h-1.23v1.674z"
                fill="#003087"
              />
              <path
                d="M19.438 7.464c-.034.268-.076.543-.127.825-.67 3.444-2.958 4.635-5.884 4.635H12.09a.724.724 0 00-.715.613l-.624 3.956-.177 1.12a.38.38 0 00.375.44h2.636a.638.638 0 00.63-.54l.026-.134.499-3.166.032-.175a.638.638 0 01.63-.54h.396c2.567 0 4.577-1.042 5.166-4.057.246-1.26.119-2.313-.533-3.052a2.542 2.542 0 00-.994-.725z"
                fill="#009CDE"
              />
              <path
                d="M18.455 7.072a5.335 5.335 0 00-.66-.147 8.438 8.438 0 00-1.34-.098h-4.06a.635.635 0 00-.628.54l-.864 5.478-.025.16a.724.724 0 01.715-.613h1.338c2.926 0 5.214-1.19 5.884-4.635.02-.102.038-.201.054-.3a3.32 3.32 0 00-.414-.385z"
                fill="#012169"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium">Secure Payments with PayPal</p>
            <p className="text-sm text-muted-foreground">
              All payments are processed securely through PayPal. You can use your PayPal balance,
              bank account, or credit/debit card.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Frequently Asked Questions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to have access
                until the end of your billing period.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">What happens to my data if I downgrade?</h3>
              <p className="text-sm text-muted-foreground">
                Your data is always preserved. If you exceed the limits of a lower plan,
                you'll need to upgrade to access certain features.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Do you offer refunds?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 14-day money-back guarantee for all paid plans. Contact support
                if you're not satisfied.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">How do team plans work?</h3>
              <p className="text-sm text-muted-foreground">
                Team plans include collaboration features and shared usage limits.
                Each team member gets their own account.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
