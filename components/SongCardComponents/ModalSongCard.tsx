import Feather from '@expo/vector-icons/Feather';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import {
  View,
  Text,
  Modal,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import { Song } from 'types/Song';
import { useState, useEffect, useRef } from 'react';
import { FlatList } from 'react-native-gesture-handler';

interface ModalSongCardProps {
  song: Song;
  visible: boolean;
  onHide: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ModalSongCard({ song, visible, onHide }: ModalSongCardProps) {
  const { colors } = useTheme();
  const { playlists, addSongToPlaylist, deleteSong } = useSongs();

  const [showPlaylists, setShowPlaylists] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  useEffect(() => {
    if (!visible) {
      setShowPlaylists(false);
      slideAnim.setValue(screenWidth);
    }
  }, [visible]);

  useEffect(() => {
    if (showPlaylists) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 120,
        friction: 20,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: screenWidth,
        tension: 120,
        friction: 20,
        useNativeDriver: true,
      }).start();
    }
  }, [showPlaylists]);

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

  const handleAddToPlaylist = () => {
    setShowPlaylists(true);
  };

  const handleBackToMain = () => {
    setShowPlaylists(false);
  };

  const handleSelectPlaylist = (playlistId: string, playlistName: string) => {
    addSongToPlaylist(playlistId, song);
    setShowPlaylists(false);
    onHide();

    setTimeout(() => {
      Alert.alert('Success', `"${song.title}" has been added to "${playlistName}"`);
    }, 150);
  };

  const handleCloseModal = () => {
    if (showPlaylists) {
      handleBackToMain();
    } else {
      onHide();
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseModal}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          justifyContent: 'flex-end',
        }}
        onPress={handleCloseModal}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={{
              backgroundColor: colors.primary50,
              borderColor: colors.primary200,
              height: 300,
            }}
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-l-2 border-r-2 border-t-2">
            <View
              className="flex-row items-center border-b p-8"
              style={{
                borderColor: colors.primary200,
              }}>
              <View
                className="me-4 h-16 w-16 overflow-hidden rounded-2xl border"
                style={{
                  borderColor: colors.primary200,
                }}>
                <Image src={song.thumbnail} className="h-full w-full object-cover" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-bold"
                  style={{
                    color: colors.primary800,
                  }}
                  numberOfLines={1}>
                  {song.title}
                </Text>
                <Text
                  className="text-md"
                  style={{
                    color: colors.primary600,
                  }}
                  numberOfLines={1}>
                  {song.channelTitle}
                </Text>
              </View>
            </View>
            <View className="pt-8">
              <TouchableOpacity className="p-4" onPress={handleDeleteSong} activeOpacity={0.7}>
                <Text className="text-center text-lg font-bold text-red-500">Delete Song</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 p-4"
                onPress={handleAddToPlaylist}
                activeOpacity={0.7}>
                <Text
                  className="text-lg font-bold"
                  style={{
                    color: colors.primary600,
                  }}>
                  Add to a Playlist
                </Text>
                <Feather name="arrow-right" size={24} color={colors.primary600} />
              </TouchableOpacity>
            </View>
          </View>

          <Animated.View
            style={[
              {
                backgroundColor: colors.primary50,
                borderColor: colors.primary200,
                transform: [{ translateX: slideAnim }],
                height: 300,
              },
            ]}
            className="fixed bottom-0 left-0 right-0 rounded-t-3xl border-l-2 border-r-2 border-t-2">
            <View
              className="flex-row items-center border-b p-6"
              style={{
                borderColor: colors.primary200,
              }}>
              <TouchableOpacity onPress={handleBackToMain} className="mr-4 p-2" activeOpacity={0.7}>
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
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
