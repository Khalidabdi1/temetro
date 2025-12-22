import { Button } from "@/components/ui/button"
import AppBorder from "@/screen/border"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"


export default function Pagethree() {
    const navigate = useNavigate()

    function handleClick() {
        localStorage.setItem("hasOnboarded", "true")
        navigate("/auth")
    }


    useEffect(() => {
        window.electronAPI.changeWindowSize(723, 500)
    }, [])
    return (
        <AppBorder>
            <img src="/onboardthree.svg" className="w-full object-cover" />

            <div className="p-4">
                <h1 className="text-2xl font-extrabold tracking-tight">
                    AI that understands your system.
                </h1>
                <p className="text-muted-foreground text-base">
                    Get instant help fixing errors, customizing themes, and automating your Linux workflow — your intelligent companion for everything inside the system.

                </p>
            </div>

            <div className="flex-1 flex justify-between items-end p-4">

                <Link to={"/onboarded/pagetwo"}>
                    <Button variant={"outline"}>Back</Button>
                </Link>



                <Button onClick={handleClick}>
                    Next
                </Button>

            </div>
        </AppBorder>



    )
}