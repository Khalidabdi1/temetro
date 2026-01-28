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
    FieldError

} from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { Textarea } from "@/components/ui/textarea"
import { CreateProject } from '@/lib/zod';


export default function ProjectDialog() {

    const [info, SetInfo] = useState<{ Name: string, URL: string, Branch: string, Description: string }>({
        Name: "",
        URL: "",
        Branch: "main",
        Description: ""
    })
    // for dialog
    const [open, setOpen] = useState(false)

    const [errors, setErrors] = useState<Record<string, string>>({})

    async function HandleProject() {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
            console.error("user not found")
            return
        }

        const payload = {
            Name: info.Name,
            URL: info.URL, // Zod ينتظر Repo وليس URL
            Branch: info.Branch,
            Description: info.Description
        };

        const checkvalid = CreateProject.safeParse(payload)

        if (!checkvalid.success) {
            // تحويل مصفوفة أخطاء Zod إلى كائن سهل الاستخدام
            const newErrors: Record<string, string> = {};

            checkvalid.error.issues.forEach((issue) => {
                // path[0] هو اسم الحقل (مثلاً "Name" أو "Repo")
                const fieldName = issue.path[0] as string;
                newErrors[fieldName] = issue.message;
            });

            setErrors(newErrors);
            console.log("errors", newErrors)
            return; // توقف هنا ولا تكمل الإرسال
        }


        const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND + "/create-project", {
            Name: info.Name,
            URL: info.URL,
            Branch: info.Branch,
            UserID: user.id,
            Description: info.Description
        })

        console.log("data is :", res.data)

       SetInfo({ Name: "", URL: "", Branch: "main", Description: "" })
            setErrors({})
            setOpen(false)




    }



    return (

        <Dialog open={open} onOpenChange={setOpen}>
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
                        <Input placeholder="Enter your name" type="text" onChange={((e) => {
                            SetInfo(prev => ({ ...prev, Name: e.target.value }))
                        })} />

                        {/* <FieldError>error</FieldError> */}
                        {errors.Name ? <FieldError>{errors.Name}</FieldError> : <FieldDescription>Visible on your profile</FieldDescription>}
                    </Field>

                    <Field className={"mt-4"}>
                        <FieldLabel>Repositorie URL</FieldLabel>
                        <Input placeholder="Enter Repositorie Link" type="text" onChange={((e) => {
                            SetInfo(prev => ({ ...prev, URL: e.target.value }))
                        })} />

                        {errors.URL ? <FieldError>{errors.URL}</FieldError> : <FieldDescription>Write a project link on GitHub</FieldDescription>}

                    </Field>




                    <Field className={"mt-4"}>
                        <FieldLabel>Branch</FieldLabel>
                        <Input placeholder="" type="text" value={info.Branch} onChange={((e) => {
                            SetInfo(prev => ({ ...prev, Branch: e.target.value }))
                        })} />
                       
                        {errors.Branch ? <FieldError>{errors.Branch}</FieldError> : <FieldDescription>Choose a branch</FieldDescription>}
                    </Field>

                    <Field className={"mt-4"}>
                        <FieldLabel>Description</FieldLabel>
                        <Textarea maxLength={78} onChange={((e) => {
                            SetInfo(prev => ({ ...prev, Description: e.target.value }))

                        })} />
                     
                        {errors.Description ?<FieldError>{errors.Branch}</FieldError> :   <FieldDescription>You can only write 76 characters.</FieldDescription>}

                    </Field>

                </DialogPanel>
                <DialogFooter>
                    <DialogClose className={"flex justify-between items-center w-full"}>
                        <Button variant={"outline"} className="">Close</Button>
                    </DialogClose>

                  
                      <Button variant={"default"} className="" onClick={(() => {
                            console.log(info)
                            HandleProject()
                        })}>Create</Button>
                </DialogFooter>
            </DialogPopup>

        </Dialog>

    )
}


