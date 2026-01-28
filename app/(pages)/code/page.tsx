"use client"
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardPanel,
    CardTitle,
} from "@/components/ui/card"

import { Button } from '@/components/ui/button';
import { House } from 'lucide-react';
import Component from '@/components/comp-575';
import TreeExample from '@/components/kibo-ui/tree/Tree';


// نستخدم مكون داخلي لأن useSearchParams يتطلب Suspense في Next.js
function CodeContent() {
    const searchParams = useSearchParams();

    // الحصول على الرابط من URL
    const repoUrl = searchParams.get('repo_url');

    return (
        <div className=" text-white grid grid-cols-4 space-x-1 h-screen">
            <div className=' col-span-1 '>
                <Card className='h-[97%] m-1 ml-2 w-fit'>
                    <CardHeader>
                        <CardTitle>Title</CardTitle>
                        <CardDescription>Description</CardDescription>
                    </CardHeader>
                    <CardPanel>
                        <Button className='w-full justify-start' variant={"ghost"}>
                            <House />
                            Home</Button>

                            <TreeExample/>
                    </CardPanel>
                    <CardFooter>Footer</CardFooter>
                </Card>
            </div>

            <div className=' col-span-2'>
                center
            </div>

            <div className=' col-span-1'>
                right
            </div>
        </div>
    );
}

// الصفحة الرئيسية
export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CodeContent />
        </Suspense>
    );
}