import { SparklesIcon, UploadIcon } from "lucide-react";

import AppToggle from "@/components/navbar-components/app-toggle";
import TeamSwitcher from "@/components/navbar-components/team-switcher";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input"



const teams = ["Acme Inc.", "coss.com", "Junon"];

export default function Component() {
  return (
    <header className=" px-4 md:px-6 mt-0" >
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* <TeamSwitcher defaultTeam={teams[0]} teams={teams} /> */}
          <Button variant={"outline"}>Members</Button>
          <Dialog>
            <DialogTrigger>
              <Button>New project</Button>
            </DialogTrigger>

            <DialogPopup>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>Dialog Description</DialogDescription>


              </DialogHeader>
              <DialogPanel>

                <Field>
                  <FieldLabel>Project Name</FieldLabel>
                  <Input placeholder="Enter your name" type="text" />
                  <FieldDescription>Visible on your profile</FieldDescription>
                </Field>

                 <Field className={"mt-4"}>
                  <FieldLabel>Repositorie URL</FieldLabel>
                  <Input placeholder="Enter Repositorie Link" type="text" />
                  <FieldDescription>Write a project link on GitHub</FieldDescription>
                </Field>

              </DialogPanel>
              <DialogFooter>
                <DialogClose className={"flex justify-between items-center w-full"}>
                  <Button variant={"outline"} className="">Close</Button>
                </DialogClose>

                <DialogClose>
                  <Button variant={"default"} className="">Create</Button>
                </DialogClose>
              </DialogFooter>
            </DialogPopup>

          </Dialog>

        </div>
        {/* Middle area */}









        <div className=" w-full flex justify-center items-center">
          {/* <AppToggle /> */}
        </div>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            className="text-sm max-sm:aspect-square max-sm:p-0"
            size="sm"
            variant="ghost"
          >
            <UploadIcon
              aria-hidden="true"
              className="sm:-ms-1 opacity-60"
              size={16}
            />
            <span className="max-sm:sr-only">Export</span>
          </Button>
          <Button className="text-sm max-sm:aspect-square max-sm:p-0" size="sm">
            <SparklesIcon
              aria-hidden="true"
              className="sm:-ms-1 opacity-60"
              size={16}
            />
            <span className="max-sm:sr-only">Upgrade</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
