import { create } from 'zustand';

export interface AudioAnalysis {
  tempo: number;
  beats: number[];
  onsets: number[];
  morphTriggers: { timestamp: number; shape: string }[];
  turbulenceMap: { timestamp: number; intensity: number }[];
}

interface AudioState {
  trackId: string | null;
  trackName: string;
  artistName: string;
  isPlaying: boolean;
  currentTime: number;
  analysis: AudioAnalysis | null;
  lyrics: { startTime: number; words: string }[];
  currentLyric: string;
  particleSize: number;
  gravity: number;
  audioElement: HTMLAudioElement | null;
  isAnalyzing: boolean;
  setTrack: (id: string, name: string, artist: string) => void;
  setPlaying: (v: boolean) => void;
  setCurrentTime: (t: number) => void;
  setAnalysis: (a: AudioAnalysis) => void;
  setLyrics: (l: { startTime: number; words: string }[]) => void;
  updateCurrentLyric: (t: number) => void;
  setParticleSize: (v: number) => void;
  setGravity: (v: number) => void;
  setAudioElement: (el: HTMLAudioElement | null) => void;
  setIsAnalyzing: (v: boolean) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  trackId: null,
  trackName: '',
  artistName: '',
  isPlaying: false,
  currentTime: 0,
  analysis: null,
  lyrics: [],
  currentLyric: '',
  particleSize: 1.0,
  gravity: 0.3,
  audioElement: null,
  isAnalyzing: false,

  setTrack: (id, name, artist) => set({ trackId: id, trackName: name, artistName: artist }),
  setPlaying: (v) => set({ isPlaying: v }),
  setCurrentTime: (t) => set({ currentTime: t }),
  setAnalysis: (a) => set({ analysis: a }),
  setLyrics: (l) => set({ lyrics: l }),
  updateCurrentLyric: (t) => {
    const { lyrics } = get();
    const line = [...lyrics].reverse().find((l) => l.startTime <= t);
    set({ currentLyric: line?.words ?? '' });
  },
  setParticleSize: (v) => set({ particleSize: v }),
  setGravity: (v) => set({ gravity: v }),
  setAudioElement: (el) => set({ audioElement: el }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
}));