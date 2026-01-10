"use client";

import React from "react";
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "@/components/sidebar-02/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* الشريط الجانبي الثابت */}
        <DashboardSidebar />
{/*here change color*/}
        <SidebarInset className="flex flex-col flex-1  overflow-y-auto" >
          {/* الهيدر العلوي الذي يحتوي على زر الموبايل */}
          <header className="flex h-5 items-center gap-2  px-4 shrink-0">
            <SidebarTrigger  className="md:hidden"/>
          </header>

          {/* هنا يتم عرض محتوى الصفحة الذي يتغير (children) */}
          <main className="p-2   h-full w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}