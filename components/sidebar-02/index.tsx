import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./app-sidebar";

export default function Sidebar02() {
  return (
    <SidebarProvider>
      <div className="relative flex h-screen w-full">
        <DashboardSidebar />
        {/* here you can change color in right side */}
        {/* <SidebarInset className="flex flex-col bg-background" /> */}
      </div>
    </SidebarProvider>
  );
}
