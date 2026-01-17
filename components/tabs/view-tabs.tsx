"use client";

import { useRepositoryStore, type ViewTab } from "@/lib/stores/repository-store";
import { cn } from "@/lib/utils";
import { MessageSquare, FolderTree } from "lucide-react";

interface ViewTabsProps {
  className?: string;
}

export function ViewTabs({ className }: ViewTabsProps) {
  const { activeTab, setActiveTab, repository } = useRepositoryStore();

  const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "chat",
      label: "Chat",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      id: "canvas",
      label: "Canvas",
      icon: <FolderTree className="h-4 w-4" />,
    },
  ];

  return (
    <div className={cn("flex items-center gap-1 p-1 bg-muted rounded-lg", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          disabled={tab.id === "canvas" && !repository}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background/50",
            tab.id === "canvas" && !repository && "opacity-50 cursor-not-allowed"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
