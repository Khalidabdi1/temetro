import React from 'react'
import { SignupForm } from '@/components/signup-form'
import { Suspense } from "react"

const Page = () => {
  return (
    <Suspense fallback={<div className="p-10 text-center ">Loading Verification...</div>}>
   <SignupForm/>
   </Suspense>
  )
}

export default Page
