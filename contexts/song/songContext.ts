import { createContext } from 'react';
import type { Playlist, Song } from 'types/Song';

export interface SongContextType {
  songs: Song[];
  playlists: Playlist[];
  isLoading: boolean;
  refreshSongs: () => Promise<void>;
  refreshPlaylists: () => Promise<void>;
  createPlaylist: (customName?: string) => Promise<Playlist | null>;
  deletePlaylist: (playlistId: string) => Promise<boolean>;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => Promise<boolean>;
  addSongToPlaylist: (playlistId: string, song: Song) => Promise<boolean>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<boolean>;
}

export const SongContext = createContext<SongContextType | null>(null);
