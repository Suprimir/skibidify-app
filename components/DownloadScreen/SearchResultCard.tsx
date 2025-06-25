import type { YouTubeSearchItem } from 'types/YoutubeSearch';
import { useDownload } from 'contexts/download';
import { useSongs } from 'contexts/song';
import { Pressable, View, Image, Text, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme';

interface SearchResultCardProps {
  youtubeItem: YouTubeSearchItem;
}

export default function SearchResultCard({ youtubeItem }: SearchResultCardProps) {
  const {
    addToDownloadQueue,
    downloadingId,
    downloadingQueue,
    removeFromQueue,
    downloadPhase,
    downloadProgress,
  } = useDownload();
  const { songs } = useSongs();
  const { colors } = useTheme();

  function decodeHtmlEntities(text: string): string {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

  const videoId = youtubeItem.id.videoId;

  const isDownloaded = songs.some((song) => song.id === videoId);

  const isCurrentlyDownloading = downloadingId === videoId;

  const isInQueue = downloadingQueue.some((item) => item.id.videoId === videoId);

  const queuePosition =
    isInQueue && !isCurrentlyDownloading
      ? downloadingQueue.findIndex((item) => item.id.videoId === videoId) + 1
      : null;

  const handleDownload = async () => {
    try {
      if (isInQueue && !isCurrentlyDownloading) {
        removeFromQueue(videoId);
      } else if (!isDownloaded && !isCurrentlyDownloading && !isInQueue) {
        addToDownloadQueue(youtubeItem);
      }
    } catch (error) {
      console.error('Error managing download queue:', error);
    }
  };

  const getButtonContent = () => {
    if (isDownloaded) {
      return {
        icon: 'check-circle',
        disabled: true,
      };
    }

    if (isCurrentlyDownloading) {
      return {
        icon: null,
        showSpinner: true,
      };
    }

    if (isInQueue) {
      return {
        icon: 'x',
        disabled: false,
      };
    }

    return {
      icon: 'download',
      disabled: false,
    };
  };

  const buttonContent = getButtonContent();

  return (
    <View
      className="w-full flex-row space-x-4 rounded-xl border p-3"
      style={{
        backgroundColor: colors.primary200,
        borderColor: colors.primary200,
        shadowColor: colors.primary600,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      }}>
      <View
        className="me-2 size-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border"
        style={{ borderColor: colors.primary200 }}>
        <Image
          source={{ uri: youtubeItem.snippet.thumbnails.high.url }}
          className="h-36 w-36 rounded-lg object-cover"
        />
      </View>

      <View className="flex-1 flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <Text
            className="flex-shrink truncate text-base font-bold"
            style={{ color: colors.primary800 }}
            numberOfLines={1}>
            {decodeHtmlEntities(youtubeItem.snippet.title)}
          </Text>
          <Text
            className="flex-shrink truncate text-sm"
            style={{ color: colors.primary600 }}
            numberOfLines={1}>
            {youtubeItem.snippet.channelTitle}
          </Text>

          {isCurrentlyDownloading && (
            <Text className="mt-1 text-xs" style={{ color: colors.primary500 }}>
              {!downloadPhase && 'Starting download...'}
              {downloadPhase === 'fetching'
                ? 'Getting download link...'
                : `Downloading... ${downloadProgress}%`}
            </Text>
          )}

          {queuePosition && (
            <Text className="mt-1 text-xs text-orange-500">In queue (#{queuePosition})</Text>
          )}

          {isDownloaded && <Text className="mt-1 text-xs text-green-500">Downloaded</Text>}
        </View>

        <Pressable
          onPress={handleDownload}
          disabled={buttonContent.disabled}
          className="items-center justify-center rounded-full border p-2"
          style={{
            borderColor: colors.primary200,
            backgroundColor: colors.primary500,
            opacity: buttonContent.disabled ? 0.7 : 1,
          }}>
          {buttonContent.showSpinner ? (
            <ActivityIndicator size={28} color={colors.primary200} />
          ) : (
            <Feather name={buttonContent.icon as any} size={28} color={colors.primary200} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
