import React from 'react'
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

const Content = () => {
    return (
        <div className='mt-5 space-y-5 p-4'>

            <div className='flex space-x-7 h-screen'>
                {/** if there is project show this card */}
                {/* <Frame className='w-[25%] bg-[#171719] p-1'>
                    <FramePanel className='bg-[#101011] border-none h-full'>Analyzed</FramePanel> 
                    <FrameHeader>
                        <FrameTitle>Repositories</FrameTitle>
                        <FrameDescription>8
                        </FrameDescription>
                    </FrameHeader>
                    
                    {/* <FrameFooter><Button>Upgrade</Button></FrameFooter> */}
                {/* </Frame> */} 

                                {/** if there is not  project show this card */}



<Empty className='flex justify-center items-center '>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      {/* <Icon /> */}
      <RouteIcon/>
    </EmptyMedia>
    <EmptyTitle>No data</EmptyTitle>
    <EmptyDescription>No data found</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Add data</Button>
  </EmptyContent>
</Empty>

              


            </div>





        </div>
    )
}

export default Content
