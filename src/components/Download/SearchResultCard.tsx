import { useDownload } from '../../../contexts/download';
import { useSongs } from '../../../contexts/song';
import {
  Pressable,
  View,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../contexts/theme';
import { SongBase } from '../../../types/Song';

interface SearchResultCardProps {
  youtubeItem: SongBase;
}

export default function SearchResultCard({
  youtubeItem,
}: SearchResultCardProps) {
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

  const videoId = youtubeItem.id;

  const isDownloaded = songs.some(song => song.id === videoId);

  const isCurrentlyDownloading = downloadingId === videoId;

  const isInQueue = downloadingQueue.some(item => item.id === videoId);

  const queuePosition =
    isInQueue && !isCurrentlyDownloading
      ? downloadingQueue.findIndex(item => item.id === videoId) + 1
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
      style={[
        styles.container,
        {
          backgroundColor: colors.primary100,
          borderColor: colors.primary300,
        },
      ]}
    >
      <View
        style={[styles.thumbnailContainer, { borderColor: colors.primary200 }]}
      >
        <Image
          source={{ uri: youtubeItem.thumbnail }}
          style={styles.thumbnail}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text
            style={[styles.title, { color: colors.primary800 }]}
            numberOfLines={1}
          >
            {decodeHtmlEntities(youtubeItem.title)}
          </Text>
          <Text
            style={[styles.channelTitle, { color: colors.primary600 }]}
            numberOfLines={1}
          >
            {youtubeItem.channelTitle}
          </Text>

          {isCurrentlyDownloading && (
            <Text style={[styles.statusText, { color: colors.primary500 }]}>
              {!downloadPhase && 'Starting download...'}
              {downloadPhase === 'fetching'
                ? 'Getting download link...'
                : `Downloading... ${downloadProgress}%`}
            </Text>
          )}

          {queuePosition && (
            <Text style={[styles.statusText, styles.queueText]}>
              In queue (#{queuePosition})
            </Text>
          )}

          {isDownloaded && (
            <Text style={[styles.statusText, styles.downloadedText]}>
              Downloaded
            </Text>
          )}
        </View>

        <Pressable
          onPress={handleDownload}
          disabled={buttonContent.disabled}
          style={[
            styles.downloadButton,
            {
              borderColor: colors.primary200,
              backgroundColor: colors.primary500,
              opacity: buttonContent.disabled ? 0.7 : 1,
            },
          ]}
        >
          {buttonContent.showSpinner ? (
            <ActivityIndicator size={28} color={colors.primary200} />
          ) : (
            <Icon
              name={buttonContent.icon as any}
              size={28}
              color={colors.primary200}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    padding: 12, // p-3
  },
  thumbnailContainer: {
    marginEnd: 8, // me-2
    width: 80, // size-20
    height: 80, // size-20
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 8, // rounded-lg
    borderWidth: 1,
  },
  thumbnail: {
    height: 144, // h-36
    width: 144, // w-36
    borderRadius: 8, // rounded-lg
    resizeMode: 'cover', // object-cover
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 8, // pr-2
  },
  title: {
    fontSize: 16, // text-base
    fontWeight: 'bold',
    flexShrink: 1,
  },
  channelTitle: {
    fontSize: 14, // text-sm
    flexShrink: 1,
  },
  statusText: {
    marginTop: 4, // mt-1
    fontSize: 12, // text-xs
  },
  queueText: {
    color: '#f97316', // text-orange-500
  },
  downloadedText: {
    color: '#22c55e', // text-green-500
  },
  downloadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50, // rounded-full
    borderWidth: 1,
    padding: 8, // p-2
  },
});
