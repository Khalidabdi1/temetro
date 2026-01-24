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

const Content = () => {
    return (
        <div className='mt-5 space-y-5 p-4'>

            <div className='flex space-x-7'>
                <Frame className='w-[25%] bg-[#171719] p-1'>
                    <FramePanel className='bg-[#101011] border-none h-full'>Analyzed</FramePanel> 
                    <FrameHeader>
                        <FrameTitle>Repositories</FrameTitle>
                        <FrameDescription>8
                        </FrameDescription>
                    </FrameHeader>
                    
                    {/* <FrameFooter><Button>Upgrade</Button></FrameFooter> */}
                </Frame>


              


            </div>





        </div>
    )
}

export default Content
