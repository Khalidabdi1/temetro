"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, Search, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900/80 via-zinc-900/50 to-blue-950/30 p-6",
        "backdrop-blur-sm shadow-lg shadow-black/10",
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
            <Sparkles className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Get Started</h3>
            <p className="text-sm text-zinc-500">Analyze any GitHub repository</p>
          </div>
        </div>

        <p className="text-sm text-zinc-400 mb-6">
          Enter any GitHub repository URL to start analyzing code structure, understand architecture, and get AI-powered insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/AI" className="flex-1">
            <Button
              className={cn(
                "w-full gap-2 bg-blue-600 hover:bg-blue-500 text-white",
                "shadow-lg shadow-blue-500/20"
              )}
            >
              <Bot className="h-4 w-4" />
              Start Analyzing
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard/AI">
            <Button
              variant="outline"
              className="gap-2 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300"
            >
              <Search className="h-4 w-4" />
              Search Repos
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
