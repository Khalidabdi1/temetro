"use client"

import * as React from "react"
import { ChevronRight, File, Folder, Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import { House } from 'lucide-react';
import { Users } from 'lucide-react';
import { useRouter } from "next/navigation"



// --- Types ---

type TreeItem = string | [string, ...TreeItem[]]

interface GitHubFile {
  path: string
  mode: string
  type: "blob" | "tree"
  sha: string
  size?: number
  url: string
}

interface GitHubTreeResponse {
  sha: string
  url: string
  tree: GitHubFile[]
  truncated: boolean
}

// بيانات تجريبية للتغييرات
const changesData = [
  { file: "Home", state: "M" ,icon:<House/>,link:"dashboard/Home"},
  { file: "Member", state: "U",icon:<Users/>,link:"dashboard/Members"},
  // { file: "app/layout.tsx", state: "M" },
]

// --- Helper Functions ---

function parseGitHubURL(url: string | null) {
  if (!url) return null
  try {
    const u = new URL(url)
    const parts = u.pathname.split("/").filter(Boolean)
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] }
    }
    return null
  } catch (e) {
    console.error("Invalid URL:", e)
    return null
  }
}

// --- التغيير الجوهري هنا ---
function buildNestedTree(files: GitHubFile[]): TreeItem[] {
  const root: TreeItem[] = []

  files.forEach((file) => {
    // إصلاح المشكلة:
    // نقوم بمعالجة الملفات فقط (blobs).
    // نتجاهل (tree) لأن مسارات الملفات تحتوي بالفعل على أسماء المجلدات.
    if (file.type !== "blob") return

    const parts = file.path.split("/")
    let currentLevel = root

    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1

      if (isLast) {
        currentLevel.push(part)
      } else {
        // البحث عن المجلد
        let existingFolder = currentLevel.find(
          (item): item is [string, ...TreeItem[]] =>
            Array.isArray(item) && item[0] === part
        )

        if (!existingFolder) {
          const newFolder: [string, ...TreeItem[]] = [part]
          currentLevel.push(newFolder)
          existingFolder = newFolder
        }

        currentLevel = existingFolder as unknown as TreeItem[]
      }
    })
  })

  // دالة الترتيب (المجلدات أولاً)
  const sortTree = (items: TreeItem[]): TreeItem[] => {
    return items.sort((a, b) => {
      const aName = Array.isArray(a) ? a[0] : a
      const bName = Array.isArray(b) ? b[0] : b
      const aIsFolder = Array.isArray(a)
      const bIsFolder = Array.isArray(b)

      if (aIsFolder === bIsFolder) return aName.localeCompare(bName)
      return aIsFolder ? -1 : 1
    }).map(item => {
        if(Array.isArray(item)) {
            const [name, ...children] = item;
            return [name, ...sortTree(children)] as [string, ...TreeItem[]]
        }
        return item
    })
  }

  return sortTree(root)
}

// --- Components ---


interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onFileSelect: (path: string) => void;
}

export function AppSidebar({ onFileSelect, ...props }: AppSidebarProps) {
  const searchParams = useSearchParams()
  const query = searchParams.get("repo_url")

  const [treeData, setTreeData] = React.useState<TreeItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!query) return

    const fetchRepoTree = async () => {
      const repoInfo = parseGitHubURL(query)
      if (!repoInfo) {
        setError("رابط المستودع غير صحيح")
        return
      }

      setLoading(true)
      setError(null)

      try {
        const branch = "main" 
        // نستخدم recursive=1 لجلب كل شيء
        const res = await fetch(
          `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/git/trees/${branch}?recursive=1`
        )

        if (!res.ok) {
           if (res.status === 404) throw new Error("المستودع غير موجود أو خاص (أو تأكد من اسم الفرع)")
           if (res.status === 403) throw new Error("تم تجاوز حد الطلبات (API Rate Limit)")
           throw new Error("حدث خطأ أثناء جلب البيانات")
        }

        const data: GitHubTreeResponse = await res.json()
        const nestedTree = buildNestedTree(data.tree)
        setTreeData(nestedTree)
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ غير معروف")
      } finally {
        setLoading(false)
      }
    }

    fetchRepoTree()
  }, [query])

const router =useRouter()
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Changes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {changesData.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton onClick={(()=>{
router.push(item.link)
                  })}>
                    {item.icon}
                    {item.file}
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{item.state}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            Files {loading && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {error ? (
              <div className="p-4 text-sm text-red-500">{error}</div>
            ) : (
              <SidebarMenu className="">
                {treeData.map((item, index) => (
                  <Tree key={index} item={item}  onFileClick={onFileSelect} 
                  path=""/>
                ))}
                {!loading && treeData.length === 0 && query && (
                   <div className="px-4 py-2 text-xs text-muted-foreground">لا توجد ملفات للعرض</div>
                )}
                {!query && (
                    <div className="px-4 py-2 text-xs text-muted-foreground">قم بتمرير repo_url في الرابط</div>
                )}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function Tree({ 
  item, 
  onFileClick, 
  path 
}: { 
  item: TreeItem; 
  onFileClick: (p: string) => void;
  path: string;
}) {
  const isFolder = Array.isArray(item)
  const currentPath = isFolder 
    ? (path ? `${path}/${item[0]}` : item[0]) 
    : (path ? `${path}/${item}` : item);
  


if (!isFolder) {
    const fileName = item as string
    return (
      <SidebarMenuItem>
        <SidebarMenuButton 
          className="data-[active=true]:bg-transparent w-full group truncate"
          title={fileName} // يظهر الاسم كاملاً عند التوقف بالفأرة (Native Tooltip)
          onClick={() => onFileClick(currentPath)} // استدعاء الدالة عند الضغط
         
        >
          <File className="h-4 w-4 shrink-0" /> {/* shrink-0 تمنع الأيقونة من الانضغاط */}
          <span className="truncate flex-1 text-left">
            {fileName}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  const [name, ...children] = item as [string, ...TreeItem[]]

  return (
    <SidebarMenuItem className="">
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={name === "app" || name === "src" || name === "components"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform h-4 w-4" />
            <Folder className="h-4 w-4" />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub >
            {children.map((subItem, index) => (
              <Tree key={index} 
                item={subItem} 
                onFileClick={onFileClick} 
                path={currentPath} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}