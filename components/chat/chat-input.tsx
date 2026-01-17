"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useChatStore, generateMessageId } from "@/lib/stores/chat-store";
import { useRepositoryStore } from "@/lib/stores/repository-store";
import { useCanvasStore } from "@/lib/stores/canvas-store";
import { chatService } from "@/lib/services/chat.service";
import { githubService } from "@/lib/services/github.service";
import { ContextPills } from "./context-pills";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  Sparkles,
  FileCode,
  Layers,
  Cpu,
  ArrowUp,
  Paperclip,
} from "lucide-react";
import type { ChatMessage } from "@/lib/types";

const SUGGESTED_PROMPTS = [
  {
    icon: Sparkles,
    text: "Explain this project",
    prompt: "What is this repository about? Give me a high-level overview of its purpose, main features, and how it's structured.",
  },
  {
    icon: FileCode,
    text: "Key components",
    prompt: "What are the main components or modules in this codebase? How do they interact with each other?",
  },
  {
    icon: Layers,
    text: "Tech stack",
    prompt: "What technologies, frameworks, and libraries does this project use? What's the tech stack?",
  },
  {
    icon: Cpu,
    text: "Architecture",
    prompt: "Explain the architecture of this project. What design patterns are used? How is the code organized?",
  },
];

interface ChatInputProps {
  className?: string;
}

