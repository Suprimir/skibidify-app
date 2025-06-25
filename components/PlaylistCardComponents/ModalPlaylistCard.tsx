import Feather from '@expo/vector-icons/Feather';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import { View, Text, Modal, Alert, TouchableOpacity, Pressable } from 'react-native';
import { Playlist } from 'types/Song';

interface ModalPlaylistCardProps {
  playlist: Playlist;
  visible: boolean;
  onHide: () => void;
}

export default function ModalPlaylistCard({ playlist, visible, onHide }: ModalPlaylistCardProps) {
  const { colors } = useTheme();
  const { deletePlaylist } = useSongs();

  const handleDeletePlaylist = () => {
    onHide();

    setTimeout(() => {
      Alert.alert('Delete playlist', `Are you sure to delete "${playlist.name}"?`, [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePlaylist(playlist.id),
        },
      ]);
    }, 300);
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onHide}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          justifyContent: 'flex-end',
        }}
        onPress={onHide}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={{
              backgroundColor: colors.primary50,
              borderColor: colors.primary200,
              height: 225,
            }}
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-l-2 border-r-2 border-t-2">
            <View
              className="flex-row items-center border-b p-8"
              style={{
                borderColor: colors.primary200,
              }}>
              <View
                className="me-4 h-16 w-16 items-center justify-center rounded-2xl border"
                style={{
                  borderColor: colors.primary200,
                }}>
                <Feather name="music" size={24} color={colors.primary600} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-bold"
                  style={{
                    color: colors.primary800,
                  }}
                  numberOfLines={1}>
                  {playlist.name}
                </Text>
                <Text
                  className="text-md"
                  style={{
                    color: colors.primary600,
                  }}
                  numberOfLines={1}>
                  {playlist.songs.length} song
                  {playlist.songs.length > 0 || playlist.songs.length === 0 ? 's' : ''}
                </Text>
              </View>
            </View>
            <View className="pt-8">
              <TouchableOpacity className="p-4" onPress={handleDeletePlaylist} activeOpacity={0.7}>
                <Text className="text-center text-lg font-bold text-red-500">Delete Playlist</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
