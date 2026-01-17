"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Square } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EndNodeData } from "@/lib/stores/flow-store";

export function EndNode({ data, selected }: NodeProps) {
  const nodeData = data as EndNodeData;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all",
        selected && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-neutral-950"
      )}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-neutral-400 dark:!bg-neutral-600 !border-2 !border-white dark:!border-neutral-900"
      />

      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-800">
        <Square className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
      </div>
      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {nodeData.label}
      </span>
    </div>
  );
}
