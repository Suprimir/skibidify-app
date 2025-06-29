import {
  View,
  Text,
  Pressable,
  Modal,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../../contexts/theme';
import { useEffect, useState } from 'react';
import { useYoutube } from '../../../../hooks/useYoutube';
import Icon from 'react-native-vector-icons/Feather';
import { useDownload } from '../../../../contexts/download';
import { useSongs } from '../../../../contexts/song';
import { SongBase } from '../../../../types/Song';
import SearchResultCard from '../SearchResultCard';

interface GetLinkProps {
  playlistId: string;
  visible: boolean;
  onHide: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function MultipleSongs({
  playlistId,
  visible,
  onHide,
}: GetLinkProps) {
  const { colors } = useTheme();
  const { songs } = useSongs();
  const { addToDownloadQueue, downloadingId, downloadingQueue } = useDownload();
  const { getSongsFromPlaylistURL } = useYoutube();
  const [items, setItems] = useState<SongBase[] | undefined>(undefined);

  const getDownloadStatus = (itemId: string) => {
    const isDownloaded = songs.some(song => song.id === itemId);
    if (isDownloaded) return 'downloaded';

    if (downloadingId === itemId) return 'downloading';

    const isInQueue = downloadingQueue.some(
      queueItem => queueItem.id === itemId,
    );
    if (isInQueue) return 'queued';

    return 'not_downloaded';
  };

  const downloadAll = () => {
    if (!items) return;

    items.forEach(item => {
      const status = getDownloadStatus(item.id);
      if (status === 'not_downloaded') {
        addToDownloadQueue(item);
      }
    });
  };

  useEffect(() => {
    const getSong = async () => {
      const youtubeItem = await getSongsFromPlaylistURL(playlistId);
      setItems(youtubeItem);
    };

    if (!items && visible) {
      getSong();
    }
  }, [playlistId, visible, items, getSongsFromPlaylistURL]);

  if (!items)
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onHide}
      >
        <View style={styles.backdrop}>
          <View
            style={[
              styles.loadingContainer,
              {
                backgroundColor: colors.primary200,
              },
            ]}
          >
            <View style={styles.loadingContent}>
              <ActivityIndicator size={36} />
            </View>
          </View>
        </View>
      </Modal>
    );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onHide}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.primary200,
            },
          ]}
        >
          <View
            style={[
              styles.header,
              {
                borderBottomColor: colors.primary300,
              },
            ]}
          >
            <Text
              style={[
                styles.title,
                {
                  color: colors.primary800,
                },
              ]}
            >
              Songs in the playlist
            </Text>
            <Pressable
              style={[
                styles.closeButton,
                {
                  backgroundColor: colors.primary300,
                },
              ]}
              onPress={onHide}
            >
              <Icon name="x" size={20} color={colors.primary800} />
            </Pressable>
          </View>

          <Pressable
            style={[
              styles.downloadAllButton,
              {
                backgroundColor: colors.primary500,
              },
            ]}
            onPress={downloadAll}
          >
            <Icon name="download" size={20} color={colors.primary200} />
            <Text
              style={[styles.downloadAllText, { color: colors.primary200 }]}
            >
              Download All
            </Text>
          </Pressable>

          <FlatList
            data={items}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={true}
            bounces={true}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.flatListContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => <SearchResultCard youtubeItem={item} />}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    width: screenWidth * 0.8, // w-[80vw]
    borderRadius: 16, // rounded-2xl (note: original had typo "rouned-2xl")
    padding: 16, // p-4
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // gap-2
    padding: 16, // p-4
  },
  modalContainer: {
    height: screenHeight * 0.75, // h-[75vh]
    width: screenWidth * 0.9, // w-[90vw]
    maxWidth: 384, // max-w-md
    overflow: 'hidden',
    borderRadius: 16, // rounded-2xl
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1, // border-b
    padding: 16, // p-4
  },
  title: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
  },
  closeButton: {
    height: 32, // h-8
    width: 32, // w-8
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16, // rounded-full
  },
  downloadAllButton: {
    margin: 16, // m-4
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // gap-2
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
  },
  downloadAllText: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingBottom: 32, // pb-8
    paddingHorizontal: 16, // px-4
  },
  separator: {
    height: 16, // h-4
  },
});
