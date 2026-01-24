"use client"
import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"


type OTPFormProps = React.ComponentProps<"div"> & {
  email: string
}

export function OTPForm({ email, className, ...props }: OTPFormProps) {
  const router =useRouter()
  const[otp,SetOtp]=useState<string>("")
  // const searchParams=useSearchParams()
  // const Email:string =searchParams.get("email") as string
  const Email=email

  async function check(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault()
 

  // const{data,error}=await authClient.emailOtp.verifyEmail({
  //   email:Email,
  //   otp:otp
  // })

  const {data, error}=await supabase.auth.verifyOtp({
    email:Email,
    token:otp,
    type:"signup"
  })

  if(error){
    console.log("wrong otp :",error)
    return
  }

  //if successful
console.log("sign up successfuly :",data)
  router.push("/dashboard")


  }


  return (
    
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form className="flex justify-center items-center " onSubmit={check}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Enter verification code</h1>
            <FieldDescription>
              We sent a 6-digit code to your email address
            </FieldDescription>
          </div>
          <Field className="">
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
            onChange={(value)=>{
              SetOtp(value)
              console.log(value)
            }}
              maxLength={8}
              id="otp"
              required
              containerClassName="gap-4 flex-wrap justify-center"
              value={otp}
            
              
            >
              <InputOTPGroup className="  gap-2
              *:data-[slot=input-otp-slot]:border

    *:data-[slot=input-otp-slot]:h-12
    *:data-[slot=input-otp-slot]:w-10
    *:data-[slot=input-otp-slot]:text-lg

    sm:gap-2.5
    sm:*:data-[slot=input-otp-slot]:h-14
    sm:*:data-[slot=input-otp-slot]:w-11
    sm:*:data-[slot=input-otp-slot]:text-xl

    md:*:data-[slot=input-otp-slot]:h-16
    md:*:data-[slot=input-otp-slot]:w-12">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="  gap-2
              *:data-[slot=input-otp-slot]:border

    *:data-[slot=input-otp-slot]:h-12
    *:data-[slot=input-otp-slot]:w-10
    *:data-[slot=input-otp-slot]:text-lg

    sm:gap-2.5
    sm:*:data-[slot=input-otp-slot]:h-14
    sm:*:data-[slot=input-otp-slot]:w-11
    sm:*:data-[slot=input-otp-slot]:text-xl

    md:*:data-[slot=input-otp-slot]:h-16
    md:*:data-[slot=input-otp-slot]:w-12">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>


                <InputOTPGroup className="  gap-2
              *:data-[slot=input-otp-slot]:border

    *:data-[slot=input-otp-slot]:h-12
    *:data-[slot=input-otp-slot]:w-10
    *:data-[slot=input-otp-slot]:text-lg

    sm:gap-2.5
    sm:*:data-[slot=input-otp-slot]:h-14
    sm:*:data-[slot=input-otp-slot]:w-11
    sm:*:data-[slot=input-otp-slot]:text-xl

    md:*:data-[slot=input-otp-slot]:h-16
    md:*:data-[slot=input-otp-slot]:w-12">
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
                
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code? <a href="#">Resend</a>
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit">Verify</Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
   
  )
}
