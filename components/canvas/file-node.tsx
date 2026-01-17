"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  FileCode,
  FileJson,
  FileText,
  File,
  FileType,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/stores/canvas-store";

export interface FileNodeData {
  name: string;
  path: string;
  language?: string;
  size?: number;
}

interface FileNodeProps {
  id: string;
  data: FileNodeData;
}

// Get icon based on file extension
function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  
  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
    case "mjs":
    case "cjs":
      return FileCode;
    case "json":
      return FileJson;
    case "md":
    case "txt":
    case "rst":
      return FileText;
    case "yaml":
    case "yml":
    case "toml":
    case "ini":
    case "env":
      return Settings;
    case "css":
    case "scss":
    case "less":
    case "html":
      return FileType;
    default:
      return File;
  }
}

// Get color based on file extension
function getFileColor(name: string, selected: boolean): string {
  if (selected) return "text-blue-400";
  
  const ext = name.split(".").pop()?.toLowerCase();
  
  switch (ext) {
    case "ts":
    case "tsx":
      return "text-blue-400";
    case "js":
    case "jsx":
    case "mjs":
    case "cjs":
      return "text-yellow-400";
    case "json":
      return "text-amber-400";
    case "md":
    case "txt":
      return "text-zinc-400";
    case "css":
    case "scss":
    case "less":
      return "text-purple-400";
    case "html":
      return "text-orange-400";
    case "py":
      return "text-green-400";
    default:
      return "text-zinc-400";
  }
}

function formatSize(size?: number): string {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function FileNodeComponent({ data, id }: FileNodeProps) {
  const { isNodeSelected, toggleNodeSelection } = useCanvasStore();
  const selected = isNodeSelected(id);
  const Icon = getFileIcon(data.name);
  const iconColor = getFileColor(data.name, selected);

  const handleClick = () => {
    toggleNodeSelection({
      id,
      type: "file",
      path: data.path,
      name: data.name,
    });
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-zinc-600 !border-zinc-500"
      />
      <div
        onClick={handleClick}
        className={cn(
          "px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
          "bg-zinc-800/90 backdrop-blur-sm",
          "border-2 min-w-[160px]",
          "hover:bg-zinc-700/90 hover:shadow-lg hover:shadow-blue-500/10",
          selected
            ? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20"
            : "border-zinc-700 hover:border-zinc-600"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              selected ? "bg-blue-500/20" : "bg-zinc-700/50"
            )}
          >
            <Icon className={cn("h-4 w-4", iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {data.name}
            </p>
            {data.size && (
              <p className="text-xs text-zinc-500">
                {formatSize(data.size)}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const FileNode = memo(FileNodeComponent);
