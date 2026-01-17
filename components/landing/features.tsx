"use client"

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  GitBranch, 
  MessageSquare, 
  MousePointer2, 
  Zap,
  Eye,
  Brain,
  LucideIcon
} from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  color: string
  bgColor: string
}

const features: Feature[] = [
  {
    icon: GitBranch,
    title: "Visual Repository Canvas",
    description: "See your entire codebase as an interactive graph. Folders and files are auto-arranged using intelligent layout algorithms.",
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    icon: MessageSquare,
    title: "AI-Powered Chat",
    description: "Ask questions about your code in natural language. Get instant explanations of architecture, patterns, and implementation details.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: MousePointer2,
    title: "Context Selection",
    description: "Click on any file or folder in the canvas to add it to your chat context. The AI understands exactly what you're looking at.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "No waiting for indexing. Connect your repository and start exploring immediately with real-time file fetching.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10"
  },
  {
    icon: Eye,
    title: "Deep Code Reading",
    description: "The AI can read any file in your repository on demand, following imports and tracing data flow across your codebase.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10"
  },
  {
    icon: Brain,
    title: "Pattern Recognition",
    description: "Automatically identifies design patterns, architectural decisions, and potential improvements in your codebase.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10"
  }
]

interface FeatureCardProps {
  feature: Feature
  index: number
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative p-6 rounded-xl bg-card border border-border hover:border-border/80 transition-all duration-300 cursor-default"
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease-out' }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Icon */}
        <div 
          className={`relative w-12 h-12 rounded-lg ${feature.bgColor} border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
          style={{ transform: 'translateZ(20px)' }}
        >
          <feature.icon className={`w-6 h-6 ${feature.color}`} />
        </div>
        
        {/* Content */}
        <h3 
          className="relative text-lg font-semibold text-foreground mb-2"
          style={{ transform: 'translateZ(10px)' }}
        >
          {feature.title}
        </h3>
        <p 
          className="relative text-muted-foreground text-sm leading-relaxed"
          style={{ transform: 'translateZ(5px)' }}
        >
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="relative py-24 bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
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
            FEATURES
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need to understand code
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for developers who need to quickly understand 
            and navigate complex codebases.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
