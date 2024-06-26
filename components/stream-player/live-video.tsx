"use client";

import { useTracks } from "@livekit/components-react";
import { Participant, Track } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { FullScreenControl } from "./fullscreen-control";
import { useEventListener } from "usehooks-ts";
import { VolumeControl } from "./volume-control";

interface Props {
  participant: Participant;
}

export const LiveVideo = ({ participant }: Props) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const onVolumeChange = (value: number) => {
    setVolume(+value);
    if (videoRef?.current) {
      videoRef.current.muted = value === 0;
      videoRef.current.volume = +value * 0.01;
    }
  };

  const toggleMuted = () => {
    const isMuted = volume === 0;
    setVolume(isMuted ? 50 : 0);
    if (videoRef?.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.volume = isMuted ? 0.5 : 0;
    }
  };

  useEffect(() => {
    onVolumeChange(0);
  }, []);

  const toggleFullScreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else if (wrapperRef?.current) {
      wrapperRef?.current.requestFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    const isCurrentlyFullscreen = document.fullscreenElement !== null;
    setIsFullscreen(isCurrentlyFullscreen);
  };

  useEventListener("fullscreenchange", handleFullscreenChange, wrapperRef);

  useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef?.current);
      }
    });

  return (
    <div ref={wrapperRef} className="h-full relative flex">
      <video ref={videoRef} width="100%" src="" />
      <div className="absolute top-0 w-full h-full opacity-0 hover:opacity-100 transition-all">
        <div className="absolute bottom-0 flex w-full h-14 items-center justify-between bg-gradient-to- from-neutral-900 px-4">
          <VolumeControl
            value={volume}
            onChange={onVolumeChange}
            onToggle={toggleMuted}
          />
          <FullScreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullScreen}
          />
        </div>
      </div>
    </div>
  );
};
