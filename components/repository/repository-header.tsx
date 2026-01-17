"use client";

import { useRepositoryStore } from "@/lib/stores/repository-store";
import { cn } from "@/lib/utils";
import { GitBranch, Star, GitFork, ExternalLink, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RepositoryHeaderProps {
  className?: string;
  showClear?: boolean;
}

export function RepositoryHeader({ className, showClear = true }: RepositoryHeaderProps) {
  const { repository, clearRepository } = useRepositoryStore();

  if (!repository) return null;

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 bg-muted/50 rounded-lg border",
      className
    )}>
      <img
        src={repository.owner.avatar_url}
        alt={repository.owner.login}
        className="h-10 w-10 rounded-full"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold truncate">{repository.full_name}</h3>
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          {repository.language && (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {repository.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            {repository.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" />
            {repository.forks_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitBranch className="h-3.5 w-3.5" />
            {repository.default_branch}
          </span>
        </div>
      </div>
      {repository.topics && repository.topics.length > 0 && (
        <div className="hidden md:flex items-center gap-1.5">
          {repository.topics.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      )}
      {showClear && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={clearRepository}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
