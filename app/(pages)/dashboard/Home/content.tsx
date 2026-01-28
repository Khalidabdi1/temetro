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
import { useRouter } from 'next/navigation';



interface ProjectType {
    id: string;
    name: string;
    description: string;
    owner_id: string;
    created_at: string;
    repo_url:string
    // أضف أي حقول أخرى تأتي من السيرفر هنا
}

interface CardsGroupsProps {
    list: ProjectType[];
}

export default function  Content()  {

    

    const [project, SetProject] = useState<boolean>(true)
    const [ProjectList,SetProjectList]=useState<any[]>([])

    
    useEffect(() => {

        const res = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            //   console.log(userID.data.user?.id)

            axios.get(process.env.NEXT_PUBLIC_BACKEND + `/project?userID=${user?.id}`).then((db) => {
                console.log("project is",db.data.data)
                

                // if there is project show cards if not show empty

                if (db.data.message === "Projects not found") {
                    SetProject(false)
                } else {
                    SetProject(true)
                }

                if (db.data.data) {
        SetProjectList(db.data.data); // تخزين المصفوفة
        SetProject(db.data.data.length > 0); // إذا كانت المصفوفة أكبر من 0 أظهر الكروت
    } else {
        SetProject(false);
    }




            })
        }

        res()

    }, [])

    return (
        <div className='mt-5 space-y-5 p-4'>

            <div className='flex space-x-7 h-fit'>
                {/** if there is project show this card */}

                {project === true &&
              <CardsGroups list={ProjectList}/>
              

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


function CardsGroups({list}:CardsGroupsProps){
    return(
        <>
   <div className='grid grid-cols-1 md:grid-cols-3 space-y-3 space-x-3 '>

{list.map((item) => (
                <Cards key={item.id} data={item} />
            ))}
   </div>


        </>
    )
}

function Cards({ data }: { data: ProjectType }){
    const router =useRouter()

function SandUser(){
    console.log("the repo link is :",data.repo_url)
  const encodedUrl = encodeURIComponent(data.repo_url);
    router.push(`/code?repo_url=${encodedUrl}`);

}

    return(
<Frame className='w-[350px] h-fit bg-[#171719] border-none  overflow-hidden col-span-1 hover:cursor-pointer' onClick={(()=>{
SandUser()
})}>
    <FramePanel className='bg-[#101011] flex flex-col space-y-6 border-none'>
        
        {/* الجزء العلوي: الأيقونة والأفاتار */}
        <div className='flex justify-between items-start mb-0'>
            
            {/* حاوية الصورة: تحكم في الحجم من هنا دون التأثير على البقية */}
            <div className='w-24 h-20 relative flex justify-start '> 
                <Image 
                    src="/file.png" 
                    fill // يجعل الصورة تملأ الحاوية الخاصة بها فقط
                    alt='file icon' 
                    className='object-contain ' // يحافظ على أبعاد الصورة دون تشويه
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
            <h2 className="text-white text-2xl font-bold tracking-tight">{data.name}</h2>
            <p className="text-gray-400 text-base leading-snug">
              {data.description}
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

