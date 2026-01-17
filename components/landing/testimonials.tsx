"use client"

import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

interface Testimonial {
  content: string
  author: string
  role: string
  company: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    content: "Temetro cut our onboarding time in half. New engineers can understand our codebase in days instead of weeks.",
    author: "Sarah Chen",
    role: "Engineering Lead",
    company: "TechCorp",
    avatar: "SC"
  },
  {
    content: "The visual canvas is a game-changer. I can finally see how all the pieces fit together in our monorepo.",
    author: "Marcus Rodriguez",
    role: "Senior Developer",
    company: "StartupXYZ",
    avatar: "MR"
  },
  {
    content: "I use Temetro daily for code reviews. The AI explains complex functions better than most documentation.",
    author: "Emily Watson",
    role: "Staff Engineer",
    company: "DataFlow",
    avatar: "EW"
  },
  {
    content: "Finally, a tool that understands context. It knows exactly what file I'm looking at when I ask questions.",
    author: "Alex Kim",
    role: "Full Stack Developer",
    company: "BuildCo",
    avatar: "AK"
  },
  {
    content: "We integrated Temetro into our PR workflow. It's like having a senior engineer review every change.",
    author: "Jordan Taylor",
    role: "Tech Lead",
    company: "ScaleUp",
    avatar: "JT"
  },
  {
    content: "The pattern recognition feature found three anti-patterns in our codebase we'd missed for months.",
    author: "Priya Sharma",
    role: "Principal Engineer",
    company: "CloudBase",
    avatar: "PS"
  }
]

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative p-6 rounded-xl bg-card border border-border hover:border-border/80 transition-all duration-300"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-foreground mb-6 leading-relaxed">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{testimonial.author}</p>
          <p className="text-xs text-muted-foreground">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  )
}

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="relative py-24 bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      
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
            TESTIMONIALS
          </motion.span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Loved by developers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what developers are saying about how Temetro transformed their workflow.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
