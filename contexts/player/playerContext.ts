import { createContext } from 'react';
import type { Song } from 'types/Song';

export interface PlayerContextType {
  handlePlay: (song: Song) => void;
  setQueue: (songs: Song[]) => void;
  setShuffleQueue: (songs: Song[]) => void;
  handlePause: () => void;
  handleSeek: (time: number) => void;
  playNext: () => void;
  playPrev: () => void;
  clearQueue: () => void;
  duration: number;
  paused: boolean;
  currentTime: number;
  songPlaying: Song | null;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);
