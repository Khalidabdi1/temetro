"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { ChatMessage } from "./chat-message";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface MessageListProps {
  className?: string;
}

export function MessageList({ className }: MessageListProps) {
  const { messages, isStreaming } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      <div className="divide-y divide-border">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

interface EmptyStateProps {
  className?: string;
}

export function EmptyState({ className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full gap-4 text-center px-4",
      className
    )}>
      <div className="p-4 rounded-full bg-muted">
        <MessageSquare className="h-12 w-12 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-xl font-semibold">Start a conversation</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Ask questions about the repository structure, code patterns, 
          how components work, or anything else you want to understand.
        </p>
      </div>
    </div>
  );
}
