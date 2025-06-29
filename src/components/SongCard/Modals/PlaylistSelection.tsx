import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../../contexts/theme';
import { useSongs } from '../../../../contexts/song';
import { Song } from '../../../../types/Song';

interface PlaylistSelectionProps {
  song: Song;
  visible: boolean;
  onHide: () => void;
}

export default function PlaylistSelection({
  song,
  visible,
  onHide,
}: PlaylistSelectionProps) {
  const { colors } = useTheme();
  const { playlists, addSongToPlaylist } = useSongs();

  const handleSelectPlaylist = (playlistId: string, playlistName: string) => {
    addSongToPlaylist(playlistId, song);
    onHide();

    setTimeout(() => {
      Alert.alert(
        'Success',
        `"${song.title}" has been added to "${playlistName}"`,
      );
    }, 150);
  };

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
              <TouchableOpacity
                onPress={onHide}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <Icon name="arrow-left" size={24} color={colors.primary600} />
              </TouchableOpacity>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: colors.primary800,
                  },
                ]}
              >
                Select Playlist
              </Text>
            </View>

            <View style={styles.contentContainer}>
              {playlists && playlists.length > 0 ? (
                <FlatList
                  data={playlists}
                  keyExtractor={playlist => playlist.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.playlistItem,
                        {
                          backgroundColor: colors.primary100,
                        },
                      ]}
                      onPress={() => handleSelectPlaylist(item.id, item.name)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.playlistIcon,
                          {
                            backgroundColor: colors.primary200,
                          },
                        ]}
                      >
                        <Icon
                          name="music"
                          size={20}
                          color={colors.primary600}
                        />
                      </View>
                      <View style={styles.playlistInfo}>
                        <Text
                          style={[
                            styles.playlistName,
                            {
                              color: colors.primary800,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            styles.songCount,
                            {
                              color: colors.primary500,
                            },
                          ]}
                        >
                          {item.songs?.length || 0} songs
                        </Text>
                      </View>
                      <Icon name="plus" size={20} color={colors.primary600} />
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Icon name="music" size={48} color={colors.primary400} />
                  <Text
                    style={[
                      styles.emptyTitle,
                      {
                        color: colors.primary600,
                      },
                    ]}
                  >
                    No playlists available
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtitle,
                      {
                        color: colors.primary500,
                      },
                    ]}
                  >
                    Create a playlist first to add songs
                  </Text>
                </View>
              )}
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
    padding: 24, // p-6
  },
  backButton: {
    marginRight: 16, // mr-4
    padding: 8, // p-2
  },
  headerTitle: {
    fontSize: 20, // text-xl
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16, // pt-4
  },
  playlistItem: {
    marginHorizontal: 16, // mx-4
    marginBottom: 8, // mb-2
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
  },
  playlistIcon: {
    marginRight: 16, // mr-4
    height: 48, // h-12
    width: 48, // w-12
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12, // rounded-xl
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 18, // text-lg
    fontWeight: '600', // font-semibold
  },
  songCount: {
    fontSize: 14, // text-sm
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32, // p-8
  },
  emptyTitle: {
    marginTop: 16, // mt-4
    textAlign: 'center',
    fontSize: 18, // text-lg
    fontWeight: '600', // font-semibold
  },
  emptySubtitle: {
    marginTop: 8, // mt-2
    textAlign: 'center',
  },
});
