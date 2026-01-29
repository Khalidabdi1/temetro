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
      <AppSidebar onFileSelect={handleFileSelect}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
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
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-hidden">
        <div className=" h-150 no-scrollbar   w-220 text-slate-50 rounded-xl font-mono text-sm overflow-auto  border  relative">
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
    className="p-4 [&_pre]:!bg-transparent [&_code]:!bg-transparent" 
  />
          </div>

          
        </div>

        <div className="   relative  bottom-0 w-full">
            <Ai01/>
          </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
