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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
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
import { useRouter } from 'next/navigation'

export default function Page() {
  const [email, Setemail] = useState<string>("")
  const [btn, Setbtn] = useState<boolean>(true)
  const [step, setStep] = useState<number>(1)
  const [description, setDescription] = useState<{ Title: string, description: string, btn: string }>({
    Title: "Forget passowrd ?",
    description: "Please enter your registered email below to reset your password",
    btn: "Next"
  })
  const [alert, SetAlert] = useState<{ Title: string, description: string, states: string, show: boolean }>({
    Title: "test",
    description: "test des",
    states: "default",
    show: false
  })
  const [newPassword, SetPassword] = useState<string>("")
  const [otp, SetOtp] = useState<string>("")
  const steps = [1, 2, 3];
  const [resetToken,SetResetToken]=useState<string>("")

  const router=useRouter()



  function otpChilid(value: string) {
    SetOtp(value)
    if(value.length===6){
    Setbtn(false)

    }else{
          Setbtn(true)

    }
    console.log(value)

  }


  //show alert

  function handleAlert(ErrorMassage: string,Title:string,states:string) {
    SetAlert(prev => ({ ...prev, show: true, description: ErrorMassage, Title: Title, states: states }))

    setTimeout(() => {
      SetAlert(prev => ({ ...prev, show: false }))
    }, 3000)

  }

  function check(value: string) {
    const resoult = verifyemail.safeParse(value)
    if (!resoult.success) {
      Setbtn(true)
      //show is wrong 
      //    console.log(resoult.error)

    } else {
      Setbtn(false)
      console.log("yes:", btn)
      console.log(resoult.success)
    }
  }


  //verify email
  function checkEmail() {
    axios.post(process.env.NEXT_PUBLIC_BACKEND + "/api/check-email", { email }).then((db) => {
    
      console.log(db.data.exists)
      if (db.data.exists) {
        Setbtn(true)
        setStep(2)
        sendOtp()
      }else{
          // show message if not exit in database 
        handleAlert("Invalid email or there is an error ","Error","error")
          

      }

    }).catch(((error) => {
      console.log(error)
    }))

  }

  // send otp to email after verify
  async function sendOtp() {
  const { error } = await authClient.emailOtp.sendVerificationOtp({
    email,
    type: "forget-password"
  })

  if (error) {
    handleAlert(error.message as string, "Error", "error")
    return
  }

  setDescription({
    Title: "OTP",
    description: "We sent a reset code to your email",
    btn: "Verify"
  })

  }

  //check the otp

  async function checkOTP() {
      if (otp.length !== 6) return

    
   setStep(3)
  setDescription({
    Title: "New password",
    description: "Enter your new password",
    btn: "Change password"
  })
  Setbtn(true)
  }

  //todo:verify new password and after that send user to dashboard
  async function NewPassword_check(value:string) {
    const res = await newPasswords.safeParse(value)
 console.log(newPassword)
    if (!res.success) {

      console.log("error")
      Setbtn(true)
      return
    }else{
      console.log("right")
     
       Setbtn(false)
    }
  }

 async function change_password(){
  Setbtn(true)

  const { error } = await authClient.emailOtp.resetPassword({
    email,
    otp,
    password: newPassword,
  })

  if (error) {
    handleAlert(error.message as string, "Error", "error")
    Setbtn(false)
    return
  }

  handleAlert("Password updated successfully!", "Success", "default")

  setTimeout(() => {
    router.push("/auth/login")
  }, 3000)

    


  }

  return (
    <div className='h-screen flex justify-center items-center flex-col'>
      {step === 1 &&
        <Image src={"/forget-password.png"} height={230} width={230} alt='logo' />
      }
      {step === 2 &&
        <Image src={"/otp-write.png"} height={230} width={230} alt='logo' />
      }
      {step === 3 &&
        <Image src={"/otp-password.png"} height={230} width={230} alt='logo' />
      }
      <Frame className='w-[80%] md:w-[35%] mb-40'>
        <FrameHeader>
          <Stepbar steps={steps} step={step} />


          <FrameTitle className='text-2xl '>{description.Title}</FrameTitle>
          <FrameDescription>{description.description}</FrameDescription>
        </FrameHeader>
        <FramePanel className='w-full h-full mb-0 space-y-3'>

          {step === 1 &&
            <Input aria-label="Enter email" placeholder="example@gamil.com " type="text" size={"lg"} value={email} onChange={(e) => {
              const val = e.target.value
              Setemail(val)
              check(val)

            }} />
          }

{/** new password */}
          {step === 3 &&
            <Input aria-label="Enter text" placeholder="password" type="text" size={"lg"} value={newPassword} onChange={(e) => {
              const val = e.target.value
              SetPassword(val)
              NewPassword_check(val)

            }} />
          }

          {step === 2 &&
            <InputOTPS resive={otpChilid} />

          }


          {step === 1 &&
            <Button className='w-full' disabled={btn} variant={btn ? "outline" : "default"} onClick={checkEmail}>{description.btn}</Button>

          }

          {step === 2 &&
            <Button className='w-full' disabled={btn} variant={btn ? "outline" : "default"} onClick={checkOTP}>{description.btn}</Button>

          }

          {step === 3 &&
            <Button className='w-full' disabled={btn} variant={btn ? "outline" : "default"} onClick={change_password}>{description.btn}</Button>

          }



          <Link href={"/auth/login"} className='w-full'>
            <Button className='w-full' variant={"ghost"}>Back to Login</Button>

          </Link>
        </FramePanel>
        {/* <FrameFooter className='w-full'>
    
  </FrameFooter>  */}
      </Frame>

      {/** show alert */}
      {alert.show === true &&
      <ShowAlert titles={alert.Title} description={alert.description} states={alert.states as string} />
      }

    </div>
  )
}



function ShowAlert({ titles, description, states }: { titles: string, description: string, states: string }) {
  return (
    <Alert className='w-[40%] md:w-[20%] absolute right-0 bottom-0 m-3' variant={states === "default" ? "default" : "error"}>
      <AlertTitle>{titles} </AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  )

}


function InputOTPS({ resive }: { resive: (val: string) => void }) {
  const [values, setValue] = useState<string>("")



  return (
    <div className='flex justify-center items-center'>
      <InputOTP className='space-x-2' maxLength={6} onChange={((e) => {
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



function Stepbar({ steps, step }: { steps: number[], step: number }) {
  return (
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


