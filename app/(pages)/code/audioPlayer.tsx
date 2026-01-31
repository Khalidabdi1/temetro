"use client"
import {
  AudioPlayerButton,
  AudioPlayerDuration,
  AudioPlayerProgress,
  AudioPlayerProvider,
  AudioPlayerSpeed,
  AudioPlayerSpeedButtonGroup,
  AudioPlayerTime,
  useAudioPlayer,
  useAudioPlayerTime,
} from "@/components/ui/audio-player"

// const track = {
//   id: "track-1",
//   src: "/audio/song.mp3",
//   data: { title: "My Song", artist: "Artist Name" }
// }
interface TrackProps {
    id: string;
    src: string;
    data: {
        title: string;
        artist: string;
    }
}

export default function Audio({ id, src, data }: TrackProps){
    const item = { id, src, data }; // تجميع الخصائص في كائن واحد للمشغل
    return(
  <AudioPlayerProvider>
            <div className="flex items-center gap-2 w-full">
                <AudioPlayerButton item={item} />
                <div className="flex-1 flex items-center gap-2 text-[11px]">
                    <AudioPlayerProgress className="flex-1" />
                    <div className="flex gap-1 opacity-70">
                        <AudioPlayerTime />
                        <span>/</span>
                        <AudioPlayerDuration />
                    </div>
                </div>
            </div>
        </AudioPlayerProvider>
    )
}