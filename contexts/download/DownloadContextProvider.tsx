import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useSongs } from '../song/';
import { DownloadContext } from './downloadContext';
import * as FileSystem from 'expo-file-system';
import type { YouTubeSearchItem } from 'types/YoutubeSearch';
import { Alert } from 'react-native';
import { API_BASE_URL } from '@env';

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export const DownloadProvider = ({ children }: { children: ReactNode }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingQueue, setDownloadingQueue] = useState<YouTubeSearchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadPhase, setDownloadPhase] = useState<'fetching' | 'downloading' | null>(null);

  const { songs, refreshSongs } = useSongs();

  const SONGS_DATA_JSON = FileSystem.documentDirectory + 'songs-data.json';
  const DOWNLOAD_QUEUE_JSON = FileSystem.documentDirectory + 'download-queue.json';
  const DOWNLOADING_ID_JSON = FileSystem.documentDirectory + 'downloading-id.json';

  const saveDownloadingId = async (id: string | null) => {
    try {
      if (id) {
        await FileSystem.writeAsStringAsync(
          DOWNLOADING_ID_JSON,
          JSON.stringify({ downloadingId: id })
        );
      } else {
        const fileInfo = await FileSystem.getInfoAsync(DOWNLOADING_ID_JSON);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(DOWNLOADING_ID_JSON);
        }
      }
    } catch (error) {
      console.error('Error saving downloadingId:', error);
    }
  };

  const loadDownloadingId = async (): Promise<string | null> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(DOWNLOADING_ID_JSON);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(DOWNLOADING_ID_JSON);
        const data = JSON.parse(content);
        return data.downloadingId || null;
      }
    } catch (error) {
      console.error('Error loading downloadingId:', error);
    }
    return null;
  };

  const saveDownloadQueue = async (queue: YouTubeSearchItem[]) => {
    try {
      if (queue.length > 0) {
        await FileSystem.writeAsStringAsync(DOWNLOAD_QUEUE_JSON, JSON.stringify(queue));
      } else {
        const fileInfo = await FileSystem.getInfoAsync(DOWNLOAD_QUEUE_JSON);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(DOWNLOAD_QUEUE_JSON);
        }
      }
    } catch (error) {
      console.error('Error saving download queue:', error);
    }
  };

  const loadDownloadQueue = async (): Promise<YouTubeSearchItem[]> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(DOWNLOAD_QUEUE_JSON);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(DOWNLOAD_QUEUE_JSON);
        return JSON.parse(content);
      }
    } catch (error) {
      console.error('Error loading download queue:', error);
    }
    return [];
  };

  useEffect(() => {
    const initializeData = async () => {
      const savedDownloadingId = await loadDownloadingId();
      const savedQueue = await loadDownloadQueue();

      setDownloadingId(savedDownloadingId);
      setDownloadingQueue(savedQueue);
    };

    initializeData();
  }, []);

  useEffect(() => {
    saveDownloadingId(downloadingId);
  }, [downloadingId]);

  useEffect(() => {
    saveDownloadQueue(downloadingQueue);
  }, [downloadingQueue]);

  const isDownloading = downloadingId !== null || downloadingQueue.length > 0;

  const addToDownloadQueue = (youtubeItem: YouTubeSearchItem) => {
    const videoId = youtubeItem.id.videoId;

    if (!videoId) return;

    if (songs.find((song) => song.id === videoId)) return;

    setDownloadingQueue((prev) => {
      const exists = prev.some((item) => item.id.videoId === youtubeItem.id.videoId);
      if (exists) {
        return prev;
      }
      return [...prev, youtubeItem];
    });
  };

  const removeFromQueue = (videoId?: string) => {
    if (!videoId) return;

    if (downloadingId === videoId) return;

    setDownloadingQueue((prev) => prev.filter((item) => item.id.videoId !== videoId));
  };

  const showAlert = (type: 'success' | 'error', title: string, message: string) => {
    Alert.alert(title, message);
  };

  const downloadSong = useCallback(
    async (youtubeItem: YouTubeSearchItem) => {
      const id = youtubeItem.id.videoId;
      if (!id) return;

      setDownloadingId(id);
      setDownloadProgress(0);
      setDownloadPhase('fetching');
      console.log(API_BASE_URL);
      try {
        const response = await fetch(
          `${API_BASE_URL}/get-audio-url?videoId=${encodeURIComponent(id)}`
        );
        const { audioUrl } = await response.json();

        if (!audioUrl) throw new Error('No se pudo obtener la URL de audio');

        setDownloadPhase('downloading');

        const fileName =
          youtubeItem.snippet.title.replace(/[\/\\?%*:|"<>]/g, '-').substring(0, 50) + '.mp3';
        const localUri = FileSystem.documentDirectory + fileName;

        const downloadResumable = FileSystem.createDownloadResumable(
          audioUrl,
          localUri,
          {},
          (downloadProgress) => {
            const progress =
              downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            const progressPercentage = Math.round(progress * 100);
            setDownloadProgress(progressPercentage);
          }
        );

        const result = await downloadResumable.downloadAsync();

        if (!result?.uri) throw new Error('No se pudo completar la descarga.');

        // Save to songs data
        let existingData: any[] = [];
        try {
          const fileInfo = await FileSystem.getInfoAsync(SONGS_DATA_JSON);
          if (fileInfo.exists) {
            const content = await FileSystem.readAsStringAsync(SONGS_DATA_JSON);
            existingData = JSON.parse(content);
          }
        } catch {
          existingData = [];
        }

        const exists = existingData.some((song) => song.id === id);

        if (!exists) {
          existingData.push({
            id: id,
            title: decodeHtmlEntities(youtubeItem.snippet.title),
            fileUri: result.uri,
            thumbnail: youtubeItem.snippet.thumbnails.high.url,
            channelTitle: youtubeItem.snippet.channelTitle,
          });

          await FileSystem.writeAsStringAsync(SONGS_DATA_JSON, JSON.stringify(existingData));
        }

        await refreshSongs();
        showAlert('success', 'Download finished', 'Song downloaded successfully');
      } catch (error) {
        showAlert('error', 'Download failed', 'Network error occurred');
        console.error('Error downloading song:', error);
      } finally {
        setDownloadingId(null);
        setDownloadProgress(0);
        setDownloadPhase(null);
      }
    },
    [refreshSongs]
  );

  useEffect(() => {
    const handleRecovery = async () => {
      if (downloadingId && downloadingQueue.length > 0) {
        const currentSong = downloadingQueue.find((song) => song.id.videoId === downloadingId);

        if (currentSong) {
          const isAlreadyDownloaded = songs.some((song) => song.id === downloadingId);

          if (isAlreadyDownloaded) {
            setDownloadingQueue((prev) => prev.filter((song) => song.id.videoId !== downloadingId));
            setDownloadingId(null);
            showAlert('success', 'Download completed', 'Song was downloaded successfully');
          }
        }
      }
    };

    if (songs.length >= 0) {
      handleRecovery();
    }
  }, [downloadingId, downloadingQueue, songs]);

  useEffect(() => {
    if (downloadingQueue.length === 0 || isProcessing) return;

    const processQueue = async () => {
      setIsProcessing(true);

      const currentSong = downloadingQueue[0];

      if (downloadingId && downloadingId !== currentSong.id.videoId) {
        setIsProcessing(false);
        return;
      }

      if (!downloadingId) {
        await downloadSong(currentSong);
        setDownloadingQueue((prev) =>
          prev.filter((song) => song.id.videoId !== currentSong.id.videoId)
        );
      }

      setIsProcessing(false);
    };

    processQueue();
  }, [downloadingQueue, isProcessing, downloadSong, downloadingId]);

  const value = {
    downloadingId,
    downloadSong,
    addToDownloadQueue,
    removeFromQueue,
    downloadingQueue,
    isDownloading,
    downloadProgress,
    downloadPhase,
  };

  return <DownloadContext.Provider value={value}>{children}</DownloadContext.Provider>;
};
