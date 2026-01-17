"use client";

import { FolderGit2, FileCode, MessageSquare, Zap } from "lucide-react";
import {
  MetricCard,
  ActivityChart,
  RecentRepos,
  LanguageChart,
  QuickActions,
} from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800/50 bg-zinc-900/30 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Overview of your repository analysis activity
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Repositories"
              value="24"
              subtitle="Total analyzed"
              icon={FolderGit2}
              trend={{ value: 12, isPositive: true }}
              delay={0}
            />
            <MetricCard
              title="Files Analyzed"
              value="1,847"
              subtitle="Across all repos"
              icon={FileCode}
              trend={{ value: 8, isPositive: true }}
              delay={0.05}
            />
            <MetricCard
              title="AI Conversations"
              value="156"
              subtitle="This month"
              icon={MessageSquare}
              trend={{ value: 23, isPositive: true }}
              delay={0.1}
            />
            <MetricCard
              title="Queries Today"
              value="42"
              subtitle="AI interactions"
              icon={Zap}
              delay={0.15}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActivityChart className="lg:col-span-2" />
            <LanguageChart />
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentRepos />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
