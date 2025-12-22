import { Button } from "@/components/ui/button"
import AppBorder from "@/screen/border"
import { useEffect } from "react"
import { Link } from "react-router-dom"



export default function Pagetwo() {
    useEffect(() => {
        window.electronAPI.changeWindowSize(723, 500)
    }, [])
    return (
        <AppBorder>
            <img src="/onboardtwo.svg" className="w-full object-cover" />

            <div className="p-4">
                <h1 className="text-2xl font-extrabold tracking-tight">
                    Themes and Tools Store Open
                </h1>
                <p className="text-muted-foreground text-base">

                    Browse hundreds of community-designed themes and plugins — or create your own in minutes
                </p>
            </div>

            <div className="flex-1 flex justify-between items-end p-4">

                <Link to={"/onboarded/pageone"}>
                    <Button variant={"outline"}>Back</Button>
                </Link>


                <Link to={"/onboarded/pagethree"}>
                    <Button>Next</Button>
                </Link>
            </div>
        </AppBorder>



    )
}