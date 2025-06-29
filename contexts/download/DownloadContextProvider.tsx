import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useSongs } from '../song/';
import { DownloadContext } from './downloadContext';
import RNFS from 'react-native-fs';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getKey } from '../../config/storageConfig';
import { Song, SongBase } from '../../types/Song';

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
  const [downloadingQueue, setDownloadingQueue] = useState<SongBase[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadPhase, setDownloadPhase] = useState<
    'fetching' | 'downloading' | null
  >(null);

  const { songs, refreshSongs } = useSongs();

  const SONGS_DATA_JSON = `${RNFS.DocumentDirectoryPath}/songs-data.json`;
  const DOWNLOAD_QUEUE_KEY = 'download_queue';
  const DOWNLOADING_ID_KEY = 'downloading_id';

  const saveDownloadingId = async (id: string | null) => {
    try {
      if (id) {
        await AsyncStorage.setItem(DOWNLOADING_ID_KEY, id);
      } else {
        await AsyncStorage.removeItem(DOWNLOADING_ID_KEY);
      }
    } catch (error) {
      console.error('Error saving downloadingId:', error);
    }
  };

  const loadDownloadingId = async (): Promise<string | null> => {
    try {
      const id = await AsyncStorage.getItem(DOWNLOADING_ID_KEY);
      return id;
    } catch (error) {
      console.error('Error loading downloadingId:', error);
      return null;
    }
  };

  const saveDownloadQueue = async (queue: SongBase[]) => {
    try {
      if (queue.length > 0) {
        await AsyncStorage.setItem(DOWNLOAD_QUEUE_KEY, JSON.stringify(queue));
      } else {
        await AsyncStorage.removeItem(DOWNLOAD_QUEUE_KEY);
      }
    } catch (error) {
      console.error('Error saving download queue:', error);
    }
  };

  const loadDownloadQueue = async (): Promise<SongBase[]> => {
    try {
      const queueData = await AsyncStorage.getItem(DOWNLOAD_QUEUE_KEY);
      if (queueData) {
        return JSON.parse(queueData);
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

  const addToDownloadQueue = (youtubeItem: SongBase) => {
    const videoId = youtubeItem.id;

    if (!videoId) return;

    if (songs.find(song => song.id === videoId)) return;

    setDownloadingQueue(prev => {
      const exists = prev.some(item => item.id === youtubeItem.id);
      if (exists) {
        return prev;
      }
      return [...prev, youtubeItem];
    });
  };

  const removeFromQueue = (videoId?: string) => {
    if (!videoId) return;

    if (downloadingId === videoId) return;

    setDownloadingQueue(prev => prev.filter(item => item.id !== videoId));
  };

  const showAlert = (
    type: 'success' | 'error',
    title: string,
    message: string,
  ) => {
    Alert.alert(title, message);
  };

  const downloadSong = useCallback(
    async (youtubeItem: SongBase) => {
      const id = youtubeItem.id;
      if (!id) return;

      const apiUrl = await getKey('API_BASE_URL');

      setDownloadingId(id);
      setDownloadProgress(0);
      setDownloadPhase('downloading');

      try {
        const fileName =
          youtubeItem.title.replace(/[\/\\?%*:|"<>]/g, '-').substring(0, 50) +
          '.mp3';
        const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        const downloadUrl = `${apiUrl}/download-audio?videoId=${encodeURIComponent(
          id,
        )}&title=${encodeURIComponent(youtubeItem.title)}`;

        const downloadOptions = {
          fromUrl: downloadUrl,
          toFile: localPath,
          headers: {
            Accept: 'audio/mpeg',
          },
          progress: (res: any) => {
            const progress = res.bytesWritten / res.contentLength;
            const progressPercentage = Math.round(progress * 100);
            setDownloadProgress(progressPercentage);
          },
        };

        const result = await RNFS.downloadFile(downloadOptions).promise;

        if (result.statusCode !== 200) {
          throw new Error('No se pudo completar la descarga.');
        }

        let existingData: Song[] = [];
        try {
          const fileExists = await RNFS.exists(SONGS_DATA_JSON);
          if (fileExists) {
            const content = await RNFS.readFile(SONGS_DATA_JSON, 'utf8');
            existingData = JSON.parse(content);
          }
        } catch {
          existingData = [];
        }

        const exists = existingData.some(song => song.id === id);

        if (!exists) {
          existingData.push({
            id: id,
            title: decodeHtmlEntities(youtubeItem.title),
            fileUri: `file://${localPath}`,
            thumbnail: youtubeItem.thumbnail,
            channelTitle: youtubeItem.channelTitle,
            addedAt: Date.now().toString(),
            favorite: false,
          });

          await RNFS.writeFile(
            SONGS_DATA_JSON,
            JSON.stringify(existingData),
            'utf8',
          );
        }

        await refreshSongs();
        showAlert(
          'success',
          'Descarga completada',
          'Canción descargada exitosamente',
        );
      } catch (error) {
        showAlert('error', 'Error de descarga', 'Ocurrió un error de red');
        console.error('Error downloading song:', error);
      } finally {
        setDownloadingId(null);
        setDownloadProgress(0);
        setDownloadPhase(null);
      }
    },
    [refreshSongs],
  );

  useEffect(() => {
    const handleRecovery = async () => {
      if (downloadingId && downloadingQueue.length > 0) {
        const currentSong = downloadingQueue.find(
          song => song.id === downloadingId,
        );

        if (currentSong) {
          const isAlreadyDownloaded = songs.some(
            song => song.id === downloadingId,
          );

          if (isAlreadyDownloaded) {
            setDownloadingQueue(prev =>
              prev.filter(song => song.id !== downloadingId),
            );
            setDownloadingId(null);
            showAlert(
              'success',
              'Download completed',
              'Song was downloaded successfully',
            );
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

      if (downloadingId && downloadingId !== currentSong.id) {
        setIsProcessing(false);
        return;
      }

      if (!downloadingId) {
        await downloadSong(currentSong);
        setDownloadingQueue(prev =>
          prev.filter(song => song.id !== currentSong.id),
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

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
};
