"use client";

import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: ChatMessageType;
  className?: string;
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-4",
        isUser ? "bg-transparent" : "bg-muted/30",
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {isUser ? "You" : "Assistant"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.isStreaming ? (
            <div className="flex items-center gap-2">
              <span>{message.content}</span>
              <span className="inline-block w-2 h-4 bg-foreground animate-pulse" />
            </div>
          ) : (
            <MessageContent content={message.content} />
          )}
        </div>

        {/* Actions */}
        {isAssistant && !message.isStreaming && (
          <div className="flex items-center gap-1 pt-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface MessageContentProps {
  content: string;
}

function MessageContent({ content }: MessageContentProps) {
  // Simple markdown-like rendering
  // For full markdown support, you could use react-markdown
  const lines = content.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        // Code blocks (simple inline code)
        if (line.startsWith("```")) {
          return null; // Skip code block markers for now
        }

        // Headers
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="text-base font-semibold mt-4 mb-2">
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="text-lg font-semibold mt-4 mb-2">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h1 key={index} className="text-xl font-bold mt-4 mb-2">
              {line.slice(2)}
            </h1>
          );
        }

        // Bullet points
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={index} className="ml-4">
              {renderInlineFormatting(line.slice(2))}
            </li>
          );
        }

        // Numbered lists
        const numberedMatch = line.match(/^(\d+)\.\s/);
        if (numberedMatch) {
          return (
            <li key={index} className="ml-4 list-decimal">
              {renderInlineFormatting(line.slice(numberedMatch[0].length))}
            </li>
          );
        }

        // Empty lines
        if (!line.trim()) {
          return <div key={index} className="h-2" />;
        }

        // Regular paragraphs
        return (
          <p key={index}>
            {renderInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineFormatting(text: string): React.ReactNode {
  // Handle inline code
  const parts = text.split(/(`[^`]+`)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Handle bold
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((boldPart, boldIndex) => {
      if (boldPart.startsWith("**") && boldPart.endsWith("**")) {
        return (
          <strong key={`${index}-${boldIndex}`}>
            {boldPart.slice(2, -2)}
          </strong>
        );
      }
      return boldPart;
    });
  });
}

function formatTime(date: Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
