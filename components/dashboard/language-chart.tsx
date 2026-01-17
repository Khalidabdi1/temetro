"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface LanguageChartProps {
  className?: string;
}

// Sample data - in real app, this would come from API
const languageData = [
  { name: "TypeScript", value: 45, color: "#3178c6" },
  { name: "JavaScript", value: 25, color: "#f7df1e" },
  { name: "Python", value: 15, color: "#3776ab" },
  { name: "CSS", value: 10, color: "#264de4" },
  { name: "Other", value: 5, color: "#6b7280" },
];

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number; color: string } }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
        <p className="text-sm font-medium text-white">{data.name}</p>
        <p className="text-xs text-zinc-400">{data.value}% of analyzed code</p>
      </div>
    );
  }
  return null;
};

export function LanguageChart({ className }: LanguageChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className={cn(
        "rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6",
        "backdrop-blur-sm shadow-lg shadow-black/10",
        className
      )}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Languages</h3>
        <p className="text-sm text-zinc-500">Distribution across analyzed repos</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {languageData.map((lang, index) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="flex-1 text-sm text-zinc-300">{lang.name}</span>
              <span className="text-sm font-medium text-zinc-400">{lang.value}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
