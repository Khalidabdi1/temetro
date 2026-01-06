import *  as z from "zod"

export const SignupSchema=z.object({
   Name:z.string().min(3),
   Email:z.email("This email is invalid."),

   Password:z.string().min(8),
   confirmPassword:z.string().min(8,"The password must be at least 8 characters long."),


}).refine((data)=> data.Password === data.confirmPassword,{
    message:"Passwords do not match",
    path:["confirmPasswords"]
})