"use client";

import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandDialogTrigger,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useRouter } from "next/navigation";

export interface Item {
  value: string;
  label: string;
  shortcut?: string;
  link:string
}

export interface Group {
  value: string;
  items: Item[];
}

export const suggestions: Item[] = [
  { label: "Home", value: "Home",link:"/dashboard/Home" },
  { label: "AI", value: "AI" ,link:"/dashboard/AI" },
  { label: "settings", value: "settings" ,link:"/dashboard/settings" },
  { label: "YouTube", value: "youtube" ,link:"" },
  { label: "Raycast", value: "raycast" ,link:"" },
];

export const commands: Item[] = [
  { label: "Clipboard History", shortcut: "⌘⇧C", value: "clipboard-history",link:""  },
  { label: "Import Extension", shortcut: "⌘I", value: "import-extension",link:""  },
  { label: "Create Snippet", shortcut: "⌘N", value: "create-snippet" ,link:"" },
  { label: "System Preferences", shortcut: "⌘,", value: "system-preferences" ,link:"" },
  { label: "Window Management", shortcut: "⌘⇧W", value: "window-management",link:""  },
];

export const groupedItems: Group[] = [
  { items: suggestions, value: "Page" },
  { items: commands, value: "Commands" },
];

export default function Particle() {
  const [open, setOpen] = React.useState(false);
  const router =useRouter()

  function handleItemClick(_item: Item) {
    console.log(_item.value)
    router.push(_item.link)
    setOpen(false);
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandDialogTrigger render={<Button variant="default"className="flex border border- justify-between bg-background hover:bg-background hover:cursor-pointer w-full"/>}>
        Search...
        <KbdGroup>
          <Kbd>⌘k</Kbd>
         
        </KbdGroup>
      </CommandDialogTrigger>
      <CommandDialogPopup>
        <Command items={groupedItems}>
          <CommandInput placeholder="Search for apps and commands..." className={"ml-10 w-127 focus:border-none border-0"}/>
          <CommandPanel>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandList>
              {(group: Group, _index: number) => (
                <React.Fragment key={group.value}>
                  <CommandGroup items={group.items}>
                    <CommandGroupLabel>{group.value}</CommandGroupLabel>
                    <CommandCollection>
                      {(item: Item) => (
                        <CommandItem
                          key={item.value}
                          onClick={() => handleItemClick(item)}
                          value={item.value}
                        >
                          <span className="flex-1">{item.label}</span>
                          {item.shortcut && (
                            <CommandShortcut>{item.shortcut}</CommandShortcut>
                          )}
                        </CommandItem>
                      )}
                    </CommandCollection>
                  </CommandGroup>
                  <CommandSeparator />
                </React.Fragment>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <KbdGroup>
                  <Kbd>
                    <ArrowUpIcon />
                  </Kbd>
                  <Kbd>
                    <ArrowDownIcon />
                  </Kbd>
                </KbdGroup>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <Kbd>
                  <CornerDownLeftIcon />
                </Kbd>
                <span>Open</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Kbd>Esc</Kbd>
              <span>Close</span>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}
