"use client"
import React, { useEffect, useState, useRef } from 'react'

export function LiveWaveform({ 
  isRecording, 
  onRecordingComplete 
}: { 
  isRecording: boolean, 
  onRecordingComplete: (blob: Blob) => void 
}) {
  const [volumes, setVolumes] = useState<number[]>(new Array(15).fill(2));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationRef = useRef<number>();


const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

    const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // --- جزء التحليل البصري (Waveform) ---
      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // --- جزء التسجيل الفعلي (Saving Data) ---
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = []; // تفريغ البيانات القديمة

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // هنا يتم تجميع القطع في ملف واحد عند التوقف
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob); // نرسل الملف للمكون الأب
        stream.getTracks().forEach(track => track.stop()); // إغلاق المايك
      };

      mediaRecorder.start();

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const newVolumes = Array.from(dataArray.slice(0, 15)).map(v => Math.max(2, (v / 255) * 40));
        setVolumes(newVolumes);
        animationRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

    } catch (err) {
      console.error("Error:", err);
    }
  };

  

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => stopRecording();
  }, [isRecording]);



  

  return (
    <div className="flex items-center justify-center gap-[3px] h-12 w-full  ">
      {volumes.map((height, i) => (
        <div key={i} className="w-full bg-blue-500 rounded-full transition-all duration-75" style={{ height: `${height}px` }} />
      ))}
    </div>
  );
}