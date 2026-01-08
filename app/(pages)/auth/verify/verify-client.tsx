"use client"

import { OTPForm } from "@/components/otp-form"
import { useSearchParams } from "next/navigation"

export function VerifyClient() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  if (!email) {
    return <div className="text-center p-10">Invalid verification link</div>
  }

  return <OTPForm email={email} />
}
