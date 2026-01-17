"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Particle from "./Command";
import Image from "next/image";

import {
  Home,
  Settings,
  Bot,
  CreditCard,
  User,
  LayoutGrid,
} from "lucide-react";

import { Logo } from "./logo";
import type { Route } from "./nav-main";
import DashboardNavigation from "./nav-main";
import { NotificationsPopover } from "./nav-notifications";
import { TeamSwitcher } from "./team-switcher";

const sampleNotifications = [
  {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "New analysis complete.",
    time: "10m ago",
  },
  {
    id: "2",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "Repository synced.",
    time: "1h ago",
  },
];

// Cleaned up routes - only essential navigation
const dashboardRoutes: Route[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home className="size-4" />,
    link: "/dashboard",
  },
  {
    id: "ai",
    title: "Chat & Canvas",
    icon: <Bot className="size-4" />,
    link: "/dashboard/AI",
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings className="size-4" />,
    link: "/dashboard/settings/Profile",
    subs: [
      { 
        title: "Profile", 
        link: "/dashboard/settings/Profile", 
        icon: <User className="size-4" /> 
      },
      { 
        title: "Subscription", 
        link: "/dashboard/settings/Subscription", 
        icon: <CreditCard className="size-4" /> 
      },
    ],
  },
];

const teams = [
  { id: "1", name: "Personal", logo: Logo, plan: "Free" },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-zinc-800">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <a href="/dashboard" className="flex items-center gap-2">
          <Image src={"/logo2.png"} height={40} width={40} alt="logo" className="rounded-lg"/>
          {!isCollapsed && (
            <span className="font-semibold text-white text-lg">
              Temetro
            </span>
          )}
        </a>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <NotificationsPopover notifications={sampleNotifications} />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="gap-4 px-2 py-4">
        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2 w-full",
            isCollapsed ? "hidden" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Particle />
        </motion.div>

        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>

      <SidebarFooter className="px-2">
        <TeamSwitcher teams={teams} />
      </SidebarFooter>
    </Sidebar>
  );
}
