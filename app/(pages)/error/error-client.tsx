"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export function ErrorClient() {
  const params = useSearchParams()
  const reason = params.get("reason")

  const messages: Record<string, string> = {
    please_restart_the_process:
      "Your login session has ended, please try again.",
    state_mismatch: "A security error occurred during login.",
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">An error occurred</h1>
      <p className="text-muted-foreground">
        {messages[reason ?? ""] ?? "An unexpected error occurred"}
      </p>

      <Link
        href="/auth/signup"
        className="rounded bg-black px-4 py-2 text-white"
      >
Try again
      </Link>
    </div>
  )
}
