import AppBorder from "@/screen/border"
import { useEffect } from "react"

export default function Home() {
    useEffect(() => {
        //delete after finish dev
                // localStorage.setItem("hasOnboarded", "false")

        window.electronAPI.changeWindowSize(723, 500)
    }, [])
    return (
        <AppBorder>
            <h1>Home page update check 1</h1>
        </AppBorder>



    )
}