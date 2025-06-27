import { useDownload } from 'contexts/download';
import { useSongs } from 'contexts/song';
import { Pressable, View, Image, Text } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme';
import { SongBase } from 'types/Song';

interface SearchResultLargeCardProps {
  youtubeItem: SongBase;
}

export default function SearchResultLargeCard({ youtubeItem }: SearchResultLargeCardProps) {
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

  const videoId = youtubeItem.id;

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
    <View className="items-center p-8">
      <View>
        <View
          className="h-56 w-56 items-center justify-center overflow-hidden rounded-xl"
          style={{
            backgroundColor: colors.primary100,
          }}>
          <Image
            source={{ uri: youtubeItem.thumbnail }}
            style={{ width: '135%', height: '135%' }}
            resizeMode="cover"
          />
        </View>
      </View>

      <View className="p-4">
        <Text
          numberOfLines={2}
          className="mb-2 text-center text-base font-bold"
          style={{ color: colors.primary800 }}>
          {youtubeItem.title}
        </Text>
        <Text
          numberOfLines={1}
          className="text-center text-sm"
          style={{ color: colors.primary600 }}>
          {youtubeItem.channelTitle}
        </Text>
      </View>

      <View className="m-4 gap-3">
        <Pressable
          disabled={buttonContent.disabled}
          onPress={handleDownload}
          className="flex-row items-center justify-center rounded-xl p-4"
          style={{
            backgroundColor: colors.primary600,
            opacity: buttonContent.disabled ? 0.7 : 1,
          }}>
          <Feather
            name={buttonContent.icon as any}
            size={20}
            color={colors.primary100}
            style={{ marginRight: 8 }}
          />
          {isCurrentlyDownloading && (
            <Text className="font-semibold" style={{ color: colors.primary100 }}>
              {!downloadPhase && 'Starting download...'}
              {downloadPhase === 'fetching'
                ? 'Getting download link...'
                : `Downloading... ${downloadProgress}%`}
            </Text>
          )}

          {queuePosition && (
            <Text className="font-semibold" style={{ color: colors.primary100 }}>
              In queue (#{queuePosition})
            </Text>
          )}

          {isDownloaded && (
            <Text className="font-semibold" style={{ color: colors.primary100 }}>
              Downloaded
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
