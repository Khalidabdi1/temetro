"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Folder, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore } from "@/lib/stores/canvas-store";

export interface FolderNodeData {
  name: string;
  path: string;
  fileCount: number;
}

interface FolderNodeProps {
  id: string;
  data: FolderNodeData;
}

function FolderNodeComponent({ data, id }: FolderNodeProps) {
  const { isNodeSelected, toggleNodeSelection } = useCanvasStore();
  const selected = isNodeSelected(id);

  const handleClick = () => {
    toggleNodeSelection({
      id,
      type: "folder",
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
          "border-2 min-w-[180px]",
          "hover:bg-zinc-700/90 hover:shadow-lg hover:shadow-blue-500/10",
          selected
            ? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/20"
            : "border-zinc-700 hover:border-zinc-600"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              selected ? "bg-blue-500/20" : "bg-amber-500/10"
            )}
          >
            <Folder
              className={cn(
                "h-5 w-5",
                selected ? "text-blue-400" : "text-amber-400"
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {data.name}
            </p>
            <p className="text-xs text-zinc-500">
              {data.fileCount} items
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-500" />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-zinc-600 !border-zinc-500"
      />
    </>
  );
}

export const FolderNode = memo(FolderNodeComponent);
