import type { YouTubeSearchItem } from 'types/YoutubeSearch';
import { createContext } from 'react';

export interface DownloadContextType {
  downloadingId: string | null;
  downloadSong: (youtubeItem: YouTubeSearchItem) => Promise<void>;
  addToDownloadQueue: (youtubeItem: YouTubeSearchItem) => void;
  removeFromQueue: (videoId?: string) => void;
  downloadingQueue: YouTubeSearchItem[];
  isDownloading: boolean;
  downloadProgress: number;
  downloadPhase: 'fetching' | 'downloading' | null;
}

export const DownloadContext = createContext<DownloadContextType | null>(null);
