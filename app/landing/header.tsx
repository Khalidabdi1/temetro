import React from 'react'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Github } from 'lucide-react';


import Link from 'next/link'
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const Header = () => {
    return (
        <div className='flex justify-center items-center'>

            <header className='bg-[#101011] border-3 border-[#151517] flex justify-between p-2 m-3 rounded-4xl w-full md:w-[70%] items-center' >

                <nav className='' >
                    <NavigationMenu>
                        <NavigationMenuList>


                            <NavigationMenuItem>
                                <NavigationMenuLink asChild className='m-0 p-0 rounded-full '>

                                    <Image src={"/logo2.png"} width={65} height={65} alt='temetro' className='m-0  ' />

                                </NavigationMenuLink>
                            </NavigationMenuItem>





                        </NavigationMenuList>
                    </NavigationMenu>
                </nav>
                <div className='flex justify-center items-center space-x-4'>
                    <Link href={"https://github.com/Khalidabdi1/temetro"}><Github size={35} /></Link>
{/* 
                    <Link href={"/"}>
                                        <Button className='cursor-pointer'>Join Waitlist</Button>

                    </Link> */}
                </div>

            </header>



        </div>
    )
}

export default Header
