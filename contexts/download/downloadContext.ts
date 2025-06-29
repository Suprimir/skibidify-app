import { createContext } from 'react';
import { SongBase } from '../../types/Song';

export interface DownloadContextType {
  downloadingId: string | null;
  downloadSong: (youtubeItem: SongBase) => Promise<void>;
  addToDownloadQueue: (youtubeItem: SongBase) => void;
  removeFromQueue: (videoId?: string) => void;
  downloadingQueue: SongBase[];
  isDownloading: boolean;
  downloadProgress: number;
  downloadPhase: 'fetching' | 'downloading' | null;
}

export const DownloadContext = createContext<DownloadContextType | null>(null);