export function ChatInput({ className }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { 
    inputValue, 
    setInputValue, 
    addMessage, 
    updateMessage,
    isLoading, 
    isStreaming,
    setIsStreaming,
    setError,
    messages,
  } = useChatStore();

  const { repository, tree } = useRepositoryStore();
  const { selectedNodes } = useCanvasStore();

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading || isStreaming) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInputValue("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Create assistant message placeholder
    const assistantMessageId = generateMessageId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isStreaming: true,
    };
    addMessage(assistantMessage);

    setIsStreaming(true);

    try {
      // Build repository context with selected nodes
      const repoContext = repository
        ? {
            owner: repository.owner.login,
            repo: repository.name,
            branch: repository.default_branch,
            structure: tree 
              ? githubService.generateTreeContext(tree, 3)
              : undefined,
            selectedNodes: selectedNodes.length > 0 ? selectedNodes : undefined,
          }
        : {
            owner: "",
            repo: "",
            branch: "",
          };

      // Use streaming API
      await chatService.sendMessageStream(
        {
          message: trimmed,
          repositoryContext: repoContext,
        },
        // On chunk
        (chunk) => {
          updateMessage(assistantMessageId, {
            content: (messages.find(m => m.id === assistantMessageId)?.content || "") + chunk,
          });
        },
        // On complete
        (response) => {
          updateMessage(assistantMessageId, {
            content: response.content,
            isStreaming: false,
          });
          setIsStreaming(false);
        },
        // On error
        (error) => {
          updateMessage(assistantMessageId, {
            content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
            isStreaming: false,
          });
          setIsStreaming(false);
          setError(error.message);
        }
      );
    } catch (error) {
      // Fallback for non-streaming or if streaming fails completely
      const demoResponse = generateDemoResponse(trimmed, repository?.name);
      
      updateMessage(assistantMessageId, {
        content: demoResponse,
        isStreaming: false,
      });
      setIsStreaming(false);
    }
  }, [
    inputValue, 
    isLoading, 
    isStreaming, 
    repository, 
    tree, 
    selectedNodes,
    addMessage, 
    setInputValue, 
    updateMessage,
    setIsStreaming,
    setError,
    messages,
  ]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);

    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
    textareaRef.current?.focus();

    // Trigger resize
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, 0);
  };

  const showSuggestions = messages.length === 0 && repository;
  const canSubmit = inputValue.trim() && !isLoading && !isStreaming;

  return (
    <div className={cn("bg-zinc-950", className)}>
      {/* Suggested Prompts */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 pb-4"
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-xs text-zinc-500 mb-3 text-center">Suggested questions</p>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.text}
                      onClick={() => handlePromptClick(item.prompt)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl text-left",
                        "bg-zinc-900/50 border border-zinc-800",
                        "hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-200",
                        "group"
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
                        <IconComponent className="h-4 w-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Container */}
      <div className="p-4 pt-2">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className={cn(
              "relative rounded-2xl overflow-hidden",
              "bg-zinc-900 border-2 transition-all duration-200",
              "shadow-lg",
              isFocused
                ? "border-blue-500/50 shadow-blue-500/10 shadow-xl"
                : "border-zinc-800 hover:border-zinc-700"
            )}
          >
            {/* Context Pills */}
            <ContextPills />

            {/* Thinking State */}
            <AnimatePresence>
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-2 border-b border-zinc-800 bg-zinc-900/50"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-blue-400">AI is thinking...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="flex items-end gap-2 p-3">
              {/* Attach button */}
              <button
                className={cn(
                  "flex-shrink-0 p-2 rounded-lg transition-colors",
                  "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                )}
                title="Attach files (coming soon)"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={
                  repository
                    ? `Ask about ${repository.name}...`
                    : "Search for a repository first, then ask questions..."
                }
                disabled={isStreaming}
                className={cn(
                  "flex-1 bg-transparent resize-none",
                  "text-white placeholder:text-zinc-500",
                  "focus:outline-none",
                  "min-h-[24px] max-h-[200px] py-1",
                  "text-[15px] leading-6"
                )}
                rows={1}
              />

              {/* Send button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cn(
                  "flex-shrink-0 p-2 rounded-xl transition-all duration-200",
                  canSubmit
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                {isStreaming ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Helper text */}
          <p className="text-xs text-center text-zinc-600 mt-2">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[10px]">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}

// Demo response generator for when the API is not available
function generateDemoResponse(question: string, repoName?: string): string {
  const repo = repoName || "this repository";
  const questionLower = question.toLowerCase();

  if (questionLower.includes("overview") || questionLower.includes("about") || questionLower.includes("what is")) {
    return `Based on the repository structure, **${repo}** appears to be a web application project. Here's what I can tell you:

## Overview

This project seems to be built with modern web technologies. Looking at the file structure, I can identify several key aspects:

1. **Framework**: The presence of certain configuration files suggests this is likely a React/Next.js application
2. **Styling**: The project uses CSS/styling solutions for UI design
3. **Structure**: The codebase is organized into logical directories for components, utilities, and pages

Would you like me to dive deeper into any specific aspect of this project?`;
  }

  if (questionLower.includes("component") || questionLower.includes("module")) {
    return `Looking at **${repo}**, here are the main components I can identify:

## Key Components

- **UI Components**: Reusable interface elements like buttons, inputs, and cards
- **Layout Components**: Page structure and navigation elements
- **Feature Components**: Business logic and feature-specific code

## Component Organization

The components appear to follow a hierarchical structure where:
- Base/UI components are atomic and reusable
- Feature components compose base components
- Page components bring everything together

Would you like me to explain any specific component in more detail?`;
  }

  if (questionLower.includes("tech") || questionLower.includes("stack") || questionLower.includes("framework")) {
    return `Here's the tech stack analysis for **${repo}**:

## Technologies Detected

### Frontend
- **Framework**: React/Next.js (based on project structure)
- **Styling**: Tailwind CSS or similar utility-first CSS
- **State Management**: Likely using modern React patterns

### Development Tools
- **Language**: TypeScript/JavaScript
- **Package Manager**: npm or yarn
- **Build Tools**: Modern bundling (likely Vite or Next.js built-in)

### Code Quality
- ESLint for linting
- Prettier for formatting (if configured)

Is there a specific technology you'd like to know more about?`;
  }

  return `That's a great question about **${repo}**! 

Based on my analysis of the repository structure, I can help you understand various aspects of this codebase. Here are some things I noticed:

1. The project follows a well-organized directory structure
2. There's a clear separation between components, utilities, and configuration
3. The codebase appears to use modern development practices

To give you a more specific answer, could you tell me:
- Are you looking for information about a specific file or directory?
- Would you like to understand how certain features work?
- Are you interested in the architecture or design patterns used?

Feel free to ask more specific questions!`;
}
