import { useDownload } from '../../../contexts/download';
import { useSongs } from '../../../contexts/song';
import { Pressable, View, Image, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../contexts/theme';
import { SongBase } from '../../../types/Song';

interface SearchResultLargeCardProps {
  youtubeItem: SongBase;
}

export default function SearchResultLargeCard({
  youtubeItem,
}: SearchResultLargeCardProps) {
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
    <View style={styles.container}>
      <View>
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: colors.primary100 },
          ]}
        >
          <Image
            source={{ uri: youtubeItem.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text
          numberOfLines={2}
          style={[styles.title, { color: colors.primary800 }]}
        >
          {youtubeItem.title}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.subtitle, { color: colors.primary600 }]}
        >
          {youtubeItem.channelTitle}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          disabled={buttonContent.disabled}
          onPress={handleDownload}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary600,
              opacity: buttonContent.disabled ? 0.7 : 1,
            },
          ]}
        >
          <Icon
            name={buttonContent.icon as any}
            size={20}
            color={colors.primary100}
            style={styles.icon}
          />
          {isCurrentlyDownloading && (
            <Text style={[styles.buttonText, { color: colors.primary100 }]}>
              {!downloadPhase && 'Starting download...'}
              {downloadPhase === 'fetching'
                ? 'Getting download link...'
                : `Downloading... ${downloadProgress}%`}
            </Text>
          )}

          {queuePosition && (
            <Text style={[styles.buttonText, { color: colors.primary100 }]}>
              In queue (#{queuePosition})
            </Text>
          )}

          {isDownloaded && (
            <Text style={[styles.buttonText, { color: colors.primary100 }]}>
              Downloaded
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 32,
  },
  imageContainer: {
    height: 224,
    width: 224,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },
  image: {
    width: '135%',
    height: '135%',
  },
  textContainer: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
  },
  buttonContainer: {
    margin: 16,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 16,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
});
