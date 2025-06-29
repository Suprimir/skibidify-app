import {
  View,
  Text,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../../../contexts/theme';
import { useEffect, useState } from 'react';
import { useYoutube } from '../../../../hooks/useYoutube';
import Icon from 'react-native-vector-icons/Feather';
import { SongBase } from '../../../../types/Song';
import SearchResultLargeCard from '../SearchResultCard';

interface GetLinkProps {
  videoId: string;
  visible: boolean;
  onHide: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

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
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onHide}
      >
        <Pressable style={styles.backdrop} onPress={onHide}>
          <Pressable onPress={e => e.stopPropagation()}>
            <View
              style={[
                styles.loadingContainer,
                { backgroundColor: colors.primary200 },
              ]}
            >
              <View style={styles.loadingContent}>
                <ActivityIndicator size={36} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onHide}
    >
      <Pressable style={styles.backdrop} onPress={onHide}>
        <Pressable onPress={e => e.stopPropagation()}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.primary200 },
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
                Song obtained
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

            <SearchResultLargeCard youtubeItem={item} />
          </View>
        </Pressable>
      </Pressable>
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
    borderRadius: 16, // rounded-2xl
    padding: 16, // p-4
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // gap-2
    paddingVertical: 16, // py-4
  },
  modalContainer: {
    width: screenWidth * 0.85, // w-[85vw]
    maxWidth: 384, // max-w-md (equivalent to 24rem = 384px)
    borderRadius: 16, // rounded-2xl
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 16,
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
});
