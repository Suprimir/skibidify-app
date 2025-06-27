import type { Song } from 'types/Song';
import { useCallback, useEffect, useState, useRef, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';
import { PlayerContext, type PlayerContextType } from './playerContext';

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [songQueue, setSongQueue] = useState<Song[] | null>(null);
  const [songPlaying, setSongPlaying] = useState<Song | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [paused, setPaused] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const player = useAudioPlayer();
  const isLoadingRef = useRef(false);
  const isSeekingRef = useRef(false);
  const lastSavedTimeRef = useRef<number>(0);

  useEffect(() => {
    async function loadStorage() {
      try {
        const [queueJSON, playingJSON, currentTimeStr] = await Promise.all([
          AsyncStorage.getItem('playerSongQueue'),
          AsyncStorage.getItem('playerSongPlaying'),
          AsyncStorage.getItem('playerCurrentTime'),
        ]);

        if (queueJSON) {
          const queue = JSON.parse(queueJSON);
          setSongQueue(queue);
        }

        if (playingJSON) {
          const playing = JSON.parse(playingJSON);
          setSongPlaying(playing);

          // Si hay una canción guardada, cargarla en el reproductor
          if (playing?.fileUri) {
            try {
              await player.replace(playing.fileUri);

              // Restaurar posición si existe
              if (currentTimeStr && parseFloat(currentTimeStr) > 0) {
                const savedTime = parseFloat(currentTimeStr);
                await player.seekTo(savedTime);
                setCurrentTime(savedTime);
                lastSavedTimeRef.current = savedTime;
              }

              // El reproductor se carga pausado por defecto
              setPaused(true);
            } catch (error) {
              console.error('Error loading saved song:', error);
              // Si hay error cargando, limpiar el estado
              setSongPlaying(null);
              setCurrentTime(0);
              AsyncStorage.removeItem('playerSongPlaying');
            }
          }
        }

        if (currentTimeStr && !playingJSON) {
          // Si hay tiempo guardado pero no canción, limpiar
          AsyncStorage.removeItem('playerCurrentTime');
        }
      } catch (e) {
        console.warn('Error loading player data:', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadStorage();
  }, []);

  // Guardar queue cuando cambie
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('playerSongQueue', JSON.stringify(songQueue ?? []));
    }
  }, [songQueue, isLoaded]);

  // Guardar canción actual cuando cambie
  useEffect(() => {
    if (isLoaded) {
      if (songPlaying) {
        AsyncStorage.setItem('playerSongPlaying', JSON.stringify(songPlaying));
      } else {
        AsyncStorage.removeItem('playerSongPlaying');
      }
    }
  }, [songPlaying, isLoaded]);

  // Guardar currentTime cada 2 segundos para evitar demasiadas escrituras
  useEffect(() => {
    if (!isLoaded || !songPlaying) return;

    const interval = setInterval(() => {
      if (Math.abs(currentTime - lastSavedTimeRef.current) > 2) {
        AsyncStorage.setItem('playerCurrentTime', currentTime.toString());
        lastSavedTimeRef.current = currentTime;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentTime, isLoaded, songPlaying]);

  const unloadPlayer = useCallback(async () => {
    if (player) {
      try {
        await player.remove();
      } catch (error) {
        console.warn('Error unloading player:', error);
      }
    }
  }, [player]);

  const stopPlayback = useCallback(async () => {
    try {
      if (player) {
        await player.pause();
      }
      await unloadPlayer();
      setSongPlaying(null);
      setCurrentTime(0);
      setDuration(0);
      setPaused(true);

      // Limpiar AsyncStorage
      await AsyncStorage.multiRemove(['playerSongPlaying', 'playerCurrentTime']);
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  }, [player, unloadPlayer]);

  const handlePlay = useCallback(
    async (song: Song) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      try {
        await unloadPlayer();
        await player.replace(song.fileUri);

        setSongPlaying(song);
        setCurrentTime(0);
        lastSavedTimeRef.current = 0;

        await player.play();
        setPaused(false);
      } catch (e) {
        console.error('Playback failed:', e);
        setPaused(true);
        setSongPlaying(null);
      } finally {
        isLoadingRef.current = false;
      }
    },
    [unloadPlayer, player]
  );

  const playNext = useCallback(() => {
    if (!songPlaying || !songQueue || songQueue.length === 0) {
      stopPlayback();
      return;
    }

    const currentIndex = songQueue.findIndex((s) => s.id === songPlaying.id);
    const nextSong = songQueue[currentIndex + 1];

    if (nextSong) {
      handlePlay(nextSong);
    } else {
      stopPlayback();
    }
  }, [songQueue, songPlaying, handlePlay, stopPlayback]);

  const playPrev = useCallback(() => {
    if (!songQueue || !songPlaying) return;

    const currentIndex = songQueue.findIndex((s) => s.id === songPlaying.id);

    if (currentTime > 30 || currentIndex <= 0) {
      if (player) {
        player.seekTo(0);
        setCurrentTime(0);
        lastSavedTimeRef.current = 0;
      }
    } else {
      const prevSong = songQueue[currentIndex - 1];
      if (prevSong) {
        handlePlay(prevSong);
      }
    }
  }, [songQueue, songPlaying, currentTime, handlePlay, player]);

  const handlePause = useCallback(async () => {
    if (!player) return;

    try {
      if (player.playing) {
        await player.pause();
        setPaused(true);
      } else {
        await player.play();
        setPaused(false);
      }
    } catch (error) {
      console.error('Error toggling pause:', error);
    }
  }, [player]);

  const handleSeek = useCallback(
    async (time: number) => {
      if (!player || isSeekingRef.current) return;

      isSeekingRef.current = true;

      try {
        await player.seekTo(time);
        setCurrentTime(time);
        lastSavedTimeRef.current = time;

        // Guardar inmediatamente cuando se hace seek manual
        if (songPlaying) {
          AsyncStorage.setItem('playerCurrentTime', time.toString());
        }
      } catch (error) {
        console.error('Seek failed:', error);
      } finally {
        isSeekingRef.current = false;
      }
    },
    [player, songPlaying]
  );

  // Listener para actualizar el estado del reproductor
  useEffect(() => {
    if (!player) return;

    const statusListener = player.addListener('playbackStatusUpdate', (status) => {
      setPaused(!status.playing);
      setDuration(status.duration || 0);

      // Solo actualizar currentTime si no estamos haciendo seek manual
      if (!isSeekingRef.current) {
        setCurrentTime(status.currentTime || 0);
      }

      if (status.didJustFinish) {
        playNext();
      }
    });

    return () => {
      statusListener?.remove();
    };
  }, [player, playNext]);

  const clearQueue = useCallback(async () => {
    try {
      await unloadPlayer();
      setSongQueue(null);
      setSongPlaying(null);
      setCurrentTime(0);
      setDuration(0);
      setPaused(true);
      lastSavedTimeRef.current = 0;

      await AsyncStorage.multiRemove(['playerSongQueue', 'playerSongPlaying', 'playerCurrentTime']);
    } catch (error) {
      console.error('Error clearing queue:', error);
    }
  }, [unloadPlayer]);

  const setQueue = useCallback(
    (songs: Song[]) => {
      if (songs.length === 0) {
        clearQueue();
        return;
      }
      setSongQueue(songs);
      handlePlay(songs[0]);
    },
    [handlePlay, clearQueue]
  );

  const setShuffleQueue = useCallback(
    (songs: Song[]) => {
      if (songs.length === 0) {
        clearQueue();
        return;
      }
      const shuffledSongs = [...songs];
      for (let i = shuffledSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
      }
      setQueue(shuffledSongs);
    },
    [setQueue]
  );

  // Guardar estado final cuando la app se cierre o se pause
  useEffect(() => {
    const saveCurrentState = () => {
      if (songPlaying && currentTime > 0) {
        AsyncStorage.setItem('playerCurrentTime', currentTime.toString());
      }
    };

    // Guardar estado cuando el componente se desmonte
    return () => {
      saveCurrentState();
    };
  }, [songPlaying, currentTime]);

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
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
