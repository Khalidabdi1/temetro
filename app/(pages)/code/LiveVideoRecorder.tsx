"use client"
import React, { useEffect, useRef, useState } from 'react'

export function LiveVideoRecorder({ 
  isRecording, 
  onRecordingComplete 
}: { 
  isRecording: boolean, 
  onRecordingComplete: (blob: Blob) => void 
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);


   const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (err) {
      console.error("Camera Error:", err);
    }
  };

    const stopCamera = () => {
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
  };

  useEffect(() => {
    if (isRecording) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isRecording]);

 



  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 border-red-500">
      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover mirror" />
      <div className="absolute top-2 left-2 flex items-center gap-2">
        <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        <span className="text-white text-xs font-mono">REC</span>
      </div>
    </div>
  );
}