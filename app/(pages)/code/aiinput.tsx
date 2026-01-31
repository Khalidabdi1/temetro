"use client"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group";
import React, { useEffect, useState, useRef } from 'react'

import { Button } from "@/components/ui/button";
import { ArrowUpIcon, PlusIcon, InfoIcon, Send, Circle, MessageCircle, AudioLines, CircleDot, Trash, EllipsisVertical, CheckIcon } from "lucide-react";
import { LiveWaveform } from "./sound";
import Audio from "./audioPlayer";
import { LiveVideoRecorder } from "./LiveVideoRecorder";
import { Label } from "@/components/ui/label";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge"

import {
    Frame,
    FrameDescription,
    FrameFooter,
    FrameHeader,
    FramePanel,
    FrameTitle,
} from "@/components/ui/frame"


import {
    Menu,
    MenuItem,
    MenuPopup,
    MenuTrigger,
} from "@/components/ui/menu";
import {

    MenuCheckboxItem,
    MenuGroup,
    MenuGroupLabel,


    MenuRadioGroup,
    MenuRadioItem,
    MenuSeparator,
    MenuSub,
    MenuSubPopup,
    MenuSubTrigger,

} from "@/components/ui/menu"
import {

    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Popover,
    PopoverClose,
    PopoverDescription,
    PopoverPopup,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"


export default function AiInput() {
    // for select
    const [recordingType, setRecordingType] = React.useState<string>("voice");
    const [isRecording, setIsRecording] = React.useState(false);
    const [audioFile, setAudioFile] = React.useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = React.useState<string | null>(null); // حالة جديدة للرابط
    const [fileBlob, setFileBlob] = React.useState<Blob | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    // const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    const[status,setStatus]=useState<{open:boolean,Important:boolean,Done:boolean}>({
        open:false,
        Important:false,
        Done:false
    })

    const handleRecordingComplete = (blob: Blob) => {
        setFileBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setIsRecording(false); // إيقاف حالة التسجيل برمجياً
    };

    const handleSend = async () => {
        if (!fileBlob) return;

        const formData = new FormData();
        const extension = recordingType === "voice" ? "webm" : "mp4";
        formData.append("file", fileBlob, `recording.${extension}`);
        formData.append("type", recordingType);

        // ... كود الإرسال للسيرفر كما هو

        // try {
        //     const response = await fetch("/api/upload", { method: "POST", body: formData });
        //     if (response.ok) {
        //         alert("تم الإرسال!");
        //         clearRecording();
        //     }
        // } catch (error) {
        //     console.error("خطأ في الإرسال:", error);
        // }
    };

    // 4. دالة حذف التسجيل للبدء من جديد
    const clearRecording = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl); // تنظيف الذاكرة
        setFileBlob(null);
        setPreviewUrl(null);
    };


    return (
        <InputGroup className="flex flex-col m-0 p-1 w-full">
            <div className="flex justify-between w-full">
                <div className="flex justify-start  w-full items-center space-x-1">
                    {status.open===true&&   <Badge variant="info">Open</Badge>}
                    {status.Important===true &&    <Badge variant="warning">Important</Badge>}
                    {status.Done===true &&   <Badge variant="success">
                        <CheckIcon aria-hidden="true" />

                        Done
                    </Badge>}
                  
                 
                  
                </div>


                <div className="w-full flex justify-end items-center ">
                    <Menu>
                        <MenuTrigger openOnHover render={<Button variant="ghost" />}>
                            <EllipsisVertical />
                        </MenuTrigger>
                        <MenuPopup>
                            <MenuItem className={"hover:bg-red-300"} onClick={clearRecording}>

                                Delete

                            </MenuItem>
                            {/* <MenuItem>Item two</MenuItem> */}
                            <MenuSub>
                                <MenuSubTrigger>status</MenuSubTrigger>
                                <MenuSubPopup>
                                    <MenuRadioGroup defaultValue="system">
                                        {/* <MenuRadioItem value="Done">Done</MenuRadioItem>
                                            <MenuRadioItem value="Important">Important</MenuRadioItem> */}

                                        <MenuCheckboxItem onCheckedChange={((e)=>{
                                            console.log(e)
                                            
                                                setStatus(prev=>({...prev,open:e}))
                                            
                                        })}>open</MenuCheckboxItem>
                                        <MenuCheckboxItem onCheckedChange={((e)=>{
                                            console.log(e)
                                            
                                                setStatus(prev=>({...prev,Important:e}))
                                            
                                        })}>Important</MenuCheckboxItem>
                                        <MenuCheckboxItem onCheckedChange={((e)=>{
                                            console.log(e)
                                            
                                                setStatus(prev=>({...prev,Done:e}))
                                            
                                        })}>Done</MenuCheckboxItem>
                                    </MenuRadioGroup>
                                </MenuSubPopup>
                            </MenuSub>
                        </MenuPopup>
                    </Menu>

                </div>
            </div>



            {isRecording && (
                <div className="p-2 bg-muted/20 w-full">
                    {recordingType === "voice" ? (
                        <LiveWaveform isRecording={isRecording} onRecordingComplete={handleRecordingComplete} />
                    ) : (
                        <LiveVideoRecorder isRecording={isRecording} onRecordingComplete={handleRecordingComplete} />
                    )}
                </div>
            )}
            {/* 2. مشغل الصوت بعد انتهاء التسجيل وقبل الإرسال */}
            {previewUrl && !isRecording && (

                <Frame className="p-2 border rounded-lg mb-2 bg-accent/10  w-full h-fit">




                    {recordingType === "voice" ? (

                        <Audio id="voice-note" src={previewUrl} data={{ title: "Voice Note", artist: "You" }} />


                    ) : (
                        <video src={previewUrl} controls className="w-full rounded-md aspect-video shadow-sm " />
                    )}

                </Frame>
            )}

            <InputGroupInput id="email-1" placeholder="Add your comment..." type="email" className={"mt-0  "} />
            <div className="flex justify-between  w-full p-1">
                <div className="flex justify-center items-center">

                    <Button
                        variant="destructive"
                        className={`rounded-full transition-transform ${isRecording ? "scale-110 animate-pulse" : ""}`}
                        onClick={() => setIsRecording(!isRecording)}
                    >
                        {isRecording ? <Circle className="fill-white size-3" /> :
                            recordingType === "voice" ? <AudioLines /> : <CircleDot />}
                    </Button>

                    <Popover>
                        <PopoverTrigger>

                            <Button variant="ghost" size="icon"><ArrowUpIcon className="size-5" /></Button>
                        </PopoverTrigger>
                        <PopoverPopup className={"mb-5"}>
                            <PopoverTitle>Select mode</PopoverTitle>
                            <PopoverDescription className={"mb-3"}>Choose what you want to send</PopoverDescription>

                            <Selects value={recordingType} onValueChange={(v) => {
                                setRecordingType(v);
                                clearRecording(); // مسح أي تسجيل قديم عند تغيير النوع
                            }} />

                            <PopoverClose className={"mt-3 w-full"}>
                                <Button className="w-full">Close</Button>
                            </PopoverClose>
                        </PopoverPopup>
                    </Popover>

                </div>


                <div>
                    <Button className="rounded-full" onClick={handleSend} disabled={!fileBlob || isRecording}><Send /></Button>

                </div>
            </div>
        </InputGroup>
    )
}



interface SelectsProps {
    value: string;
    onValueChange: (val: string) => void;
}

function Selects({ value, onValueChange }: SelectsProps) {


    return (
        <RadioGroup
            value={value}
            onValueChange={onValueChange}
            className="grid gap-2"
        >
            <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <Radio value="voice" />
                <div className="flex flex-col gap-1">
                    <p>voice</p>
                    <p className="text-muted-foreground text-xs">
                        Send a voice message with your feedback
                    </p>
                </div>
            </Label>
            <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <Radio value="video clip" />
                <div className="flex flex-col gap-1">
                    <p>video clip</p>
                    <p className="text-muted-foreground text-xs">
                        You can send a video with a note
                    </p>
                </div>
            </Label>

            {/* <Label className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50">
                <Radio value="text" />
                <div className="flex flex-col gap-1">
                    <p>text</p>
                    <p className="text-muted-foreground text-xs">
                        Receive notifications via text message.
                    </p>
                </div>
            </Label> */}
        </RadioGroup>

    )

}
