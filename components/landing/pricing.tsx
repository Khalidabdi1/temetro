"use client"

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: "Free",
    description: "Perfect for exploring and trying out Temetro",
    price: "$0",
    period: "forever",
    features: [
      "5 repository analyses per month",
      "Public repositories only",
      "Basic AI chat (50 messages/day)",
      "Standard response speed",
      "Community support"
    ],
    cta: "Get Started",
    ctaLink: "/auth/signup",
    highlighted: false
  },
  {
    name: "Pro",
    description: "For developers who need unlimited access",
    price: "$19",
    period: "per month",
    features: [
      "Unlimited repository analyses",
      "Public & private repositories",
      "Unlimited AI chat messages",
      "Priority response speed",
      "Advanced context selection",
      "Code export & sharing",
      "Priority email support"
    ],
    cta: "Start Free Trial",
    ctaLink: "/auth/signup?plan=pro",
    highlighted: true
  },
  {
    name: "Team",
    description: "For teams collaborating on codebases",
    price: "$49",
    period: "per month",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared repository workspace",
      "Team chat history",
      "Admin controls",
      "SSO integration",
      "Dedicated support"
    ],
    cta: "Contact Sales",
    ctaLink: "/contact",
    highlighted: false
  }
]

const Pricing = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="relative py-24 bg-background">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-block text-sm font-medium text-blue-500 mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            PRICING
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-2xl p-6 lg:p-8 transition-shadow duration-300 ${
                plan.highlighted 
                  ? 'bg-gradient-to-b from-blue-500/10 via-card to-card border-2 border-blue-500/30 shadow-lg shadow-blue-500/5' 
                  : 'bg-card border border-border hover:shadow-lg'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground ml-2">/{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-blue-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link href={plan.ctaLink} className="block">
                <Button 
                  className={`w-full py-5 transition-all duration-200 ${
                    plan.highlighted 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-muted hover:bg-muted/80 text-foreground border border-border'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ teaser */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-muted-foreground">
            Have questions? Check out our{' '}
            <a href="#faq" className="text-blue-500 hover:text-blue-400 underline underline-offset-4">
              FAQ
            </a>
            {' '}or{' '}
            <a href="mailto:support@temetro.dev" className="text-blue-500 hover:text-blue-400 underline underline-offset-4">
              contact us
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
