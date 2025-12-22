import { Button } from "@/components/ui/button"
import AppBorder from "@/screen/border"
import { useEffect } from "react"
import { Link } from "react-router-dom"

export default function Pageone() {
    useEffect(() => {
        window.electronAPI.changeWindowSize(723, 500)
    }, [])
    return (
        <AppBorder>
            <img src="/onboardone.svg" className="w-full object-cover" />

            <div className="p-4">
                <h1 className="text-2xl font-extrabold tracking-tight">
                    One-line control unit for your system
                </h1>
                <p className="text-muted-foreground text-base">
                    Change the theme, customize the icons, or run system commands — all from one sleek interface.          
                    
                          </p>
            </div>

            <div className="flex-1 flex justify-end items-end p-4">
               <Link to={"/onboarded/pagetwo"}>
               <Button>Next</Button>
               </Link>
            </div>
        </AppBorder>



    )
}