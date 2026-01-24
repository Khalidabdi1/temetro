"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";
import { LogOut } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import {  useState} from "react";
import { useEffect } from "react";
import Image from "next/image";


type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

export function TeamSwitcher({ teams }: { teams: Team[] }) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
const [userName, setUserName] = useState<string | null>(null);
const [Info,SetInfo]=useState<{Name:string,img:string}>({
  Name:"",
  img:""
})
  

  const Logo = activeTeam.logo;

  // user name

  // async function userInfo (){
  //   const res =await supabase.auth.getUser()

    
  // }

 useEffect(() => {
    const fetchUser = async () => {
      // إحضار بيانات المستخدم الحالية
      const { data: { user }, error } = await supabase.auth.getUser();

      if (user) {
        // إذا كنت قد خزنت الاسم في الـ user_metadata أثناء التسجيل
        setUserName(user.user_metadata?.Name || user.email);
        console.log("بيانات المستخدم كاملة:", user);
        SetInfo(prev=>({...prev,img:user.user_metadata.picture}))
        console.log(user.user_metadata.picture)
        
      }
    };

    fetchUser();
  }, []);

  console.log(Info)

  if (!activeTeam) return null;

  


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-background text-foreground">
                {/* <Logo className="size-4" /> */}
                
                <Image src={Info.img} alt="logo" width={30} height={30}></Image>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg mb-4"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Teams ss
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <team.logo className="size-4 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2 ">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background" >
                <LogOut className="size-4" />
              </div>

              <div className="font-medium text-muted-foreground">Sign out</div>

            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
