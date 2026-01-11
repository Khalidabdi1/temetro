"use client"
import React from 'react'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { verifyemail } from '@/lib/zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/components/ui/stepper";
import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame"
import Image from 'next/image';

export default function  Page ()  {
    const [email,Setemail]=useState<string>("")
    const [btn,Setbtn]=useState<boolean>(true)
    const [step,setStep]=useState<number>(1)
    const steps = [1, 2, 3];


    function check(value:string){
        const resoult=verifyemail.safeParse(value)
        if(!resoult.success){
            Setbtn(true)
           //show is wrong 
        //    console.log(resoult.error)
           
        }else{
            Setbtn(false)
             console.log("yes:",btn)
        }
    }

    function reset(){
        
    }

  return (
    <div className='h-screen flex justify-center items-center flex-col'>
 
<Image src={"/forget-password.png"} height={200} width={200} alt='logo'/>
  <Frame className='w-[80%] md:w-[35%]'>
  <FrameHeader>
         <Stepbar steps={steps} step={step}/>

    <FrameTitle>Forget passowrd ?</FrameTitle>
    <FrameDescription>Enter your email</FrameDescription>
  </FrameHeader>
  <FramePanel className='w-full h-full mb-0 space-y-3'>
 
    <Input aria-label="Enter text" placeholder="example@gamil.com " type="text" size={"lg"} value={email} onChange={(e)=>{
        const val=e.target.value
        Setemail(val)
        check(val)
       
    }}/>

 <Button className='w-full' disabled={btn} variant={btn?"outline":"default"}>Reset password</Button>

    <Link href={"/auth/login"} className='w-full'>
        <Button className='w-full' variant={"ghost"}>Back to Login</Button>

    </Link>
  </FramePanel>
  {/* <FrameFooter className='w-full'>
    
  </FrameFooter>  */}
</Frame>


    </div>
  )
}



function Cardbody(){
    
}



function Stepbar({steps,step}:{steps:number[],step:number}){
    return(
          <div className="mx-auto max-w-xl space-y-8 text-center w-[80%] md:w-[30%] mb-4">
      <Stepper defaultValue={1} value={step}>
        {steps.map((step) => (
          <StepperItem className="not-last:flex-1" key={step} step={step}>
            <StepperTrigger>
              <StepperIndicator asChild>{step}</StepperIndicator>
            </StepperTrigger>
            {step < steps.length && <StepperSeparator />}
          </StepperItem>
        ))}
      </Stepper>
      {/* <p
        aria-live="polite"
        className="mt-2 text-muted-foreground text-xs"
        role="region"
      >
        Stepper with numbers only
      </p> */}
    </div>
    )
}


