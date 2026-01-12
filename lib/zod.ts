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


export const LoginSchema =z.object({
    Email:z.email("This email is invalid."),
    Password:z.string().min(8,"The password must be at least 8 characters long.")
})

//verify email when the user forgot email
export const verifyemail=z.email("Not a valid email")
export const newPasswords =z.string().min(8,"The password must be more than 8 characters long.")