"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const oauthUsed = sessionStorage.getItem("oauth_used")

    if (oauthUsed === "true") {
      router.replace("/error?reason=please_restart_the_process")
      return
    }

    const error = searchParams.get("error")
    if (error) {
      sessionStorage.setItem("oauth_used", "true")
      router.replace(`/error?reason=${error}`)
      return
    }

    sessionStorage.setItem("oauth_used", "true")
    router.replace("/dashboard")
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  )
}
