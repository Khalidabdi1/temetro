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
        <div className='mt-5 space-y-5'>

            <div className='flex space-x-7'>
                <Frame className='w-[25%] bg-[#171719]'>
                    <FrameHeader>
                        <FrameTitle>Repositories</FrameTitle>
                        <FrameDescription>8
                        </FrameDescription>
                    </FrameHeader>
                    <FramePanel className='bg-[#101011] border-none h-full'>Analyzed</FramePanel>
                    {/* <FrameFooter><Button>Upgrade</Button></FrameFooter> */}
                </Frame>

                <Frame className='w-[25%] bg-[#171719]'>
                    <FrameHeader>
                        <FrameTitle>Analyses</FrameTitle>
                        <FrameDescription>This month</FrameDescription>
                    </FrameHeader>
                    <FramePanel className='bg-[#101011] border-none'>12 / 20</FramePanel>
                    {/* <FrameFooter>8 analyses remaining</FrameFooter> */}
                </Frame>


                <Frame className='w-[25%] bg-[#171719]'>
                    <FrameHeader>
                        <FrameTitle>Plan</FrameTitle>
                        <FrameDescription>Subscription</FrameDescription>
                    </FrameHeader>
                    <FramePanel className='bg-[#101011] border-none h-full'>Free</FramePanel>
                    {/* <FrameFooter><Button>Upgrade</Button></FrameFooter> */}
                </Frame>

                <Frame className='w-[25%] bg-[#171719]'>
                    <FrameHeader>
                        <FrameTitle>Recent repositories</FrameTitle>
                        <FrameDescription>Subscription</FrameDescription>
                    </FrameHeader>
                    <FramePanel className='bg-[#101011] border-none h-full'>
                        <h1> my-api-server</h1>
                        <h1> ai-parser</h1>
                        <h1> auth-service</h1>
                       
                        
                       
                    </FramePanel>
                    {/* <FrameFooter><Button>View all →
                    </Button></FrameFooter> */}
                </Frame>

            </div>


            <div>
                 <Frame className=' bg-[#171719]'>
                    <FrameHeader>
                        <FrameTitle>Repositories</FrameTitle>
                        <FrameDescription>8
                        </FrameDescription>
                    </FrameHeader>
                    <FramePanel className='bg-[#101011] border-none h-full'>Analyzed</FramePanel>
                    {/* <FrameFooter><Button>Upgrade</Button></FrameFooter> */}
                </Frame>
            </div>



        </div>
    )
}

export default Content
