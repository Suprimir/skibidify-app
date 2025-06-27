import { View, Text, Pressable, Modal, ActivityIndicator, FlatList } from 'react-native';
import { useTheme } from 'contexts/theme';
import { useEffect, useState } from 'react';
import { useYoutube } from 'hooks/useYoutube';
import Feather from '@expo/vector-icons/Feather';
import { useDownload } from 'contexts/download';
import { useSongs } from 'contexts/song';
import { SongBase } from 'types/Song';
import SearchResultCard from '../SearchResultCard';

interface GetLinkProps {
  playlistId: string;
  visible: boolean;
  onHide: () => void;
}

export default function MultipleSongs({ playlistId, visible, onHide }: GetLinkProps) {
  const { colors } = useTheme();
  const { songs } = useSongs();
  const { addToDownloadQueue, downloadingId, downloadingQueue } = useDownload();
  const { getSongsFromPlaylistURL } = useYoutube();
  const [items, setItems] = useState<SongBase[] | undefined>(undefined);

  const getDownloadStatus = (itemId: string) => {
    const isDownloaded = songs.some((song) => song.id === itemId);
    if (isDownloaded) return 'downloaded';

    if (downloadingId === itemId) return 'downloading';

    const isInQueue = downloadingQueue.some((queueItem) => queueItem.id === itemId);
    if (isInQueue) return 'queued';

    return 'not_downloaded';
  };

  const downloadAll = () => {
    if (!items) return;

    items.forEach((item) => {
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
      <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onHide}>
        <View className="flex-1 items-center justify-center">
          <View
            className="rouned-2xl w-[80vw] p-4"
            style={{
              backgroundColor: colors.primary200,
            }}>
            <View className="items-center justify-center gap-2 p-4">
              <ActivityIndicator size={36} />
            </View>
          </View>
        </View>
      </Modal>
    );

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onHide}>
      <View className="flex-1 items-center justify-center">
        <View
          className="h-[75vh] w-[90vw] max-w-md overflow-hidden rounded-2xl"
          style={{
            backgroundColor: colors.primary200,
          }}>
          <View
            className="flex-row items-center justify-between border-b p-4"
            style={{
              borderBottomColor: colors.primary300,
            }}>
            <Text
              className="text-lg font-bold"
              style={{
                color: colors.primary800,
              }}>
              Songs in the playlist
            </Text>
            <Pressable
              className="h-8 w-8 items-center justify-center rounded-full"
              onPress={onHide}
              style={{
                backgroundColor: colors.primary300,
              }}>
              <Feather name="x" size={20} color={colors.primary800} />
            </Pressable>
          </View>

          <Pressable
            className="m-4 flex-row items-center justify-center gap-2 rounded-xl p-4"
            onPress={downloadAll}
            style={{
              backgroundColor: colors.primary500,
            }}>
            <Feather name="download" size={20} color={colors.primary200} />
            <Text className="text-lg font-bold" style={{ color: colors.primary200 }}>
              Download All
            </Text>
          </Pressable>

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            bounces={true}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="pb-8 px-4"
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item }) => <SearchResultCard youtubeItem={item} />}
          />
        </View>
      </View>
    </Modal>
  );
}
