"use client";

import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/stores/chat-store";
import { useRepositoryStore } from "@/lib/stores/repository-store";
import { MessageList, EmptyState } from "./message-list";
import { ChatInput } from "./chat-input";
import { RepositoryHeader } from "@/components/repository/repository-header";
import { RepositoryInput } from "@/components/repository/repository-input";

interface ChatContainerProps {
  className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const { messages } = useChatStore();
  const { repository } = useRepositoryStore();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Repository Context Header */}
      {repository && (
        <div className="p-4 border-b">
          <RepositoryHeader />
        </div>
      )}

      {/* Messages or Empty State */}
      <div className="flex-1 overflow-hidden">
        {!repository ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                Explore GitHub Repositories
              </h2>
              <p className="text-muted-foreground max-w-md">
                Enter a repository URL or search for a project to start asking
                questions about its code, structure, and functionality.
              </p>
            </div>
            <RepositoryInput autoFocus className="mb-8" />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState />
        ) : (
          <MessageList />
        )}
      </div>

      {/* Input */}
      {repository && <ChatInput />}
    </div>
  );
}
