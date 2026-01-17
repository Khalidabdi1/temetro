"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConditionNodeData } from "@/lib/stores/flow-store";

export function ConditionNode({ data, selected }: NodeProps) {
  const nodeData = data as ConditionNodeData;

  // Calculate handle positions based on number of conditions
  const totalOutputs = nodeData.conditions.length + 1; // conditions + else

  return (
    <div
      className={cn(
        "min-w-[160px] rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all overflow-hidden",
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
        <div className="flex items-center justify-center w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/30">
          <GitBranch className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {nodeData.label}
        </span>
      </div>

      {/* Conditions list */}
      <div className="px-3 py-2 space-y-1.5">
        {nodeData.conditions.map((condition, index) => (
          <div key={condition.id} className="flex items-center justify-between">
            <span className="text-xs text-neutral-600 dark:text-neutral-300 font-mono">
              {condition.label}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {nodeData.elseLabel || "Else"}
          </span>
        </div>
      </div>

      {/* Output handles for each condition */}
      {nodeData.conditions.map((condition, index) => {
        const position = ((index + 1) / (totalOutputs + 1)) * 100;
        return (
          <Handle
            key={condition.id}
            type="source"
            position={Position.Right}
            id={condition.id}
            style={{ top: `${position}%` }}
            className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white dark:!border-neutral-900"
          />
        );
      })}

      {/* Else handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="else"
        style={{ top: `${(totalOutputs / (totalOutputs + 1)) * 100}%` }}
        className="!w-3 !h-3 !bg-neutral-400 dark:!bg-neutral-600 !border-2 !border-white dark:!border-neutral-900"
      />
    </div>
  );
}
