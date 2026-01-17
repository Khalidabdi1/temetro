"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ActivityChartProps {
  className?: string;
}

// Sample data - in real app, this would come from API
const data = [
  { name: "Mon", analyses: 4, queries: 12 },
  { name: "Tue", analyses: 7, queries: 19 },
  { name: "Wed", analyses: 5, queries: 15 },
  { name: "Thu", analyses: 9, queries: 28 },
  { name: "Fri", analyses: 12, queries: 35 },
  { name: "Sat", analyses: 6, queries: 18 },
  { name: "Sun", analyses: 8, queries: 24 },
];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-900 p-3 shadow-xl">
        <p className="text-xs font-medium text-zinc-400 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm text-white">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ActivityChart({ className }: ActivityChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn(
        "rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6",
        "backdrop-blur-sm shadow-lg shadow-black/10",
        className
      )}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Activity Overview</h3>
        <p className="text-sm text-zinc-500">Repository analyses and AI queries this week</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="analyses"
              name="Analyses"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAnalyses)"
            />
            <Area
              type="monotone"
              dataKey="queries"
              name="Queries"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorQueries)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500" />
          <span className="text-sm text-zinc-400">Analyses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-violet-500" />
          <span className="text-sm text-zinc-400">AI Queries</span>
        </div>
      </div>
    </motion.div>
  );
}
