"use client";

import { X, Folder, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCanvasStore, CanvasNode } from "@/lib/stores/canvas-store";
import { motion, AnimatePresence } from "framer-motion";

interface ContextPillsProps {
  className?: string;
}

export function ContextPills({ className }: ContextPillsProps) {
  const { selectedNodes, deselectNode, clearSelection } = useCanvasStore();

  if (selectedNodes.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2 px-4 py-3 border-b border-zinc-800", className)}>
      <span className="text-xs text-zinc-500 mr-1">Context:</span>
      <AnimatePresence mode="popLayout">
        {selectedNodes.map((node) => (
          <ContextPill key={node.id} node={node} onRemove={() => deselectNode(node.id)} />
        ))}
      </AnimatePresence>
      {selectedNodes.length > 1 && (
        <button
          onClick={clearSelection}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

interface ContextPillProps {
  node: CanvasNode;
  onRemove: () => void;
}

function ContextPill({ node, onRemove }: ContextPillProps) {
  const Icon = node.type === "folder" ? Folder : FileCode;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg",
        "bg-zinc-800 border border-zinc-700",
        "text-sm text-zinc-300",
        "hover:bg-zinc-700/80 transition-colors"
      )}
    >
      <Icon className={cn(
        "h-3.5 w-3.5",
        node.type === "folder" ? "text-amber-400" : "text-blue-400"
      )} />
      <span className="max-w-[120px] truncate">{node.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-0.5 rounded hover:bg-zinc-600 transition-colors"
      >
        <X className="h-3 w-3 text-zinc-500 hover:text-zinc-300" />
      </button>
    </motion.div>
  );
}
