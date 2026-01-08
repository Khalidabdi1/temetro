import React from 'react'
import OTPPage from '@/app/(pages)/otp/page'
import { Suspense } from 'react'
import { VerifyClient } from './verify-client'

const Page = () => {
  return (
   <Suspense fallback={<div className="p-10 text-center">Loading Verification...</div>}>
      <VerifyClient />
    </Suspense>
  )
}

export default Page
