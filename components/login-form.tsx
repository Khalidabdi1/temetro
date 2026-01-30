"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"
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
  FieldSeparator,
  FieldError
} from "@/components/ui/field"



import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import { Separator } from "@/components/ui/separator"





import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { LoginSchema } from "@/lib/zod"
import { useEffect, useState } from "react"
import * as z from "zod"
import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabase"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const[loading,setLoading]=useState<boolean>(false)

  const[info,setInfo]=useState<{email:string,password:string}>({
    email:"",
    password:""
  })
const router = useRouter();
const isFormValid=info.email.trim()!=="" && info.password.trim()!==""
const origin = typeof window !== "undefined" ? window.location.origin : "";



  //zod issue
  type FieldErrors = Record<string, string[]>;

  function zodIssue(issues: z.core.$ZodIssueBase[]): FieldErrors {

    const errors: FieldErrors = {};

    for (const issue of issues) {
      const key = issue.path[0];
      if (typeof key !== "string") continue;

      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }

    return errors;

  }

  async function Valid(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("valid start")

    const formData = new FormData(event.currentTarget)

    const data = {
      Email: formData.get("Email"),
      Password: formData.get("Password")
    }

    const result = LoginSchema.safeParse(data)

    if (!result.success) {
      console.log(result.error.issues[0].message)
      setErrors({massage:[result.error.issues[0].message]})
      console.log(errors)
      const FaildError = zodIssue(result.error.issues)

      setErrors(FaildError)
      console.log(data)
      return
    }

    setErrors({})

try{
  setLoading(true)
  // const res =await authClient.signIn.email({
  //   email:result.data.Email,
  //   password:result.data.Password
  // })

  const {data,error} =await supabase.auth.signInWithPassword({
    email:result.data.Email,
    password:result.data.Password
  })

  if(error){
    setErrors({massage:["Incorrect password or email"]})
    setLoading(false)
    return
  }
console.log("login successful ",data)
console.log("valid data",result.data)
router.replace("/dashboard/Home")

setLoading(false)

}catch(error){
  console.error(error)
}


  }

 async function handleSignin(){
  setLoading(true)

  try{
await authClient.signIn.social({
  provider:"google",
   callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND}auth/callback`

})

const {data, error}=await supabase.auth.signInWithOAuth({
  provider:"google",
  options:{
    //dashboard/Home
    redirectTo:`${origin}/dashboard/Home`
  }
  
})

if(error){
  console.log("error supabase is :",error)
}
setLoading(false)
  }catch (error){
       router.push("/error")
      console.error("error with auth is ", error)
  }

  }


 


  return (


    <div className={cn("flex flex-col justify-center items-center gap-3 p-2", className)} {...props}>
      <Image src={"/logo2.png"} width={65} height={65} alt='temetro' className='m-0  ' />

      <Card className="w-full md:w-[30%]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={Valid}>
            <FieldGroup>
              <Field>
                {/* <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button> */}
                <Button variant="outline" type="button" onClick={handleSignin}>
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="Email"
                  placeholder="m@example.com"
                  required
                  size={"lg"}
                  value={info.email}
                  onChange={((e)=>{
                    const val =e.target.value
setInfo(prev=>({...prev,email:val}))

                  })}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link href={"/auth/Forgot"}   className="ml-auto text-sm underline-offset-4 hover:underline">
                   Forgot your password?
                  </Link>
               
                </div>
                <Input onChange={((e)=>{
                            const val =e.target.value
setInfo(prev=>({...prev,password:val}))

                })}
                id="password" type="password" name="Password" required size={"lg"} placeholder="passowrd" value={info.password} />
                {errors.Password && <FieldError>{errors.Password[0]}</FieldError>}
                {errors.massage && <FieldError>{errors.massage[0]}</FieldError>}
              </Field>
              <Field>
                <Button type="submit" disabled={!isFormValid}>Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?
                  <Link href={"/auth/signup"}>
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>

{/* for alert */}
{loading===true &&
   <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem] absolute right-0 bottom-0 m-3">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Processing ...</ItemTitle>
        </ItemContent>
        {/* <ItemContent className="flex-none justify-end">
          <span className="text-sm tabular-nums">$100.00</span>
        </ItemContent> */}
      </Item>
    </div>

}
       
    </div>
  )
}
