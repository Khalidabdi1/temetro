"use client"
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios'


const Hero = () => {
    const [Email, SetEmail] = useState<string>("");
    const [alert, setAlert] = useState<boolean>(false)
    console.log(process.env.NEXT_PUBLIC_BACKEND)
    
    function sandData() {
        axios.post(process.env.NEXT_PUBLIC_BACKEND + "waitlist", {
            email: Email
        }).then((data)=>{
            console.log(data)
        })

        setAlert(true)
        SetEmail("")
        setTimeout(() => {
            setAlert(false)
        }, 3000)

    }

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
                    <Input value={Email} placeholder='Email' className='w-70' onChange={(e) => {
                        SetEmail(e.target.value)
                    }} />

                    <Button onClick={() => {
sandData()
                    }}>Join Waitlist</Button>
                </div>
            </div>

            <Alert variant="default" className={`${alert === false ? "hidden" : "block"} absolute bottom-0 right-0 w-100 m-3`} >
                {/* <Terminal /> */}
                <AlertTitle>Thanks!</AlertTitle>
                <AlertDescription>
                    We will let you know when we launch the service.
                </AlertDescription>
            </Alert>
        </div>
    )
}

export default Hero
