import { create } from "zustand";

export interface CanvasNode {
  id: string;
  type: "file" | "folder";
  path: string;
  name: string;
}

interface CanvasState {
  // Selected nodes for context
  selectedNodes: CanvasNode[];
  
  // Actions
  selectNode: (node: CanvasNode) => void;
  deselectNode: (nodeId: string) => void;
  toggleNodeSelection: (node: CanvasNode) => void;
  clearSelection: () => void;
  isNodeSelected: (nodeId: string) => boolean;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  selectedNodes: [],

  selectNode: (node) => {
    const { selectedNodes } = get();
    if (!selectedNodes.find((n) => n.id === node.id)) {
      set({ selectedNodes: [...selectedNodes, node] });
    }
  },

  deselectNode: (nodeId) => {
    const { selectedNodes } = get();
    set({ selectedNodes: selectedNodes.filter((n) => n.id !== nodeId) });
  },

  toggleNodeSelection: (node) => {
    const { selectedNodes, selectNode, deselectNode } = get();
    if (selectedNodes.find((n) => n.id === node.id)) {
      deselectNode(node.id);
    } else {
      selectNode(node);
    }
  },

  clearSelection: () => set({ selectedNodes: [] }),

  isNodeSelected: (nodeId) => {
    const { selectedNodes } = get();
    return selectedNodes.some((n) => n.id === nodeId);
  },
}));
