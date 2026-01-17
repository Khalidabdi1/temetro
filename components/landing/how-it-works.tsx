"use client"

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Github, Network, MessageCircle, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: "01",
    icon: Github,
    title: "Connect Repository",
    description: "Paste any public GitHub repository URL. We'll fetch the entire file structure and prepare it for exploration.",
    color: "text-foreground",
    accent: "from-muted-foreground to-muted-foreground/50"
  },
  {
    number: "02",
    icon: Network,
    title: "Explore the Canvas",
    description: "Your repository appears as an interactive visual graph. Click folders to expand them, select files to add context.",
    color: "text-blue-500",
    accent: "from-blue-500 to-blue-600"
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Chat with AI",
    description: "Ask anything about the code. The AI reads files on demand and provides detailed explanations with code references.",
    color: "text-green-500",
    accent: "from-green-500 to-green-600"
  }
]

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="relative py-24 bg-background overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div 
          className="text-center mb-20"
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
            HOW IT WORKS
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Three simple steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Go from confused to confident about any codebase in minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Step card */}
                <div className="relative flex flex-col items-center text-center">
                  {/* Number badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-card border border-border z-10">
                    <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
                  </div>
                  
                  {/* Icon container */}
                  <motion.div 
                    className="relative mb-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.accent} p-[1px]`}>
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                        <step.icon className={`w-8 h-8 ${step.color}`} />
                      </div>
                    </div>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.accent} opacity-20 blur-xl`} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps (hidden on last step and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 -right-6 w-12 items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Demo preview */}
        <motion.div 
          className="mt-20 relative"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-10 pointer-events-none" />
          <div className="bg-card/50 border border-border rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
                <Github className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground font-mono">vercel/next.js</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
              <span className="text-sm text-muted-foreground">Analyzing 2,847 files...</span>
            </div>
            
            {/* Stats visualization */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Files Indexed", value: "2,847" },
                { label: "Folders", value: "312" },
                { label: "Languages", value: "TypeScript" },
                { label: "Analysis Time", value: "< 3s" }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  className="p-4 rounded-lg bg-muted/50 border border-border"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
