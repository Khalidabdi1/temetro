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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
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
import { authClient } from '@/lib/auth-client';
import axios from 'axios';
import { newPasswords } from '@/lib/zod';

export default function  Page ()  {
    const [email,Setemail]=useState<string>("")
    const [btn,Setbtn]=useState<boolean>(true)
    const [step,setStep]=useState<number>(1)
    const[description,setDescription]=useState<{Title:string,description:string,btn:string}>({
        Title:"Forget passowrd ?",
        description:"Please enter your registered email below to reset your password",
        btn:"Next"
    })
    const[newPassword,SetPassword]=useState<string>("")
    const[otp,SetOtp]=useState<string>("")
    const steps = [1, 2, 3];
    


    function otpChilid(value:string){
       SetOtp(value)
       console.log(value)

    }




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


    //verify email
    function checkEmail(){
 axios.post(process.env.NEXT_PUBLIC_BACKEND+"/api/check-email",{email}).then((db)=>{
    console.log(db.data.exists)
    if(db.data.exists){
        setStep(2)
        sendOtp()
    }

 }).catch(((error)=>{
    console.log(error)
 }))

    }

    // send otp to email after verify
   async function sendOtp(){
    const {data,error} = await authClient.emailOtp.sendVerificationOtp({
        email:email,
        type:"email-verification"
    })

    if(!error){
        setDescription(prev=>({...prev,description:"We have sent you a verification code to your email address. Please enter it.",Title:"OTP"}))
        console.log(data)
    return
    }
    console.log(error.message)
        
    }

    //check the otp

async    function checkOTP(){
const {data,error}=await authClient.emailOtp.verifyEmail({
    email:email,
    otp:otp
})

if(error){
    //message in error.message set like alert
    console.log(error)
    return
}

console.log(data)
setDescription(prev=>({...prev,Title:"New password",description:"Enter your new password"}))
setStep(3)
    }

//todo:verify new password and after that send user to dashboard
   async function NewPassword_check(value:string){
         const res = await newPasswords.safeParse(value)

         if(!res.success){

            console.log("error")
            return
         }
    }

  return (
    <div className='h-screen flex justify-center items-center flex-col'>
 {step===1&& 
 <Image src={"/forget-password.png"} height={230} width={230} alt='logo'/>
}
 {step===2&& 
 <Image src={"/otp-write.png"} height={230} width={230} alt='logo'/>
}
 {step===3&& 
 <Image src={"/otp-password.png"} height={230} width={230} alt='logo'/>
}
  <Frame className='w-[80%] md:w-[35%]'>
  <FrameHeader>
         <Stepbar steps={steps} step={step}/>


    <FrameTitle className='text-2xl '>{description.Title}</FrameTitle>
    <FrameDescription>{description.description}</FrameDescription>
  </FrameHeader>
  <FramePanel className='w-full h-full mb-0 space-y-3'>

    {step===1 &&
       <Input aria-label="Enter email" placeholder="example@gamil.com " type="text" size={"lg"} value={email} onChange={(e)=>{
        const val=e.target.value
        Setemail(val)
        check(val)
       
    }}/>
    }

    {step===3 &&
       <Input aria-label="Enter text" placeholder="passwod" type="text" size={"lg"} value={newPassword} onChange={(e)=>{
        const val=e.target.value
        SetPassword(val)
        NewPassword_check(val)
       
    }}/>
    }

    {step===2 &&
    <InputOTPS resive={otpChilid}/>

    }
 
 
{step===1&&
 <Button className='w-full' disabled={btn} variant={btn?"outline":"default"} onClick={checkEmail}>{description.btn}</Button>

}

{step===2 &&
 <Button className='w-full' disabled={btn} variant={btn?"outline":"default"} onClick={checkOTP}>{description.btn}</Button>

}



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


 function InputOTPS({resive}:{resive:(val:string)=>void}) {
    const [values,setValue]=useState<string>("")

  

  return (
    <div className='flex justify-center items-center'>
    <InputOTP className='space-x-2'  maxLength={6} onChange={((e)=>{
        setValue(e)
        resive(e)
        
    })}>
     
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
    </div>
  )
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


