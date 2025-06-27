import { View, Text, Pressable, Modal, ActivityIndicator } from 'react-native';
import { useTheme } from 'contexts/theme';
import { useEffect, useState } from 'react';
import { useYoutube } from 'hooks/useYoutube';
import Feather from '@expo/vector-icons/Feather';
import { SongBase } from 'types/Song';
import SearchResultLargeCard from '../SearchResultLargeCard';

interface GetLinkProps {
  videoId: string;
  visible: boolean;
  onHide: () => void;
}

export default function SingleSong({ videoId, visible, onHide }: GetLinkProps) {
  const { colors } = useTheme();
  const { getSongFromURL } = useYoutube();
  const [item, setItem] = useState<SongBase | undefined>(undefined);

  useEffect(() => {
    const getSong = async () => {
      const youtubeItem = await getSongFromURL(videoId);

      setItem(youtubeItem);
    };

    if (!item && visible) {
      getSong();
    }
  }, [videoId, visible, item, getSongFromURL]);

  if (!item)
    return (
      <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onHide}>
        <Pressable className="flex-1 items-center justify-center" onPress={onHide}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className="w-[80vw] rounded-2xl p-4"
              style={{ backgroundColor: colors.primary200 }}>
              <View className="items-center justify-center gap-2 py-4">
                <ActivityIndicator size={36} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onHide}>
      <Pressable className="flex-1 items-center justify-center" onPress={onHide}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            className="w-[85vw] max-w-md rounded-2xl"
            style={{ backgroundColor: colors.primary200 }}>
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
                Song obtained
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

            <SearchResultLargeCard youtubeItem={item} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
