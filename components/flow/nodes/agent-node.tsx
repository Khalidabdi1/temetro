"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentNodeData } from "@/lib/stores/flow-store";

export function AgentNode({ data, selected }: NodeProps) {
  const nodeData = data as AgentNodeData;

  return (
    <div
      className={cn(
        "min-w-[140px] rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all overflow-hidden",
        selected && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-neutral-950"
      )}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-neutral-400 dark:!bg-neutral-600 !border-2 !border-white dark:!border-neutral-900"
      />

      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-center w-5 h-5 rounded bg-emerald-100 dark:bg-emerald-900/30">
          <Bot className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        </div>
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {nodeData.label}
        </span>
      </div>

      {/* Content */}
      {nodeData.description && (
        <div className="px-3 py-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {nodeData.description}
          </p>
        </div>
      )}

      {/* Type badge */}
      <div className="px-3 pb-2.5">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          Agent
        </span>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-neutral-400 dark:!bg-neutral-600 !border-2 !border-white dark:!border-neutral-900"
      />
    </div>
  );
}
