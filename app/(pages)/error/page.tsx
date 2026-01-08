"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function ErrorPage() {
  const params = useSearchParams()
  const reason = params.get("reason")

  const messages: Record<string, string> = {
    please_restart_the_process: "انتهت جلسة تسجيل الدخول، يرجى المحاولة مرة أخرى.",
    state_mismatch: "حدث خلل أمني أثناء تسجيل الدخول.",
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">حدث خطأ</h1>
      <p className="text-muted-foreground">
        {messages[reason ?? ""] ?? "حدث خطأ غير متوقع"}
      </p>

      <Link
        href="/auth/signup"
        className="rounded bg-black px-4 py-2 text-white"
      >
        إعادة المحاولة
      </Link>
    </div>
  )
}
