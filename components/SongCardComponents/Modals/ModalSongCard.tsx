import Feather from '@expo/vector-icons/Feather';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import { View, Text, Modal, Image, Alert, TouchableOpacity, Pressable } from 'react-native';
import { Song } from 'types/Song';

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
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onHide}>
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
        onPress={onHide}>
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
                className="me-4 h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border"
                style={{
                  borderColor: colors.primary200,
                }}>
                <Image src={song.thumbnail} className="h-[135%] w-[135%] object-cover" />
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
                onPress={handleOpenSelectionModal}
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}
