"use client"
import React from 'react'
import { authClient } from '@/lib/auth-client'
import { date } from 'zod'

export default function Page(){
  const{data:session, isPending,error}=authClient.useSession()
  if(isPending)return <div>looding....</div>
  if(error) return <div>error...</div>
  return (
    <div>
      HOME your name is {session?.user?.name}
    </div>
  )
}

