"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuardrailNodeData } from "@/lib/stores/flow-store";

export function GuardrailNode({ data, selected }: NodeProps) {
  const nodeData = data as GuardrailNodeData;

  const getGuardrailColor = (type: string) => {
    switch (type) {
      case "jailbreak":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
      case "hallucination":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
      default:
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    }
  };

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
        <div className={cn("flex items-center justify-center w-5 h-5 rounded", getGuardrailColor(nodeData.guardrailType))}>
          <Shield className="w-3 h-3" />
        </div>
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {nodeData.label}
        </span>
      </div>

      {/* Pass/Fail outputs */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {nodeData.passLabel || "Pass"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {nodeData.failLabel || "Fail"}
          </span>
        </div>
      </div>

      {/* Pass output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        style={{ top: "45%" }}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white dark:!border-neutral-900"
      />

      {/* Fail output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="fail"
        style={{ top: "75%" }}
        className="!w-3 !h-3 !bg-red-500 !border-2 !border-white dark:!border-neutral-900"
      />
    </div>
  );
}
