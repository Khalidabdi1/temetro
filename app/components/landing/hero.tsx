"use client"
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const Hero = () => {
const[Email,SetEmail]=useState<string>("")

    return (
        <div className='flex justify-center items-center '>

            <div className='w-[90%] md:w-[70%] '>
                <div className='flex justify-center items-center flex-col space-y-2'>
                    <Badge variant={"outline"} className='mt-15'>
                        <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance">
                            Open Source • Early Access

                        </h1>
                    </Badge>

                    <div className=' flex justify-center items-center flex-col mt-4'>
                        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                            Version Control. Code Only. Nothing Else.

                        </h1>

                        <p className="leading-7 [&:not(:first-child)]:mt-2 text-center">
                            A minimal, open-source version control system built only for code.
                        </p>

                    </div>


                </div>

                <div className='flex justify-center items-center mt-5 space-x-3'>
                    <Input placeholder='Email'  className='w-80' onChange={(e)=>{
                        SetEmail(e.target.value)
                    }}/>
                    <Button>Get Early Access</Button>
                </div>
            </div>

        </div>
    )
}

export default Hero
