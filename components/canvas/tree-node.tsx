"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from "lucide-react";
import type { TreeNode } from "@/lib/types";
import { useRepositoryStore } from "@/lib/stores/repository-store";

// File extension to icon/color mapping
const getFileIcon = (name: string): { icon: string; color: string } => {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  
  const iconMap: Record<string, { icon: string; color: string }> = {
    // JavaScript/TypeScript
    js: { icon: "JS", color: "text-yellow-500" },
    jsx: { icon: "JSX", color: "text-yellow-500" },
    ts: { icon: "TS", color: "text-blue-500" },
    tsx: { icon: "TSX", color: "text-blue-500" },
    mjs: { icon: "MJS", color: "text-yellow-500" },
    cjs: { icon: "CJS", color: "text-yellow-500" },
    
    // Web
    html: { icon: "HTML", color: "text-orange-500" },
    css: { icon: "CSS", color: "text-blue-400" },
    scss: { icon: "SCSS", color: "text-pink-500" },
    sass: { icon: "SASS", color: "text-pink-500" },
    less: { icon: "LESS", color: "text-blue-400" },
    
    // Data
    json: { icon: "JSON", color: "text-yellow-600" },
    yaml: { icon: "YAML", color: "text-red-400" },
    yml: { icon: "YML", color: "text-red-400" },
    xml: { icon: "XML", color: "text-orange-400" },
    toml: { icon: "TOML", color: "text-gray-500" },
    
    // Markdown/Docs
    md: { icon: "MD", color: "text-blue-300" },
    mdx: { icon: "MDX", color: "text-blue-300" },
    txt: { icon: "TXT", color: "text-gray-400" },
    
    // Config
    env: { icon: "ENV", color: "text-green-500" },
    gitignore: { icon: "GIT", color: "text-orange-600" },
    
    // Images
    png: { icon: "IMG", color: "text-purple-400" },
    jpg: { icon: "IMG", color: "text-purple-400" },
    jpeg: { icon: "IMG", color: "text-purple-400" },
    gif: { icon: "IMG", color: "text-purple-400" },
    svg: { icon: "SVG", color: "text-orange-400" },
    ico: { icon: "ICO", color: "text-purple-400" },
    
    // Other languages
    py: { icon: "PY", color: "text-green-500" },
    rb: { icon: "RB", color: "text-red-500" },
    go: { icon: "GO", color: "text-cyan-500" },
    rs: { icon: "RS", color: "text-orange-600" },
    java: { icon: "JAVA", color: "text-red-500" },
    kt: { icon: "KT", color: "text-purple-500" },
    swift: { icon: "SWIFT", color: "text-orange-500" },
    php: { icon: "PHP", color: "text-purple-600" },
    c: { icon: "C", color: "text-blue-500" },
    cpp: { icon: "C++", color: "text-blue-600" },
    h: { icon: "H", color: "text-blue-400" },
    
    // Shell
    sh: { icon: "SH", color: "text-green-400" },
    bash: { icon: "BASH", color: "text-green-400" },
    zsh: { icon: "ZSH", color: "text-green-400" },
    
    // Lock files
    lock: { icon: "LOCK", color: "text-gray-500" },
  };

  return iconMap[ext] || { icon: "", color: "text-gray-400" };
};

interface TreeNodeItemProps {
  node: TreeNode;
  depth?: number;
  onNodeClick?: (node: TreeNode) => void;
}

export function TreeNodeItem({ node, depth = 0, onNodeClick }: TreeNodeItemProps) {
  const { toggleTreeNode } = useRepositoryStore();
  const isFolder = node.type === "dir";
  const fileInfo = !isFolder ? getFileIcon(node.name) : null;

  const handleClick = () => {
    if (isFolder) {
      toggleTreeNode(node.path);
    } else {
      onNodeClick?.(node);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors text-left",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Expand/Collapse indicator */}
        {isFolder ? (
          <span className="w-4 h-4 flex items-center justify-center text-muted-foreground">
            {node.isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        ) : (
          <span className="w-4 h-4" />
        )}

        {/* Icon */}
        {isFolder ? (
          node.isExpanded ? (
            <FolderOpen className="h-4 w-4 text-blue-400" />
          ) : (
            <Folder className="h-4 w-4 text-blue-400" />
          )
        ) : fileInfo?.icon ? (
          <span className={cn("text-[10px] font-bold w-4 text-center", fileInfo.color)}>
            {fileInfo.icon.slice(0, 2)}
          </span>
        ) : (
          <File className="h-4 w-4 text-muted-foreground" />
        )}

        {/* Name */}
        <span className="truncate flex-1">{node.name}</span>

        {/* File size (optional) */}
        {!isFolder && node.size && (
          <span className="text-xs text-muted-foreground">
            {formatFileSize(node.size)}
          </span>
        )}
      </button>

      {/* Children (if expanded) */}
      {isFolder && node.isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
