import type { Song } from '../../types/Song';
import {
  useCallback,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer, {
  Event,
  State,
  useTrackPlayerEvents,
  useProgress,
  usePlaybackState,
} from 'react-native-track-player';
import { PlayerContext, type PlayerContextType } from './playerContext';

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [songQueue, setSongQueue] = useState<Song[] | null>(null);
  const [songPlaying, setSongPlaying] = useState<Song | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [trackPlayerReady, setTrackPlayerReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLoadingRef = useRef(false);
  const currentQueueIndexRef = useRef<number>(0);

  const playbackState = usePlaybackState();
  const progress = useProgress();

  const currentTime = progress.position;
  const duration = progress.duration;
  const paused = playbackState.state !== State.Playing;

  const setupTrackPlayer = useCallback(async () => {
    try {
      // Verificar si ya está inicializado
      const state = await TrackPlayer.getPlaybackState();
      if (state.state !== undefined) {
        console.log('TrackPlayer ya está inicializado');
        setTrackPlayerReady(true);
        return;
      }
    } catch (error) {
      // Si falla getPlaybackState, probablemente no está inicializado
      console.log('TrackPlayer no inicializado, procediendo...');
    }

    try {
      console.log('Inicializando TrackPlayer...');
      await TrackPlayer.setupPlayer({
        waitForBuffer: true,
      });

      setTrackPlayerReady(true);
      console.log('TrackPlayer inicializado exitosamente');
    } catch (error) {
      console.error('Error al inicializar TrackPlayer:', error);
      if (error?.message?.includes('already been initialized')) {
        console.log('TrackPlayer ya estaba inicializado');
        setTrackPlayerReady(true);
      } else {
        setTimeout(setupTrackPlayer, 2000);
      }
    }
  }, []);

  useEffect(() => {
    setupTrackPlayer();
  }, [setupTrackPlayer]);

  const addSongsToTrackPlayer = useCallback(
    async (songs: Song[], startIndex = 0) => {
      if (!trackPlayerReady || songs.length === 0) return;

      try {
        await TrackPlayer.reset();

        const tracks = songs.map(song => ({
          id: song.id,
          url: song.fileUri,
          title: song.title || 'Canción sin título',
          artist: song.channelTitle || 'Artista desconocido',
          album: '',
          artwork: song.thumbnail || undefined,
          duration: duration || 0,
        }));

        await TrackPlayer.add(tracks);

        if (startIndex > 0 && startIndex < songs.length) {
          await TrackPlayer.skip(startIndex);
        }

        currentQueueIndexRef.current = startIndex;
        setSongPlaying(songs[startIndex]);
      } catch (error) {
        console.warn('Error adding songs to TrackPlayer:', error);
      }
    },
    [trackPlayerReady],
  );

  // Función para reproducir siguiente canción
  const playNext = useCallback(async () => {
    if (!songQueue || songQueue.length === 0) return;

    try {
      const currentIndex = currentQueueIndexRef.current;
      const nextIndex = currentIndex + 1;

      if (nextIndex < songQueue.length) {
        currentQueueIndexRef.current = nextIndex;
        setSongPlaying(songQueue[nextIndex]);
        await TrackPlayer.skipToNext();
      } else {
        await TrackPlayer.stop();
        setSongPlaying(null);
      }
    } catch (error) {
      console.error('Error playing next:', error);
    }
  }, [songQueue]);

  // Función para reproducir canción anterior
  const playPrev = useCallback(async () => {
    if (!songQueue || songQueue.length === 0) return;

    try {
      const currentIndex = currentQueueIndexRef.current;

      if (currentTime > 3 || currentIndex <= 0) {
        await TrackPlayer.seekTo(0);
      } else {
        const prevIndex = currentIndex - 1;
        currentQueueIndexRef.current = prevIndex;
        setSongPlaying(songQueue[prevIndex]);
        await TrackPlayer.skipToPrevious();
      }
    } catch (error) {
      console.error('Error playing previous:', error);
    }
  }, [songQueue, currentTime]);

  // Función para pausar/reanudar
  const handlePause = useCallback(async () => {
    if (!trackPlayerReady) return;

    try {
      const state = await TrackPlayer.getPlaybackState();
      if (state.state === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    } catch (error) {
      console.error('Error toggling pause:', error);
    }
  }, [trackPlayerReady]);

  // Función para detener reproducción
  const stopPlayback = useCallback(async () => {
    try {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
      setSongPlaying(null);
      currentQueueIndexRef.current = 0;
      await AsyncStorage.multiRemove(['playerSongQueue', 'playerSongPlaying']);
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  }, []);

  // Función para buscar en la canción
  const handleSeek = useCallback(
    async (time: number) => {
      if (!trackPlayerReady) return;
      try {
        await TrackPlayer.seekTo(time);
      } catch (error) {
        console.error('Seek failed:', error);
      }
    },
    [trackPlayerReady],
  );

  // Escuchar eventos de TrackPlayer (ahora solo los eventos del componente)
  useTrackPlayerEvents(
    [Event.PlaybackQueueEnded, Event.PlaybackTrackChanged],
    async event => {
      switch (event.type) {
        case Event.PlaybackQueueEnded:
          stopPlayback();
          break;
        case Event.PlaybackTrackChanged:
          if (
            event.nextTrack !== undefined &&
            songQueue &&
            !isLoadingRef.current
          ) {
            const trackIndex = event.nextTrack;
            if (trackIndex >= 0 && trackIndex < songQueue.length) {
              if (currentQueueIndexRef.current !== trackIndex) {
                currentQueueIndexRef.current = trackIndex;
                setSongPlaying(songQueue[trackIndex]);
              }
            }
          }
          break;
      }
    },
  );

  // Cargar datos guardados al inicializar
  useEffect(() => {
    async function loadStorage() {
      try {
        const [queueJSON, playingJSON] = await Promise.all([
          AsyncStorage.getItem('playerSongQueue'),
          AsyncStorage.getItem('playerSongPlaying'),
        ]);

        if (queueJSON) {
          const queue = JSON.parse(queueJSON);
          setSongQueue(queue);

          if (playingJSON) {
            const playing = JSON.parse(playingJSON);
            const playingIndex = queue.findIndex(
              (song: Song) => song.id === playing.id,
            );

            if (playingIndex >= 0) {
              await addSongsToTrackPlayer(queue, playingIndex);
            }
          }
        }
      } catch (e) {
        console.warn('Error loading player data:', e);
      } finally {
        setIsLoaded(true);
      }
    }

    if (trackPlayerReady) {
      loadStorage();
    }
  }, [trackPlayerReady, addSongsToTrackPlayer]);

  // Función para reproducir una canción específica
  const handlePlay = useCallback(
    async (song: Song) => {
      if (isLoadingRef.current || !trackPlayerReady) return;

      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        setSongPlaying(song);

        // Si la canción ya está en la cola, solo saltar a ella
        if (songQueue) {
          const songIndex = songQueue.findIndex(s => s.id === song.id);
          if (songIndex >= 0) {
            currentQueueIndexRef.current = songIndex;
            await TrackPlayer.skip(songIndex);
            await TrackPlayer.play();
            return;
          }
        }

        // Crear nueva cola con esta canción
        setSongQueue([song]);
        currentQueueIndexRef.current = 0;
        await addSongsToTrackPlayer([song], 0);
        await TrackPlayer.play();
      } catch (e) {
        console.error('Playback failed:', e);
        setSongPlaying(null);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [trackPlayerReady, songQueue, addSongsToTrackPlayer],
  );

  // Función para limpiar cola
  const clearQueue = useCallback(async () => {
    try {
      await TrackPlayer.reset();
      setSongQueue(null);
      setSongPlaying(null);
      currentQueueIndexRef.current = 0;
      await AsyncStorage.multiRemove(['playerSongQueue', 'playerSongPlaying']);
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  }, []);

  // Función para establecer cola de reproducción
  const setQueue = useCallback(
    async (songs: Song[]) => {
      if (songs.length === 0) {
        clearQueue();
        return;
      }

      setSongQueue(songs);
      await addSongsToTrackPlayer(songs, 0);
      await TrackPlayer.play();
    },
    [addSongsToTrackPlayer, clearQueue],
  );

  // Función para establecer cola aleatoria
  const setShuffleQueue = useCallback(
    async (songs: Song[]) => {
      if (songs.length === 0) {
        clearQueue();
        return;
      }

      const shuffledSongs = [...songs].sort(() => Math.random() - 0.5);
      await setQueue(shuffledSongs);
    },
    [setQueue],
  );

  // Guardar datos en AsyncStorage
  useEffect(() => {
    if (isLoaded && songQueue) {
      AsyncStorage.setItem('playerSongQueue', JSON.stringify(songQueue));
    }
  }, [songQueue, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (songPlaying) {
        AsyncStorage.setItem('playerSongPlaying', JSON.stringify(songPlaying));
      } else {
        AsyncStorage.removeItem('playerSongPlaying');
      }
    }
  }, [songPlaying, isLoaded]);

  // Calcular estados derivados
  const currentIndex = songQueue ? currentQueueIndexRef.current : -1;
  const hasNext = songQueue ? currentIndex < songQueue.length - 1 : false;
  const hasPrevious = songQueue ? currentIndex > 0 : false;

  const value: PlayerContextType = {
    handlePlay,
    setQueue,
    setShuffleQueue,
    handlePause,
    handleSeek,
    playNext,
    playPrev,
    clearQueue,
    duration,
    paused,
    currentTime,
    songPlaying,
    songQueue,
    isLoaded,
    isLoading,
    trackPlayerReady,
    currentIndex,
    hasNext,
    hasPrevious,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}
