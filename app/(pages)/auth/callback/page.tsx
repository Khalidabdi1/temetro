"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function AuthCallbackContent() {
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
  }, [router, searchParams])

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Processing authentication...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  )
}