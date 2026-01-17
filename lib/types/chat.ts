export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  repositoryId: string;
  repositoryName: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export interface ConversationWithMessages extends Conversation {
  messages: ChatMessage[];
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

export interface SelectedNode {
  id: string;
  type: 'file' | 'folder';
  path: string;
  name: string;
}

export interface SendMessagePayload {
  message: string;
  conversationId?: string;
  repositoryContext: {
    owner: string;
    repo: string;
    branch: string;
    structure?: string;
    selectedNodes?: SelectedNode[];
  };
}

export interface ChatResponse {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
  conversationId: string;
}

export interface SuggestedPrompt {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  prompt: string;
}
