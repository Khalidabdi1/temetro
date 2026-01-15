// import { createAuthClient } from "better-auth/client";
import { emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient =createAuthClient({
    baseURL:process.env.NEXT_PUBLIC_BACKEND,
    fetchOptions:{
        credentials:"include"
    },

   session:{
  activeTab: true,
    crossTab:true
   },
   plugins:[
    emailOTPClient(),
   
   ]
})