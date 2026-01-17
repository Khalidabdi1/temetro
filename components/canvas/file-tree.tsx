"use client";

import { useRepositoryStore } from "@/lib/stores/repository-store";
import { useChatStore } from "@/lib/stores/chat-store";
import { cn } from "@/lib/utils";
import { TreeNodeItem } from "./tree-node";
import type { TreeNode } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import { FolderTree, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { githubService } from "@/lib/services/github.service";

interface FileTreeProps {
  className?: string;
  onFileClick?: (node: TreeNode) => void;
}

export function FileTree({ className, onFileClick }: FileTreeProps) {
  const { 
    tree, 
    isTreeLoading, 
    repository,
    setTree,
    setIsTreeLoading,
    setActiveTab,
  } = useRepositoryStore();
  const { setInputValue } = useChatStore();
  
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = async () => {
    if (!repository) return;
    
    setIsTreeLoading(true);
    try {
      const newTree = await githubService.getRepositoryTree(
        repository.owner.login,
        repository.name
      );
      setTree(newTree);
    } catch (error) {
      console.error("Failed to refresh tree:", error);
    } finally {
      setIsTreeLoading(false);
    }
  };

  const handleFileClick = (node: TreeNode) => {
    if (onFileClick) {
      onFileClick(node);
    } else {
      // Default behavior: switch to chat with a prompt about the file
      const prompt = node.type === "dir"
        ? `What is the purpose of the "${node.path}" directory?`
        : `What does the file "${node.path}" do?`;
      
      setInputValue(prompt);
      setActiveTab("chat");
    }
  };

  // Filter tree based on search
  const filteredTree = useMemo(() => {
    if (!tree || !searchQuery.trim()) return tree;

    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.reduce<TreeNode[]>((acc, node) => {
        const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
        const filteredChildren = node.children ? filterNodes(node.children) : [];

        if (matchesSearch || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children,
            isExpanded: searchQuery.trim() ? true : node.isExpanded, // Auto-expand when searching
          });
        }

        return acc;
      }, []);
    };

    return filterNodes(tree);
  }, [tree, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!tree) return { files: 0, folders: 0 };

    let files = 0;
    let folders = 0;

    const countNodes = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.type === "dir") {
          folders++;
          if (node.children) countNodes(node.children);
        } else {
          files++;
        }
      }
    };

    countNodes(tree);
    return { files, folders };
  }, [tree]);

  if (isTreeLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-64 gap-3", className)}>
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Loading file tree...</p>
      </div>
    );
  }

  if (!tree || tree.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-64 gap-3", className)}>
        <FolderTree className="h-12 w-12 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">No files found</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderTree className="h-4 w-4" />
          <span>{stats.folders} folders, {stats.files} files</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleRefresh}
          disabled={isTreeLoading}
        >
          <RefreshCw className={cn("h-4 w-4", isTreeLoading && "animate-spin")} />
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto p-2">
        {filteredTree && filteredTree.length > 0 ? (
          filteredTree.map((node) => (
            <TreeNodeItem
              key={node.path}
              node={node}
              onNodeClick={handleFileClick}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            No files match "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
