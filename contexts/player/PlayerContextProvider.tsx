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

  const player = useAudioPlayer();
  const isLoadingRef = useRef(false);

  useEffect(() => {
    async function loadStorage() {
      try {
        const [queueJSON, playingJSON, currentTimeStr] = await Promise.all([
          AsyncStorage.getItem('playerSongQueue'),
          AsyncStorage.getItem('playerSongPlaying'),
          AsyncStorage.getItem('playerCurrentTime'),
        ]);

        if (queueJSON) setSongQueue(JSON.parse(queueJSON));
        if (playingJSON) setSongPlaying(JSON.parse(playingJSON));
        if (currentTimeStr) setCurrentTime(parseFloat(currentTimeStr));
      } catch (e) {
        console.warn('Error loading player data:', e);
      }
    }
    loadStorage();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('playerSongQueue', JSON.stringify(songQueue ?? []));
  }, [songQueue]);

  useEffect(() => {
    if (songPlaying) {
      AsyncStorage.setItem('playerSongPlaying', JSON.stringify(songPlaying));
    } else {
      AsyncStorage.removeItem('playerSongPlaying');
    }
  }, [songPlaying]);

  useEffect(() => {
    AsyncStorage.setItem('playerCurrentTime', currentTime.toString());
  }, [currentTime]);

  const unloadPlayer = useCallback(async () => {
    if (player) {
      player.remove();
    }
  }, [player]);

  const stopPlayback = useCallback(async () => {
    if (player) {
      player.pause();
    }
    unloadPlayer();
    setSongPlaying(null);
    setCurrentTime(0);
    setDuration(0);
    setPaused(true);
  }, [player, unloadPlayer]);

  const handlePlay = useCallback(
    async (song: Song) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;

      try {
        unloadPlayer();

        player.replace(song.fileUri);

        setSongPlaying(song);

        player.play();
        setPaused(false);
      } catch (e) {
        console.error('Playback failed:', e);
        setPaused(true);
      } finally {
        isLoadingRef.current = false;
      }
    },
    [unloadPlayer, player]
  );

  const playNext = useCallback(() => {
    if (!songPlaying) return;

    if (!songQueue || songQueue.length === 0) {
      // No hay queue, detener completamente la reproducción
      stopPlayback();
      return;
    }

    const currentIndex = songQueue.findIndex((s) => s.id === songPlaying.id);
    const nextSong = songQueue[currentIndex + 1];

    if (nextSong) {
      handlePlay(nextSong);
    } else {
      // Se acabó la queue, detener completamente la reproducción
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

    if (player.playing) {
      player.pause();
      setPaused(true);
    } else {
      player.play();
      setPaused(false);
    }
  }, [player]);

  const handleSeek = useCallback(
    async (time: number) => {
      if (!player) return;
      player.seekTo(time);
      setCurrentTime(time);
    },
    [player]
  );

  useEffect(() => {
    if (!player) return;

    const statusListener = player.addListener('playbackStatusUpdate', (status) => {
      setPaused(!status.playing);
      setCurrentTime(status.currentTime);
      setDuration(status.duration || 0);

      if (status.didJustFinish) {
        playNext();
      }
    });

    return () => {
      statusListener?.remove();
    };
  }, [player, playNext]);

  const clearQueue = useCallback(async () => {
    unloadPlayer();
    setSongQueue(null);
    setSongPlaying(null);
    setCurrentTime(0);
    setDuration(0);
    setPaused(true);

    await AsyncStorage.multiRemove(['playerSongQueue', 'playerSongPlaying', 'playerCurrentTime']);
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
    [setQueue, clearQueue]
  );

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
