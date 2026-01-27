"use client"
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogFooter,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { Textarea } from "@/components/ui/textarea"


export default function ProjectDialog (){

const [info,SetInfo]=useState<{Name:string,URL:string,Branch:string,Description:string}>({
    Name:"",
    URL:"",
    Branch:"main",
    Description:""
})

   
async function HandleProject(){
    const {data:{user},error}=await supabase.auth.getUser()
    if(error || !user){
        console.error("user not found")
        return
    }

    
const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND+"/create-project",{
    Name:info.Name,
    URL:info.URL,
    Branch:info.Branch,
    UserID:user.id,
    Description:info.Description
})

console.log("data is :",res.data)

SetInfo(prev=>({...prev,Name:"",URL:""}))
  

  

}

  return (
    
         <Dialog>
            <DialogTrigger>
              <Button>New project</Button>
            </DialogTrigger>

            <DialogPopup>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>Dialog Description</DialogDescription>


              </DialogHeader>
              <DialogPanel>

                <Field>
                  <FieldLabel>Project Name</FieldLabel>
                  <Input placeholder="Enter your name" type="text" onChange={((e)=>{
                    SetInfo(prev=>({...prev,Name:e.target.value}))
                  })} />
                  <FieldDescription>Visible on your profile</FieldDescription>
                </Field>

                 <Field className={"mt-4"}>
                  <FieldLabel>Repositorie URL</FieldLabel>
                  <Input placeholder="Enter Repositorie Link" type="text" onChange={((e)=>{
                    SetInfo(prev=>({...prev,URL:e.target.value}))
                  })}/>
                  <FieldDescription>Write a project link on GitHub</FieldDescription>
                </Field>




                 <Field className={"mt-4"}>
                  <FieldLabel>Branch</FieldLabel>
                  <Input placeholder="" type="text" value={info.Branch} onChange={((e)=>{
                    SetInfo(prev=>({...prev,Branch:e.target.value}))
                  })}/>
                  <FieldDescription>Choose a branch</FieldDescription>
                </Field>

                <Field className={"mt-4"}>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea onChange={((e)=>{
                        SetInfo(prev=>({...prev,Description:e.target.value}))
                    })}/>
                </Field>

              </DialogPanel>
              <DialogFooter>
                <DialogClose className={"flex justify-between items-center w-full"}>
                  <Button variant={"outline"} className="">Close</Button>
                </DialogClose>

                <DialogClose>
                  <Button variant={"default"} className="" onClick={(()=>{
                    console.log(info)
HandleProject()
                  })}>Create</Button>
                </DialogClose>
              </DialogFooter>
            </DialogPopup>

          </Dialog>
   
  )
}


