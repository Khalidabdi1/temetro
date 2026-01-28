import React, { useState } from 'react'
import {
    Frame,
    FrameDescription,
    FrameFooter,
    FrameHeader,
    FramePanel,
    FrameTitle,
} from "@/components/ui/frame"
import { Button } from '@/components/ui/button'

import { BookIcon, RouteIcon ,Share,Pencil} from "lucide-react";

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { useEffect } from 'react';
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import ProjectDialog from '@/components/create-project';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function  Content()  {

    const [project, SetProject] = useState<boolean>(true)

    useEffect(() => {

        const res = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            //   console.log(userID.data.user?.id)

            axios.get(process.env.NEXT_PUBLIC_BACKEND + `/project?userID=${user?.id}`).then((db) => {
                console.log(db.data)

                // if there is project show cards if not show empty

                // if (db.data.message === "Projects not found") {
                //     SetProject(false)
                // } else {
                //     SetProject(true)
                // }




            })
        }

        res()

    }, [])

    return (
        <div className='mt-5 space-y-5 p-4'>

            <div className='flex space-x-7 h-fit'>
                {/** if there is project show this card */}

                {project === true &&
              <CardsGroups/>
              

                }


                {/** if there is not  project show this card */}


                {project === false &&
                    <Empty className='flex justify-center items-center '>
                        <EmptyHeader>
                            <EmptyMedia variant="icon" className='size-15'>
                                {/* <Icon /> */}
                                <RouteIcon />
                            </EmptyMedia>
                            <EmptyTitle className='text-2xl'>No projects</EmptyTitle>
                            <EmptyDescription className='text-lg'>No projects were found.</EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <ProjectDialog />
                        </EmptyContent>
                    </Empty>

                }





            </div>





        </div>
    )
}


function CardsGroups(){
    return(
        <>
   <div className='grid grid-cols-3 space-y-3 space-x-3 '>

<Cards/>
   </div>


        </>
    )
}

function Cards(){
    return(
<Frame className='w-[350px] bg-[#171719] border-none  overflow-hidden col-span-1 hover:cursor-pointer'>
    <FramePanel className='bg-[#101011] flex flex-col space-y-6 border-none'>
        
        {/* الجزء العلوي: الأيقونة والأفاتار */}
        <div className='flex justify-between items-start mb-0'>
            
            {/* حاوية الصورة: تحكم في الحجم من هنا دون التأثير على البقية */}
            <div className='w-24 h-20 relative '> 
                <Image 
                    src="/file.png" 
                    fill // يجعل الصورة تملأ الحاوية الخاصة بها فقط
                    alt='file icon' 
                    className='object-contain' // يحافظ على أبعاد الصورة دون تشويه
                />
            </div>

            {/* الأفاتارز: ستبقى في مكانها في أقصى اليمين */}
            <div className="flex -space-x-3 items-center">
                <span className="text-sm text-gray-500 mr-1">350+</span>
                <Avatar className="border-4 border-[#101011] w-10 h-10">
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="border-4 border-[#101011] w-10 h-10">
                    <AvatarImage src="/avatars/02.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>

                 <Avatar className="border-4 border-[#101011] w-10 h-10">
                    <AvatarImage src="/avatars/02.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>

               
            </div>
        </div>

        {/* النصوص: تأخذ المساحة المتبقية بسلاسة */}
        <div className='space-y-2'>
            <h2 className="text-white text-2xl font-bold tracking-tight">Privacy Policy</h2>
            <p className="text-gray-400 text-base leading-snug">
                Details on how we handle user data and privacy,Details on how we handle user data and privacy
            </p>
        </div>

    </FramePanel>

    {/* الأزرار في الأسفل كما في الصورة */}
    <FrameFooter className='flex '>
        <div className='flex  gap-4  justify-between w-full'>
            <Button className='' variant={"default"}>
                <Share size={20}/> Share
            </Button>
            <Button variant="ghost" className=''>
                <Pencil size={20}/> Edit
            </Button>
        </div>
    </FrameFooter>
</Frame>
    )
}

