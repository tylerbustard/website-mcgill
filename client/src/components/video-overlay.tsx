import { useState, useRef, useEffect } from "react";
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc?: string;
}

export default function VideoOverlay({ isOpen, onClose, videoSrc }: VideoOverlayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm"
          data-testid="button-close-video"
        >
          <X size={24} />
        </Button>

        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          {videoSrc ? (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover"
                poster="/api/video-thumbnail" // Optional: Add thumbnail endpoint
                data-testid="video-player"
                onError={() => {
                  console.error('Video failed to load');
                  setIsPlaying(false);
                }}
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div 
                    className="w-full bg-white/20 rounded-full h-1 cursor-pointer"
                    onClick={handleProgressClick}
                    data-testid="video-progress"
                  >
                    <div 
                      className="bg-primary h-1 rounded-full transition-all duration-100"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={togglePlay}
                        variant="ghost"
                        size="icon"
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                        data-testid="button-play-pause"
                      >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                      </Button>
                      
                      <Button
                        onClick={toggleMute}
                        variant="ghost"
                        size="icon"
                        className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm"
                        data-testid="button-mute"
                      >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </Button>
                      
                      <span className="text-white text-sm font-medium">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // No video available state
            <div className="flex items-center justify-center h-full text-white">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <Play size={40} className="ml-1" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Introduction Video</h3>
                  <p className="text-white/70 max-w-md">
                    Tyler's personal introduction video will be available soon. Check back later!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}