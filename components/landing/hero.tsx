"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Sparkles, GitBranch, MessageSquare, Play } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Gradient orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px]"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px]"
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='currentColor'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      />

      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeUp}>
          <Badge 
            variant="outline" 
            className="mb-6 px-4 py-2 border-border bg-muted/50 backdrop-blur-sm hover:bg-muted/80 transition-colors cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 text-blue-500" />
            <span className="text-muted-foreground text-sm font-medium">AI-Powered Code Understanding</span>
          </Badge>
        </motion.div>

        {/* Main heading */}
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]"
          variants={fadeUp}
        >
          Understand any codebase
          <br />
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            in minutes, not hours
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          variants={fadeUp}
        >
          Connect your GitHub repository, explore it visually on an interactive canvas, 
          and chat with AI to understand architecture, patterns, and code flow instantly.
        </motion.p>

        {/* Feature pills */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-10"
          variants={fadeUp}
        >
          {[
            { icon: GitBranch, text: "Visual Repository Canvas", color: "text-green-500" },
            { icon: MessageSquare, text: "AI-Powered Chat", color: "text-blue-500" },
            { icon: Sparkles, text: "Context-Aware Analysis", color: "text-purple-500" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              {item.text}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeUp}
        >
          <Link href="/auth/signup">
            <Button 
              size="lg" 
              className="px-8 py-6 text-base font-medium bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 shadow-lg group"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-base font-medium border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 group"
          >
            <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div 
          className="mt-12 flex flex-col items-center gap-4"
          variants={fadeUp}
        >
          <p className="text-sm text-muted-foreground">
            Trusted by developers from
          </p>
          <div className="flex items-center gap-8 opacity-50">
            {['Vercel', 'Stripe', 'Linear', 'Notion', 'Figma'].map((company, i) => (
              <span key={i} className="text-sm font-medium text-muted-foreground">
                {company}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating mockup */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-full max-w-4xl px-6 hidden lg:block"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <motion.div 
            className="bg-card/90 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs text-muted-foreground">temetro - AI Repository Analysis</span>
            </div>
            {/* Preview content */}
            <div className="flex h-56">
              {/* Canvas side */}
              <div className="w-1/2 p-4 border-r border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                </div>
                <div className="space-y-2">
                  {[
                    { color: 'bg-yellow-500/30', width: 'w-16', ml: 'ml-4' },
                    { color: 'bg-blue-500/30', width: 'w-20', ml: 'ml-4' },
                    { color: 'bg-green-500/30', width: 'w-14', ml: 'ml-8' },
                    { color: 'bg-purple-500/30', width: 'w-18', ml: 'ml-8' },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 ${item.ml}`}>
                      <div className={`w-4 h-4 rounded ${item.color}`} />
                      <div className={`h-2 ${item.width} rounded bg-muted`} />
                    </div>
                  ))}
                </div>
              </div>
              {/* Chat side */}
              <div className="w-1/2 p-4">
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-blue-500/20 rounded-lg px-3 py-2 max-w-[80%]">
                      <div className="h-2 w-32 rounded bg-blue-500/30" />
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-3 py-2 max-w-[80%]">
                      <div className="h-2 w-40 rounded bg-muted-foreground/20 mb-1" />
                      <div className="h-2 w-28 rounded bg-muted-foreground/20" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-500/20 rounded-lg px-3 py-2 max-w-[80%]">
                      <div className="h-2 w-24 rounded bg-blue-500/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
