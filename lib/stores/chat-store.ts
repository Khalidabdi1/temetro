import { create } from "zustand";
import type { ChatMessage, Conversation } from "@/lib/types";

interface ChatState {
  // Conversations list
  conversations: Conversation[];
  activeConversationId: string | null;
  
  // Current conversation messages
  messages: ChatMessage[];
  
  // UI state
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  
  // Input state
  inputValue: string;
  
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  appendToMessage: (id: string, content: string) => void;
  clearMessages: () => void;
  
  setIsLoading: (loading: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setError: (error: string | null) => void;
  setInputValue: (value: string) => void;
  
  reset: () => void;
}

const initialState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoading: false,
  isStreaming: false,
  error: null,
  inputValue: "",
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addConversation: (conversation) => {
    const { conversations } = get();
    set({ 
      conversations: [conversation, ...conversations],
      activeConversationId: conversation.id,
    });
  },

  updateConversation: (id, updates) => {
    const { conversations } = get();
    set({
      conversations: conversations.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    });
  },

  deleteConversation: (id) => {
    const { conversations, activeConversationId } = get();
    const filtered = conversations.filter((c) => c.id !== id);
    set({
      conversations: filtered,
      activeConversationId: activeConversationId === id ? null : activeConversationId,
      messages: activeConversationId === id ? [] : get().messages,
    });
  },

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => {
    const { messages } = get();
    set({ messages: [...messages, message] });
  },

  updateMessage: (id, updates) => {
    const { messages } = get();
    set({
      messages: messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    });
  },

  appendToMessage: (id, content) => {
    const { messages } = get();
    set({
      messages: messages.map((m) =>
        m.id === id ? { ...m, content: m.content + content } : m
      ),
    });
  },

  clearMessages: () => set({ messages: [] }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  setIsStreaming: (streaming) => set({ isStreaming: streaming }),

  setError: (error) => set({ error, isLoading: false, isStreaming: false }),

  setInputValue: (value) => set({ inputValue: value }),

  reset: () => set(initialState),
}));

// Helper to generate unique message IDs
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Helper to generate unique conversation IDs
export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
