"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface RootNodeData {
  name: string;
  owner: string;
  ownerAvatar: string;
  branch: string;
}

interface RootNodeProps {
  id: string;
  data: RootNodeData;
}

function RootNodeComponent({ data }: RootNodeProps) {
  return (
    <>
      <div
        className={cn(
          "px-5 py-4 rounded-2xl",
          "bg-gradient-to-br from-zinc-800 to-zinc-900",
          "border-2 border-zinc-600",
          "shadow-xl shadow-black/30",
          "min-w-[220px]"
        )}
      >
        <div className="flex items-center gap-4">
          <Image
            src={data.ownerAvatar}
            alt={data.owner}
            width={48}
            height={48}
            className="rounded-xl ring-2 ring-zinc-600"
          />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-white truncate">
              {data.name}
            </p>
            <p className="text-sm text-zinc-400">{data.owner}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <GitBranch className="h-3 w-3 text-zinc-500" />
              <span className="text-xs text-zinc-500">{data.branch}</span>
            </div>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-500 !border-blue-400"
      />
    </>
  );
}

export const RootNode = memo(RootNodeComponent);
