"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6",
        "backdrop-blur-sm shadow-lg shadow-black/10",
        "hover:border-zinc-700/50 hover:bg-zinc-900/70 transition-all duration-300",
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-transparent opacity-50" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-zinc-500">{subtitle}</p>
          )}
          {trend && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                trend.isPositive ? "text-emerald-400" : "text-red-400"
              )}
            >
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
              <span className="text-zinc-500">vs last month</span>
            </div>
          )}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800/50 ring-1 ring-zinc-700/50">
          <Icon className="h-6 w-6 text-zinc-400" />
        </div>
      </div>
    </motion.div>
  );
}
