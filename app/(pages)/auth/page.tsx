import React from 'react'
import { SignupForm } from '@/components/signup-form'
import { Suspense } from "react"

const Page = () => {
  return (
    <Suspense>
   <SignupForm/>
   </Suspense>
  )
}

export default Page
