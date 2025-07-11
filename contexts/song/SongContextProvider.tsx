import type { Playlist, Song } from '../../types/Song';
import { useEffect, useState } from 'react';
import { SongContext } from './songContext';
import RNFS from 'react-native-fs';

export const SongProvider = ({ children }: { children: React.ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const SONGS_DATA_JSON = `${RNFS.DocumentDirectoryPath}/songs-data.json`;
  const PLAYLISTS_DATA_JSON = `${RNFS.DocumentDirectoryPath}/playlists-data.json`;

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  };

  const getAllSongs = async (): Promise<Song[]> => {
    try {
      let existingData: Song[] = [];
      const fileExists = await RNFS.exists(SONGS_DATA_JSON);

      if (fileExists) {
        const content = await RNFS.readFile(SONGS_DATA_JSON, 'utf8');
        existingData = JSON.parse(content) as Song[];
      }
      return existingData;
    } catch (error) {
      console.error('Error al obtener canciones:', error);
      return [];
    }
  };

  const getAllPlaylists = async (): Promise<Playlist[]> => {
    try {
      let existingData: Playlist[] = [];
      const fileExists = await RNFS.exists(PLAYLISTS_DATA_JSON);

      if (fileExists) {
        const content = await RNFS.readFile(PLAYLISTS_DATA_JSON, 'utf8');
        existingData = JSON.parse(content) as Playlist[];
      }
      return existingData;
    } catch (error) {
      console.error('Error al obtener playlists:', error);
      return [];
    }
  };

  const refreshSongs = async () => {
    try {
      const songs = await getAllSongs();
      setSongs(songs);
    } catch (error) {
      console.error('Error al refrescar canciones:', error);
    }
  };

  const refreshPlaylists = async () => {
    try {
      const playlists = await getAllPlaylists();
      setPlaylists(playlists);
    } catch (error) {
      console.error('Error al refrescar playlists:', error);
    }
  };

  const deleteSong = async (songId: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const currentSongs = await getAllSongs();
      const currentPlaylists = await getAllPlaylists();

      const songToDelete = currentSongs.find(song => song.id === songId);

      if (!songToDelete) {
        console.error('Canción no encontrada');
        return false;
      }

      try {
        // Limpiar la URI del archivo si tiene el prefijo file://
        const cleanUri = songToDelete.fileUri.replace('file://', '');
        const fileExists = await RNFS.exists(cleanUri);

        if (fileExists) {
          await RNFS.unlink(cleanUri);
          console.log('Archivo de audio eliminado:', cleanUri);
        }
      } catch (error) {
        console.error('Error al eliminar archivo de audio:', error);
      }

      const updatedSongs = currentSongs.filter(song => song.id !== songId);

      await RNFS.writeFile(
        SONGS_DATA_JSON,
        JSON.stringify(updatedSongs, null, 2),
        'utf8',
      );

      const updatedPlaylists = currentPlaylists.map(playlist => ({
        ...playlist,
        songs: playlist.songs.filter(id => id !== songId),
      }));

      await RNFS.writeFile(
        PLAYLISTS_DATA_JSON,
        JSON.stringify(updatedPlaylists, null, 2),
        'utf8',
      );

      refreshSongs();
      refreshPlaylists();

      console.log('Canción eliminada exitosamente:', songToDelete.title);
      return true;
    } catch (error) {
      console.error('Error al eliminar canción:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createPlaylist = async (): Promise<Playlist | null> => {
    try {
      setIsLoading(true);
      const currentPlaylists = await getAllPlaylists();

      const newPlaylist: Playlist = {
        id: generateUUID(),
        image: '',
        name: `Playlist #${currentPlaylists.length + 1}`,
        songs: [],
      };

      const updatedPlaylists = [...currentPlaylists, newPlaylist];

      await RNFS.writeFile(
        PLAYLISTS_DATA_JSON,
        JSON.stringify(updatedPlaylists, null, 2),
        'utf8',
      );

      await refreshPlaylists();

      return newPlaylist;
    } catch (error) {
      console.error('Error al crear playlist:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePlaylist = async (playlistId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const currentPlaylists = await getAllPlaylists();
      const filteredPlaylists = currentPlaylists.filter(
        p => p.id !== playlistId,
      );

      await RNFS.writeFile(
        PLAYLISTS_DATA_JSON,
        JSON.stringify(filteredPlaylists, null, 2),
        'utf8',
      );

      await refreshPlaylists();
      return true;
    } catch (error) {
      console.error('Error al eliminar playlist:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlaylist = async (
    playlistId: string,
    updates: Partial<Playlist>,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const currentPlaylists = await getAllPlaylists();
      const updatedPlaylists = currentPlaylists.map(playlist =>
        playlist.id === playlistId ? { ...playlist, ...updates } : playlist,
      );

      await RNFS.writeFile(
        PLAYLISTS_DATA_JSON,
        JSON.stringify(updatedPlaylists, null, 2),
        'utf8',
      );

      await refreshPlaylists();
      return true;
    } catch (error) {
      console.error('Error al actualizar playlist:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const addSongToPlaylist = async (
    playlistId: string,
    song: Song,
  ): Promise<boolean> => {
    try {
      const currentPlaylists = await getAllPlaylists();
      const targetPlaylist = currentPlaylists.find(p => p.id === playlistId);

      if (!targetPlaylist) {
        console.error('Playlist no encontrada');
        return false;
      }

      if (targetPlaylist.songs.some(s => s === song.id)) {
        console.log('La canción ya existe en la playlist');
        return false;
      }

      const updatedSongs = [...targetPlaylist.songs, song.id];
      return await updatePlaylist(playlistId, { songs: updatedSongs });
    } catch (error) {
      console.error('Error al agregar canción a playlist:', error);
      return false;
    }
  };

  const removeSongFromPlaylist = async (
    playlistId: string,
    songId: string,
  ): Promise<boolean> => {
    try {
      const currentPlaylists = await getAllPlaylists();
      const targetPlaylist = currentPlaylists.find(p => p.id === playlistId);

      if (!targetPlaylist) {
        console.error('Playlist no encontrada');
        return false;
      }

      const updatedSongs = targetPlaylist.songs.filter(s => s !== songId);
      return await updatePlaylist(playlistId, { songs: updatedSongs });
    } catch (error) {
      console.error('Error al remover canción de playlist:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([refreshSongs(), refreshPlaylists()]);
    };

    initializeData();
  }, []);

  const value = {
    songs,
    playlists,
    isLoading,
    refreshSongs,
    refreshPlaylists,
    deleteSong,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
  };

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
};
