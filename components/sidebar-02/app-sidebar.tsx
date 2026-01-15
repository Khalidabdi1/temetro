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
  Activity,
  DollarSign,
  Home,
  Infinity,
  LinkIcon,
  Package2,
  Percent,
  PieChart,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  FolderGit2,
  Bot,
  Star,
  MoveUpRight,

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
    text: "New order received.",
    time: "10m ago",
  },
    {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "New order received.",
    time: "10m ago",
  },
    {
    id: "1",
    avatar: "/avatars/01.png",
    fallback: "OM",
    text: "New order received.",
    time: "10m ago",
  },

];

const dashboardRoutes: Route[] = [
   {
    id: "Dashboard",
    title: "Dashboard",
    icon: <Home className="size-4" />,
    link: "/dashboard/Home",
  
  },

    {
    id:"ai",
    title:"AI",
    icon:   <Bot className="size-4" />,
    link:"/dashboard/AI",
  },
 

 
  
  {
    id: "Repositorie",
    title: "Repositories",
    icon: <Package2 className="size-4" />,
    link: "#",
    subs: [
      {
        title: "New Repositories",
        link: "/dashboard/Repositories/new",
        icon:     <FolderGit2 className="size-4"/>

      },
      {
        title: "All Repositories",
        link: "#",
        icon: <LinkIcon className="size-4" />,
      },
      // {
      //   title: "Stared",
      //   link: "#",
      //   icon:  <Star className="size-4" />
      // },
    ],
  },
  // {
  //   id: "usage-billing",
  //   title: "Usage Billing",
  //   icon: <PieChart className="size-4" />,
  //   link: "#",
  //   subs: [
  //     {
  //       title: "Meters",
  //       link: "#",
  //       icon: <PieChart className="size-4" />,
  //     },
  //     {
  //       title: "Events",
  //       link: "#",
  //       icon: <Activity className="size-4" />,
  //     },
  //   ],
  // },
  // {
  //   id: "benefits",
  //   title: "Benefits",
  //   icon: <Sparkles className="size-4" />,
  //   link: "#",
  // },
  // {
  //   id: "customers",
  //   title: "Customers",
  //   icon: <Users className="size-4" />,
  //   link: "#",
  // },
  // {
  //   id: "sales",
  //   title: "Sales",
  //   icon: <ShoppingBag className="size-4" />,
  //   link: "#",
  //   subs: [
  //     {
  //       title: "Orders",
  //       link: "#",
  //       icon: <ShoppingBag className="size-4" />,
  //     },
  //     {
  //       title: "Subscriptions",
  //       link: "#",
  //       icon: <Infinity className="size-4" />,
  //     },
  //   ],
  // },
  // {
  //   id: "storefront",
  //   title: "Storefront",
  //   icon: <Store className="size-4" />,
  //   link: "#",
  // },

  // {
  //   id: "finance",
  //   title: "Finance",
  //   icon: <DollarSign className="size-4" />,
  //   link: "#",
  //   subs: [
  //     { title: "Incoming", link: "#" },
  //     { title: "Outgoing", link: "#" },
  //     { title: "Payout Account", link: "#" },
  //   ],
  // },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings className="size-4" />,
    link: "/dashboard/settings/Profile",
    subs: [
      { title: "Profile", link: "/dashboard/settings/Profile" },
      {title:"Subscription",link:"/dashboard/settings/Subscription"}
      // { title: "Webhooks", link: "#" },
      // { title: "Custom Fields", link: "#" },
    ],
  },
    {
    id: "Documentation",
    title: "Documentation",
    icon: <MoveUpRight className="size-4"/>,
    link: "#",
  },
];

const teams = [
  { id: "1", name: "Alpha Inc.", logo: Logo, plan: "Free" },
  { id: "2", name: "Beta Corp.", logo: Logo, plan: "Free" },
  { id: "3", name: "Gamma Tech", logo: Logo, plan: "Free" },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="inset" collapsible="icon" className="">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <a href="#" className="flex items-center gap-2">
          <Image src={"/logo2.png"} height={50} width={50} alt="logo"/>
          {/* <Logo className="h-8 w-8" /> */}
          {/* {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              temetro
            </span>
          )} */}
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
            "flex items-center gap-2 w-full ",
            isCollapsed ? "hidden" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
         <Particle/>
        </motion.div>
        
        
       
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <TeamSwitcher teams={teams} />
      </SidebarFooter>
    </Sidebar>
  );
}
