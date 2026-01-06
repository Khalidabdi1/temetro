import { createAuthClient } from "better-auth/client";

export const authClient =createAuthClient({
    baseURL:process.env.NEXT_PUBLIC_BACKEND,
    fetchOptions:{
        credentials:"include"
    },

   session:{
  activeTab: true,
    crossTab:true
   }
})