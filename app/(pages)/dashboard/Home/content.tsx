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

import { BookIcon, RouteIcon } from "lucide-react";

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

const Content = () => {

    const [project, SetProject] = useState<boolean>(false)

    useEffect(() => {

        const res = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            //   console.log(userID.data.user?.id)

            axios.get(process.env.NEXT_PUBLIC_BACKEND + `/project?userID=${user?.id}`).then((db) => {
                console.log(db.data)

                // if there is project show cards if not show empty

                if (db.data.message === "Projects not found") {
                    SetProject(false)
                } else {
                    SetProject(true)
                }




            })
        }

        res()

    }, [])

    return (
        <div className='mt-5 space-y-5 p-4'>

            <div className='flex space-x-7 h-screen'>
                {/** if there is project show this card */}

                {project === true &&

                    <Frame className='w-[25%] bg-[#171719] p-1'>
                        <FramePanel className='bg-[#101011] border-none h-full'>Analyzed</FramePanel>
                        <FrameHeader>
                            <FrameTitle>Repositories</FrameTitle>
                            <FrameDescription>8
                            </FrameDescription>
                        </FrameHeader>

                        <FrameFooter><Button>Upgrade</Button></FrameFooter>
                    </Frame>
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
                           <ProjectDialog/>
                        </EmptyContent>
                    </Empty>

                }





            </div>





        </div>
    )
}

export default Content
