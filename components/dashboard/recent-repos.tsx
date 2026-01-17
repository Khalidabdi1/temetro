"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GitBranch, Star, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Repository {
  id: string;
  name: string;
  owner: string;
  ownerAvatar: string;
  language: string;
  stars: number;
  lastAnalyzed: string;
}

interface RecentReposProps {
  className?: string;
}

// Sample data - in real app, this would come from API
const recentRepos: Repository[] = [
  {
    id: "1",
    name: "next.js",
    owner: "vercel",
    ownerAvatar: "https://avatars.githubusercontent.com/u/14985020?v=4",
    language: "TypeScript",
    stars: 120000,
    lastAnalyzed: "2 hours ago",
  },
  {
    id: "2",
    name: "react",
    owner: "facebook",
    ownerAvatar: "https://avatars.githubusercontent.com/u/69631?v=4",
    language: "JavaScript",
    stars: 218000,
    lastAnalyzed: "5 hours ago",
  },
  {
    id: "3",
    name: "tailwindcss",
    owner: "tailwindlabs",
    ownerAvatar: "https://avatars.githubusercontent.com/u/67109815?v=4",
    language: "CSS",
    stars: 78000,
    lastAnalyzed: "1 day ago",
  },
  {
    id: "4",
    name: "shadcn-ui",
    owner: "shadcn",
    ownerAvatar: "https://avatars.githubusercontent.com/u/124599?v=4",
    language: "TypeScript",
    stars: 58000,
    lastAnalyzed: "2 days ago",
  },
];

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-500",
  CSS: "bg-purple-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
};

function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`;
  }
  return stars.toString();
}

export function RecentRepos({ className }: RecentReposProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className={cn(
        "rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6",
        "backdrop-blur-sm shadow-lg shadow-black/10",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Repositories</h3>
          <p className="text-sm text-zinc-500">Your recently analyzed repositories</p>
        </div>
        <Link
          href="/dashboard/AI"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          View all
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {recentRepos.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className={cn(
              "group flex items-center gap-4 rounded-xl p-3",
              "bg-zinc-800/30 hover:bg-zinc-800/60 transition-all duration-200",
              "border border-transparent hover:border-zinc-700/50 cursor-pointer"
            )}
          >
            <Image
              src={repo.ownerAvatar}
              alt={repo.owner}
              width={40}
              height={40}
              className="rounded-lg ring-1 ring-zinc-700"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate">
                  {repo.owner}/{repo.name}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <div className={cn("h-2 w-2 rounded-full", languageColors[repo.language] || "bg-zinc-500")} />
                  <span className="text-xs text-zinc-500">{repo.language}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-zinc-500" />
                  <span className="text-xs text-zinc-500">{formatStars(repo.stars)}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-zinc-500">{repo.lastAnalyzed}</span>
              <div className="mt-1">
                <GitBranch className="h-4 w-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
