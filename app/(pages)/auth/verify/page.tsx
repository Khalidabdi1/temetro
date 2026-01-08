import React from 'react'
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
