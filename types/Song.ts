export interface Song {
  id: string;
  title: string;
  channelTitle?: string;
  description?: string;
  thumbnail?: string;
  fileUri: string;
  addedAt: string;
  favorite: boolean;
}

export type SongBase = Omit<Song, 'fileUri' | 'addedAt' | 'favorite'>;

export interface Playlist {
  id: string;
  image: string;
  name: string;
  songs: string[];
}

export type SongCardContext = 'library' | 'playlist' | 'favorites';
