"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  let [loading, SetLoading] = useState(false);


  function test(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log("com")
  }
  async function handleLogin() {
    SetLoading(true)
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/dashboard"
      })
    } catch (error) {
      console.error("error with auth is ",error)

    }

  }

  return (
    <div className={cn("flex flex-col  justify-center items-center gap-0  md:p-1 w-full h-screen p-4", className)} {...props}>
      <Image src={"/logo2.png"} width={65} height={65} alt='temetro' className='m-0 mt-15 md:mt-0  p-0' />

      <Card className="w-full md:w-[30%] lg:w-[30%] ">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={test}>
            <FieldGroup>
              <Field>
                <Button onClick={() => {
                  console.log("sign in")
                  handleLogin()
                }} variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>


              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field>

                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" required />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit">Create Account</Button>
                <FieldDescription className="text-center">
                  Already have an account?
                  <Link href={"/auth/login"}>
                    Sign in
                  </Link>

                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and
        <a href="#"> Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
