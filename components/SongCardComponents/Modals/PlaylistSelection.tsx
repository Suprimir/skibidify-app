import { View, Text, Modal, Pressable, TouchableOpacity, FlatList, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme';
import { useSongs } from 'contexts/song';
import { Song } from 'types/Song';

interface PlaylistSelectionProps {
  song: Song;
  visible: boolean;
  onHide: () => void;
}

export default function PlaylistSelection({ song, visible, onHide }: PlaylistSelectionProps) {
  const { colors } = useTheme();
  const { playlists, addSongToPlaylist } = useSongs();

  const handleSelectPlaylist = (playlistId: string, playlistName: string) => {
    addSongToPlaylist(playlistId, song);
    onHide();

    setTimeout(() => {
      Alert.alert('Success', `"${song.title}" has been added to "${playlistName}"`);
    }, 150);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onHide}>
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
        onPress={onHide}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={[
              {
                backgroundColor: colors.primary50,
                borderColor: colors.primary200,
                height: 300,
              },
            ]}
            className="fixed bottom-0 left-0 right-0 rounded-t-3xl border-l-2 border-r-2 border-t-2">
            <View
              className="flex-row items-center border-b p-6"
              style={{
                borderColor: colors.primary200,
              }}>
              <TouchableOpacity onPress={onHide} className="mr-4 p-2" activeOpacity={0.7}>
                <Feather name="arrow-left" size={24} color={colors.primary600} />
              </TouchableOpacity>
              <Text
                className="text-xl font-bold"
                style={{
                  color: colors.primary800,
                }}>
                Select Playlist
              </Text>
            </View>

            <View className="flex-1 pt-4">
              {playlists && playlists.length > 0 ? (
                <FlatList
                  data={playlists}
                  keyExtractor={(playlist) => playlist.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      key={item.id}
                      className="mx-4 mb-2 flex-row items-center rounded-xl p-4"
                      style={{
                        backgroundColor: colors.primary100,
                      }}
                      onPress={() => handleSelectPlaylist(item.id, item.name)}
                      activeOpacity={0.7}>
                      <View
                        className="mr-4 h-12 w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: colors.primary200,
                        }}>
                        <Feather name="music" size={20} color={colors.primary600} />
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-lg font-semibold"
                          style={{
                            color: colors.primary800,
                          }}
                          numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Text
                          className="text-sm"
                          style={{
                            color: colors.primary500,
                          }}>
                          {item.songs?.length || 0} songs
                        </Text>
                      </View>
                      <Feather name="plus" size={20} color={colors.primary600} />
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <View className="flex-1 items-center justify-center p-8">
                  <Feather name="music" size={48} color={colors.primary400} />
                  <Text
                    className="mt-4 text-center text-lg font-semibold"
                    style={{
                      color: colors.primary600,
                    }}>
                    No playlists available
                  </Text>
                  <Text
                    className="mt-2 text-center"
                    style={{
                      color: colors.primary500,
                    }}>
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
