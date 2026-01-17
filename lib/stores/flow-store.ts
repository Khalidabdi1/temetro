import { create } from "zustand";
import {
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Connection,
  MarkerType,
} from "@xyflow/react";

// Node types for the workflow
export type FlowNodeType =
  | "start"
  | "end"
  | "agent"
  | "guardrail"
  | "condition";

// Data structure for each node type
export interface StartNodeData extends Record<string, unknown> {
  label: string;
}

export interface EndNodeData extends Record<string, unknown> {
  label: string;
}

export interface AgentNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  agentType?: string;
}

export interface GuardrailNodeData extends Record<string, unknown> {
  label: string;
  description?: string;
  guardrailType: "jailbreak" | "hallucination" | "custom";
  passLabel?: string;
  failLabel?: string;
}

export interface ConditionNodeData extends Record<string, unknown> {
  label: string;
  conditions: {
    id: string;
    label: string;
    value: string;
  }[];
  elseLabel?: string;
}

export type FlowNodeData =
  | StartNodeData
  | EndNodeData
  | AgentNodeData
  | GuardrailNodeData
  | ConditionNodeData;

// Workflow metadata
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: "draft" | "published";
  nodes: Node[];
  edges: Edge[];
  createdAt: Date;
  updatedAt: Date;
}

// Context menu state
export interface ContextMenu {
  id: string;
  top: number;
  left: number;
  type: "node" | "pane" | "edge";
  nodeId?: string;
  edgeId?: string;
}

interface FlowState {
  // Workflow data
  workflow: Workflow | null;
  nodes: Node[];
  edges: Edge[];

  // Selection state
  selectedNode: Node | null;
  selectedEdge: Edge | null;

  // UI state
  contextMenu: ContextMenu | null;
  isPanelOpen: boolean;
  isLoading: boolean;
  error: string | null;

  // History for undo/redo
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;

  // Node/Edge change handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (type: FlowNodeType, position: { x: number; y: number }) => void;
  updateNode: (nodeId: string, data: Partial<FlowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;

  // Selection
  setSelectedNode: (node: Node | null) => void;
  setSelectedEdge: (edge: Edge | null) => void;

  // Context menu
  setContextMenu: (menu: ContextMenu | null) => void;

  // Panel
  setIsPanelOpen: (open: boolean) => void;

  // Workflow management
  createWorkflow: (name: string, description?: string) => void;
  loadWorkflow: (workflow: Workflow) => void;
  saveWorkflow: () => Workflow | null;
  setWorkflowName: (name: string) => void;
  setWorkflowStatus: (status: "draft" | "published") => void;

  // History
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // Reset
  reset: () => void;
}

// Helper to generate unique IDs
const generateId = () => `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Default node data based on type
const getDefaultNodeData = (type: FlowNodeType): FlowNodeData => {
  switch (type) {
    case "start":
      return { label: "Start" };
    case "end":
      return { label: "End" };
    case "agent":
      return { label: "Agent", description: "", agentType: "general" };
    case "guardrail":
      return {
        label: "Guardrail",
        guardrailType: "jailbreak",
        passLabel: "Pass",
        failLabel: "Fail",
      };
    case "condition":
      return {
        label: "If / else",
        conditions: [
          { id: "1", label: "condition_1", value: "" },
        ],
        elseLabel: "Else",
      };
    default:
      return { label: "Node" };
  }
};

// Initial state
const initialState = {
  workflow: null,
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  contextMenu: null,
  isPanelOpen: false,
  isLoading: false,
  error: null,
  history: [],
  historyIndex: -1,
};

export const useFlowStore = create<FlowState>((set, get) => ({
  ...initialState,

  // Node change handler
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  // Edge change handler
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  // Connection handler
  onConnect: (connection: Connection) => {
    const newEdge: Edge = {
      ...connection,
      id: `edge_${Date.now()}`,
      type: "smoothstep",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
      },
    } as Edge;

    set({
      edges: addEdge(newEdge, get().edges),
    });
    get().saveToHistory();
  },

  setNodes: (nodes) => set({ nodes }),

  setEdges: (edges) => set({ edges }),

  addNode: (type, position) => {
    const newNode: Node = {
      id: generateId(),
      type,
      position,
      data: getDefaultNodeData(type),
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNode: newNode,
      isPanelOpen: true,
    });
    get().saveToHistory();
  },

  updateNode: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
    get().saveToHistory();
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode,
      contextMenu: null,
    });
    get().saveToHistory();
  },

  duplicateNode: (nodeId) => {
    const node = get().nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const newNode: Node = {
      ...node,
      id: generateId(),
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      data: { ...node.data },
    };

    set({
      nodes: [...get().nodes, newNode],
      selectedNode: newNode,
      contextMenu: null,
    });
    get().saveToHistory();
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
      selectedEdge: get().selectedEdge?.id === edgeId ? null : get().selectedEdge,
      contextMenu: null,
    });
    get().saveToHistory();
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  setSelectedEdge: (edge) => set({ selectedEdge: edge }),

  setContextMenu: (menu) => set({ contextMenu: menu }),

  setIsPanelOpen: (open) => set({ isPanelOpen: open }),

  createWorkflow: (name, description) => {
    const workflow: Workflow = {
      id: generateId(),
      name,
      description,
      status: "draft",
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add default start node
    const startNode: Node = {
      id: generateId(),
      type: "start",
      position: { x: 100, y: 200 },
      data: { label: "Start" },
    };

    set({
      workflow,
      nodes: [startNode],
      edges: [],
      history: [],
      historyIndex: -1,
    });
  },

  loadWorkflow: (workflow) => {
    set({
      workflow,
      nodes: workflow.nodes,
      edges: workflow.edges,
      history: [],
      historyIndex: -1,
    });
  },

  saveWorkflow: () => {
    const { workflow, nodes, edges } = get();
    if (!workflow) return null;

    const updatedWorkflow: Workflow = {
      ...workflow,
      nodes,
      edges,
      updatedAt: new Date(),
    };

    set({ workflow: updatedWorkflow });
    return updatedWorkflow;
  },

  setWorkflowName: (name) => {
    const { workflow } = get();
    if (!workflow) return;
    set({ workflow: { ...workflow, name } });
  },

  setWorkflowStatus: (status) => {
    const { workflow } = get();
    if (!workflow) return;
    set({ workflow: { ...workflow, status } });
  },

  saveToHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });

    // Keep only last 50 states
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;

    const prevState = history[historyIndex - 1];
    set({
      nodes: prevState.nodes,
      edges: prevState.edges,
      historyIndex: historyIndex - 1,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;

    const nextState = history[historyIndex + 1];
    set({
      nodes: nextState.nodes,
      edges: nextState.edges,
      historyIndex: historyIndex + 1,
    });
  },

  reset: () => set(initialState),
}));
