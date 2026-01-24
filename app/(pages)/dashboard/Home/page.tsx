"use client"
import React from 'react'
import { authClient } from '@/lib/auth-client'
import Header from "./header"
import Content from './content'

export default function Page(){
  const{data:session, isPending,error}=authClient.useSession()

  // if(isPending)return <div>looding....</div>
  // if(error) return <div>error...</div>


  return (
    <div>
      <Header/>
      <Content/>
    </div>
  )
}

