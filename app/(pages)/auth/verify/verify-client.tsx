"use client"

import { OTPForm } from "@/components/otp-form"
import { useSearchParams } from "next/navigation"

export function VerifyClient() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  if (!email) {
    return <div className="text-center p-10">Invalid verification link</div>
  }

  return(
     <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <OTPForm email={email}/>
      </div>
    </div>
  )
}
