import { createContext } from 'react';
import type { Song } from '../../types/Song';

export interface PlayerContextType {
  // Funciones de reproducción
  handlePlay: (song: Song) => Promise<void>;
  setQueue: (songs: Song[]) => Promise<void>;
  setShuffleQueue: (songs: Song[]) => Promise<void>;
  handlePause: () => Promise<void>;
  handleSeek: (time: number) => Promise<void>;
  playNext: () => Promise<void>;
  playPrev: () => Promise<void>;
  clearQueue: () => Promise<void>;

  // Estados de reproducción
  duration: number;
  paused: boolean;
  currentTime: number;
  songPlaying: Song | null;

  // Estados adicionales útiles
  songQueue: Song[] | null;
  isLoaded: boolean;
  isLoading: boolean;
  trackPlayerReady: boolean;

  // Información adicional
  currentIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);
