"use client"

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatItem {
  value: number
  suffix: string
  label: string
}

const stats: StatItem[] = [
  { value: 50, suffix: 'K+', label: 'Repositories analyzed' },
  { value: 10, suffix: 'M+', label: 'Lines of code understood' },
  { value: 99, suffix: '%', label: 'Time saved on onboarding' },
  { value: 4.9, suffix: '/5', label: 'Developer satisfaction' }
]

function AnimatedCounter({ value, suffix }: { value: number, suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current * 10) / 10)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {Number.isInteger(value) ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  )
}

const Stats = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section className="relative py-24 bg-muted/30">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      
      <div ref={containerRef} className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Trusted by thousands of developers
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join the community of developers who are saving hours every week understanding codebases.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
