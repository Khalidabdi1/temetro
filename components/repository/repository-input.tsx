"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { 
  useRepositoryStore, 
  parseRepoInput 
} from "@/lib/stores/repository-store";
import { githubService } from "@/lib/services/github.service";
import type { Repository } from "@/lib/types";
import { 
  Search, 
  GitBranch, 
  Star, 
  GitFork,
  X,
  Clock,
  ArrowRight
} from "lucide-react";

interface RepositoryInputProps {
  className?: string;
  onRepositorySelected?: (repo: Repository) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export function RepositoryInput({
  className,
  onRepositorySelected,
  autoFocus = false,
  placeholder = "Enter repository URL or owner/repo...",
}: RepositoryInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<Repository[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    setRepository,
    setTree,
    setIsLoading,
    setIsTreeLoading,
    setError: setStoreError,
    recentRepositories,
  } = useRepositoryStore();

  // Debounced search
  useEffect(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed.length < 2) {
      setSearchResults([]);
      return;
    }

    // Check if it's a direct repo reference
    const parsed = parseRepoInput(trimmed);
    if (parsed.isValid) {
      setSearchResults([]);
      return;
    }

    // Search for repositories
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await githubService.searchRepositories(trimmed, 5);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRepository = useCallback(
    async (repo: Repository) => {
      setInputValue(repo.full_name);
      setShowDropdown(false);
      setSearchResults([]);
      setError(null);
      setRepository(repo);
      onRepositorySelected?.(repo);

      // Fetch the tree
      setIsTreeLoading(true);
      try {
        const tree = await githubService.getRepositoryTree(
          repo.owner.login,
          repo.name
        );
        setTree(tree);
      } catch (err) {
        setStoreError(err instanceof Error ? err.message : "Failed to fetch tree");
      } finally {
        setIsTreeLoading(false);
      }
    },
    [setRepository, setTree, setIsTreeLoading, setStoreError, onRepositorySelected]
  );

  const handleSubmit = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const parsed = parseRepoInput(trimmed);
    if (!parsed.isValid) {
      setError("Invalid repository format. Use 'owner/repo' or a GitHub URL.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const repo = await githubService.getRepository(parsed.owner, parsed.repo);
      await handleSelectRepository(repo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch repository");
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, setIsLoading, handleSelectRepository]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const clearInput = () => {
    setInputValue("");
    setSearchResults([]);
    setError(null);
    inputRef.current?.focus();
  };

  const showResults = showDropdown && (searchResults.length > 0 || recentRepositories.length > 0);

  return (
    <div className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
            setError(null);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "pl-10 pr-20 h-12 text-base",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={clearInput}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            className="h-8"
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
          >
            {isSearching ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error}</p>
      )}

      {/* Dropdown */}
      {showResults && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
        >
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                Search Results
              </div>
              {searchResults.map((repo) => (
                <RepositoryItem
                  key={repo.id}
                  repository={repo}
                  onClick={() => handleSelectRepository(repo)}
                />
              ))}
            </div>
          )}

          {/* Recent Repositories */}
          {searchResults.length === 0 && recentRepositories.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50 flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Recent
              </div>
              {recentRepositories.slice(0, 5).map((repo) => (
                <RepositoryItem
                  key={repo.id}
                  repository={repo}
                  onClick={() => handleSelectRepository(repo)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface RepositoryItemProps {
  repository: Repository;
  onClick: () => void;
}

function RepositoryItem({ repository, onClick }: RepositoryItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-3 py-2.5 text-left hover:bg-accent transition-colors flex items-start gap-3"
    >
      <img
        src={repository.owner.avatar_url}
        alt={repository.owner.login}
        className="h-8 w-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">
          {repository.full_name}
        </div>
        {repository.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {repository.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          {repository.language && (
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {repository.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {repository.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {repository.forks_count.toLocaleString()}
          </span>
        </div>
      </div>
    </button>
  );
}
