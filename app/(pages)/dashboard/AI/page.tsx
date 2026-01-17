"use client";

import { useRepositoryStore } from "@/lib/stores/repository-store";
import { ChatContainer } from "@/components/chat";
import { CanvasView } from "@/components/canvas";
import { ViewTabs } from "@/components/tabs";

export default function AIPage() {
  const { activeTab } = useRepositoryStore();

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex justify-center py-3 border-b">
        <ViewTabs />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" ? (
          <ChatContainer />
        ) : (
          <CanvasView />
        )}
      </div>
    </div>
  );
}
