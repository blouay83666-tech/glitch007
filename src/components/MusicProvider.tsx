"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Background music track. Drop your file at public/music.mp3, or override the
// path with NEXT_PUBLIC_MUSIC_URL.
const MUSIC_URL = process.env.NEXT_PUBLIC_MUSIC_URL || "/music.mp3";

interface MusicCtx {
  playing: boolean;
  toggle: () => void;
}

const MusicContext = createContext<MusicCtx>({ playing: false, toggle: () => {} });

export const useMusic = () => useContext(MusicContext);

export default function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [entered, setEntered] = useState(false);

  const start = useCallback(() => {
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  }, []);

  const enter = () => {
    setEntered(true);
    start();
  };

  return (
    <MusicContext.Provider value={{ playing, toggle }}>
      {/* Autoplay is unlocked by the click on the enter overlay below. */}
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />

      {!entered && (
        <button
          onClick={enter}
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-black px-4 text-center transition-opacity duration-700"
          aria-label="Enter site"
        >
          <h1 className="serif-title mb-4 text-4xl tracking-[0.3em] text-white md:text-6xl">
            GLITCH 2026
          </h1>
          <p className="animate-pulse text-[10px] uppercase tracking-[0.5em] text-gold md:text-xs">
            Tap anywhere to enter
          </p>
        </button>
      )}

      {children}
    </MusicContext.Provider>
  );
}
