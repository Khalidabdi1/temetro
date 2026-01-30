"use client"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ArrowUpIcon, PlusIcon, InfoIcon, Send, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import {
    Menu,
    MenuItem,
    MenuPopup,
    MenuTrigger,
} from "@/components/ui/menu";
import {

    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Popover,
    PopoverClose,
    PopoverDescription,
    PopoverPopup,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Tooltip,
    TooltipPopup,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { useSearchParams } from "next/navigation"
import * as React from "react"
import { Code } from "@/components/animate-ui/components/animate/code"
import { CodeHeader } from "@/components/animate-ui/components/animate/code"
import { CodeBlock } from "@/components/animate-ui/primitives/animate/code-block"
import Ai01 from "@/components/ai-01"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardPanel,
    CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"


export default function Page() {
    const [fileContent, setFileContent] = React.useState<string>("// Select a file to view the code")
    const [isLoading, setIsLoading] = React.useState(false)
    const searchParams = useSearchParams()
    const query = searchParams.get("repo_url")

    const handleFileSelect = async (filePath: string) => {
        if (!query) return

        setIsLoading(true)
        try {
            // استخراج الـ owner والـ repo من الرابط
            const urlParts = new URL(query).pathname.split("/").filter(Boolean)
            const [owner, repo] = urlParts

            const res = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`
            )
            const data = await res.json()

            if (data.content) {
                // GitHub يعيد المحتوى مشفراً بـ Base64، نحتاج لفك التشفير
                const decodedCode = atob(data.content.replace(/\n/g, ''))
                setFileContent(decodedCode)
            }
        } catch (err) {
            setFileContent("// خطأ في جلب محتوى الملف")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <SidebarProvider >
            <AppSidebar onFileSelect={handleFileSelect} />
            <SidebarInset className=" grid grid-cols-3  ">
                <div className=" relative w-full  col-span-2 ">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-none px-4   ">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />


                        <Breadcrumb >
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">components</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">ui</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>button.tsx</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>

                    <div className="flex flex-1 flex-col gap-4 p-1   mr-10  w-full h-full no-scrollbar">
                        <div className=" h-full no-scrollbar  w-full shadow-2xs  no-scrollbar text-slate-50 rounded-xl font-mono text-sm overflow-auto  border  ">
                            {isLoading && (
                                <div className="absolute inset-0  flex items-center justify-center backdrop-blur-sm">
                                    {/* <Loader2 className="animate-spin" /> */}
                                </div>
                            )}
                            {/* <pre className="whitespace-pre">
              <code>{fileContent}</code>
            </pre> */}
                            {/* <CodeHeader /> */}
                            <CodeBlock
                                code={fileContent}
                                theme="dark"
                                lang="tsx"
                                className="p-4 [&_pre]:!bg-transparent [&_code]:!bg-transparent "
                            />
                        </div>


                    </div>



                </div>

                <div className="col-span-1  w-full no-scrollbar p-3">
                    <Cards />
                </div>

            </SidebarInset>
        </SidebarProvider>
    )
}


function Cards() {
    return (
        <Card className="sticky top-1 h-170  space-y-0 m-0 p-2">
            <CardHeader>
                <CardTitle>Title</CardTitle>
                <CardDescription>Description</CardDescription>
            </CardHeader>
            <CardPanel className="h-full bg-green-500 mb-0">Content</CardPanel>
            <CardFooter className=" mb-0 flex justify-center items-end bg-red-500 mt-0 ">
                <AiInput />
            </CardFooter>
        </Card>
    )
}

function AiInput() {
    return (
        <InputGroup className="flex flex-col mt-0 mb-0">
            <InputGroupInput id="email-1" placeholder="Add your comment..." type="email"  className={"mt-0"}/>
            <div className="flex justify-between  w-full p-1">
                <div className="flex justify-center items-center">
                    <Button variant={"destructive"} className="bg-red-600 border-none rounded-full"><Circle className="" /></Button>

                    <Popover>
                        <PopoverTrigger><ArrowUpIcon className="size-5" /></PopoverTrigger>
                        <PopoverPopup>
                            <PopoverTitle>Popover Title</PopoverTitle>
                            <PopoverDescription>Popover Description</PopoverDescription>
                            <PopoverClose>Close</PopoverClose>
                        </PopoverPopup>
                    </Popover>

                </div>


                <div>
                    <Button className="rounded-full"><Send /></Button>

                </div>
            </div>
        </InputGroup>
    )
}
