"use client"
import React, { useEffect, useState, useRef, useCallback } from 'react'

export function LiveWaveform({ 
  isRecording, 
  onRecordingComplete 
}: { 
  isRecording: boolean, 
  onRecordingComplete: (blob: Blob) => void 
}) {
  const [volumes, setVolumes] = useState<number[]>(new Array(15).fill(2));
  const [seconds, setSeconds] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    if (timerRef.current) clearInterval(timerRef.current);
    
    // حل المشكلة: تأجيل تحديث الحالة لتجنب الـ synchronous update error
    setTimeout(() => {
        setSeconds(0);
        setVolumes(new Array(15).fill(2));
    }, 0);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // تأجيل بدء الميقاتي
      setTimeout(() => setSeconds(0), 0);
      
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);

      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();

      const updateVolume = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        const newVolumes = Array.from(dataArray.slice(0, 15)).map(v => Math.max(2, (v / 255) * 40));
        setVolumes(newVolumes);
        animationRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

    } catch (err) {
      console.error("Microphone error:", err);
    }
  }, [onRecordingComplete]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => {
        // تنظيف عند حذف المكون
        if (mediaRecorderRef.current?.state !== "inactive") {
            mediaRecorderRef.current?.stop();
        }
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, startRecording, stopRecording]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full py-2 bg-background/5 rounded-lg">
      <div className="flex items-center justify-center gap-[3px] h-10 w-full px-4">
        {volumes.map((height, i) => (
          <div 
            key={i} 
            className="w-full bg-primary/80 rounded-full transition-all duration-75" 
            style={{ height: `${height}px` }} 
          />
        ))}
      </div>
      <span className="text-[10px] font-mono font-bold text-destructive animate-pulse uppercase tracking-widest">
        {isRecording ? `Recording ${formatTime(seconds)}` : "Ready"}
      </span>
    </div>
  );
}