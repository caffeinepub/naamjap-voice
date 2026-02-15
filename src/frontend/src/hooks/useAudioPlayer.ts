import { useState, useEffect, useRef, useCallback } from 'react';

const AUDIO_TRACKS = {
  'soft-flute': '/assets/audio/soft-flute.mp3',
  'temple-bells': '/assets/audio/temple-bells.mp3',
  'meditation-sound': '/assets/audio/meditation-sound.mp3',
};

export function useAudioPlayer(initialTrack: string, initialVolume: number) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(initialTrack);
  const [volume, setVolume] = useState(initialVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(AUDIO_TRACKS[currentTrack as keyof typeof AUDIO_TRACKS] || AUDIO_TRACKS['soft-flute']);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(err => {
      console.error('Audio play failed:', err);
    });
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const changeTrack = useCallback((track: string) => {
    const wasPlaying = isPlaying;
    pause();
    setCurrentTrack(track);
    if (wasPlaying) {
      setTimeout(() => play(), 100);
    }
  }, [isPlaying, pause, play]);

  return {
    isPlaying,
    currentTrack,
    volume,
    play,
    pause,
    toggle,
    changeTrack,
    setVolume,
  };
}
