import Icon from 'react-native-vector-icons/Feather';
import { useSongs } from '../../../../contexts/song';
import { useTheme } from '../../../../contexts/theme';
import {
  View,
  Text,
  Modal,
  Image,
  Alert,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Song } from '../../../../types/Song';

interface ModalSongCardProps {
  song: Song;
  visible: boolean;
  onHide: () => void;
  handleOpenSelectionModal: () => void;
}

export default function ModalSongCard({
  song,
  visible,
  onHide,
  handleOpenSelectionModal,
}: ModalSongCardProps) {
  const { colors } = useTheme();
  const { deleteSong } = useSongs();

  const handleDeleteSong = () => {
    onHide();

    setTimeout(() => {
      Alert.alert('Delete song', `Are you sure to delete "${song.title}"?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSong(song.id),
        },
      ]);
    }, 300);
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onHide}
    >
      <Pressable style={styles.modalBackdrop} onPress={onHide}>
        <Pressable onPress={e => e.stopPropagation()}>
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: colors.primary50,
                borderColor: colors.primary200,
              },
            ]}
          >
            <View
              style={[
                styles.headerContainer,
                {
                  borderColor: colors.primary200,
                },
              ]}
            >
              <View
                style={[
                  styles.thumbnailContainer,
                  {
                    borderColor: colors.primary200,
                  },
                ]}
              >
                <Image src={song.thumbnail} style={styles.thumbnailImage} />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.titleText,
                    {
                      color: colors.primary800,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {song.title}
                </Text>
                <Text
                  style={[
                    styles.channelText,
                    {
                      color: colors.primary600,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {song.channelTitle}
                </Text>
              </View>
            </View>
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDeleteSong}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteText}>Delete Song</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playlistButton}
                onPress={handleOpenSelectionModal}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.playlistText,
                    {
                      color: colors.primary600,
                    },
                  ]}
                >
                  Add to a Playlist
                </Text>
                <Icon name="arrow-right" size={24} color={colors.primary600} />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
    borderTopLeftRadius: 24, // rounded-t-3xl
    borderTopRightRadius: 24,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 32, // p-8
  },
  thumbnailContainer: {
    marginEnd: 16, // me-4
    height: 64, // h-16
    width: 64, // w-16
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
  },
  thumbnailImage: {
    height: '135%',
    width: '135%',
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
  },
  channelText: {
    fontSize: 16, // text-md
  },
  actionsContainer: {
    paddingTop: 32, // pt-8
  },
  actionButton: {
    padding: 16, // p-4
  },
  deleteText: {
    textAlign: 'center',
    fontSize: 18, // text-lg
    fontWeight: 'bold',
    color: '#ef4444', // text-red-500
  },
  playlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // gap-2
    padding: 16, // p-4
  },
  playlistText: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
  },
});
