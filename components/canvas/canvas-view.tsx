"use client";

import { useEffect, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  ConnectionMode,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { cn } from "@/lib/utils";
import { useRepositoryStore } from "@/lib/stores/repository-store";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { RepositoryHeader } from "@/components/repository/repository-header";
import { FolderNode } from "./folder-node";
import { FileNode } from "./file-node";
import { RootNode } from "./root-node";
import { FolderTree, Loader2 } from "lucide-react";
import type { TreeNode } from "@/lib/types";

interface CanvasViewProps {
  className?: string;
}

// Define node data types
type NodeData = Record<string, unknown>;
type FlowNode = Node<NodeData>;
type FlowEdge = Edge;

// Node types registration
const nodeTypes = {
  folder: FolderNode,
  file: FileNode,
  root: RootNode,
};

// Dagre layout configuration
const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;
const ROOT_NODE_WIDTH = 240;
const ROOT_NODE_HEIGHT = 100;

function getLayoutedElements(
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction = "TB"
): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction, nodesep: 80, ranksep: 120 });

  nodes.forEach((node) => {
    const width = node.type === "root" ? ROOT_NODE_WIDTH : NODE_WIDTH;
    const height = node.type === "root" ? ROOT_NODE_HEIGHT : NODE_HEIGHT;
    dagreGraph.setNode(node.id, { width, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const width = node.type === "root" ? ROOT_NODE_WIDTH : NODE_WIDTH;
    const height = node.type === "root" ? ROOT_NODE_HEIGHT : NODE_HEIGHT;

    return {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    } as FlowNode;
  });

  return { nodes: layoutedNodes, edges };
}

// Convert tree structure to React Flow nodes and edges
function treeToFlowElements(
  tree: TreeNode[],
  repository: { name: string; owner: { login: string; avatar_url: string }; default_branch: string },
  maxDepth = 2
): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  // Add root node
  const rootId = "root";
  nodes.push({
    id: rootId,
    type: "root",
    position: { x: 0, y: 0 },
    data: {
      name: repository.name,
      owner: repository.owner.login,
      ownerAvatar: repository.owner.avatar_url,
      branch: repository.default_branch,
    },
  });

  // Process tree items
  const processNode = (node: TreeNode, parentId: string, depth: number) => {
    if (depth > maxDepth) return;

    const nodeId = node.path;
    const isFolder = node.type === "dir";

    if (isFolder) {
      // Count children
      const fileCount = node.children?.length || 0;
      
      nodes.push({
        id: nodeId,
        type: "folder",
        position: { x: 0, y: 0 },
        data: {
          name: node.name,
          path: node.path,
          fileCount,
        },
      });

      edges.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
        style: { stroke: "#52525b", strokeWidth: 2 },
        animated: false,
      });

      // Process children
      if (node.children && depth < maxDepth) {
        node.children.forEach((child) => {
          processNode(child, nodeId, depth + 1);
        });
      }
    } else {
      // File node
      nodes.push({
        id: nodeId,
        type: "file",
        position: { x: 0, y: 0 },
        data: {
          name: node.name,
          path: node.path,
          size: node.size,
        },
      });

      edges.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
        style: { stroke: "#52525b", strokeWidth: 2 },
        animated: false,
      });
    }
  };

  // Process top-level items
  tree.forEach((node) => {
    processNode(node, rootId, 1);
  });

  return getLayoutedElements(nodes, edges);
}

export function CanvasView({ className }: CanvasViewProps) {
  const { repository, tree, isTreeLoading } = useRepositoryStore();
  const { selectedNodes } = useCanvasStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);

  // Convert tree to flow elements when tree changes
  useEffect(() => {
    if (tree && repository) {
      const { nodes: layoutedNodes, edges: layoutedEdges } = treeToFlowElements(
        tree,
        repository,
        2 // Max depth
      );
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [tree, repository, setNodes, setEdges]);

  // Memoize node types
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  if (!repository) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full gap-4 text-center px-4",
          className
        )}
      >
        <div className="p-4 rounded-full bg-zinc-800">
          <FolderTree className="h-12 w-12 text-zinc-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">No Repository Selected</h3>
          <p className="text-sm text-zinc-500 mt-1">
            Search for a repository to visualize its structure
          </p>
        </div>
      </div>
    );
  }

  if (isTreeLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full gap-4",
          className
        )}
      >
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-sm text-zinc-400">Loading repository structure...</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full bg-zinc-950", className)}>
      {/* Repository Info */}
      <div className="p-4 border-b border-zinc-800">
        <RepositoryHeader showClear={false} />
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={memoizedNodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#27272a"
            className="bg-zinc-950"
          />
          <Controls
            className="!bg-zinc-800 !border-zinc-700 !rounded-lg overflow-hidden [&>button]:!bg-zinc-800 [&>button]:!border-zinc-700 [&>button]:!text-zinc-400 [&>button:hover]:!bg-zinc-700"
            showInteractive={false}
          />
          
          {/* Selected nodes count */}
          {selectedNodes.length > 0 && (
            <Panel position="top-right" className="!m-4">
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-2">
                <p className="text-sm text-blue-300">
                  {selectedNodes.length} node{selectedNodes.length > 1 ? "s" : ""} selected
                </p>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
}
