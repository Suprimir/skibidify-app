import Feather from '@expo/vector-icons/Feather';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import { View, Image, Text, Modal, Alert, TouchableOpacity, Pressable } from 'react-native';
import { Playlist } from 'types/Song';
import * as ImagePicker from 'expo-image-picker';

interface MainPlaylistProps {
  playlist: Playlist;
  visible: boolean;
  onHide: () => void;
  openNameModal: () => void;
}

export default function MainPlaylist({
  playlist,
  visible,
  onHide,
  openNameModal,
}: MainPlaylistProps) {
  const { colors } = useTheme();
  const { updatePlaylist, deletePlaylist } = useSongs();

  const handleImageUpdate = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0].uri;
      updatePlaylist(playlist.id, { image: image });
    } else {
      alert('You did not select any image.');
    }
  };

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
          justifyContent: 'flex-end',
        }}
        onPress={onHide}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={{
              backgroundColor: colors.primary50,
              borderColor: colors.primary200,
              height: 275,
            }}
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-l-2 border-r-2 border-t-2">
            <View
              className="flex-row items-center border-b p-6"
              style={{
                borderColor: colors.primary200,
              }}>
              <TouchableOpacity onPress={handleImageUpdate} activeOpacity={0.7}>
                <View
                  className="me-4 h-16 w-16 items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    backgroundColor: colors.primary200,
                    borderWidth: 2,
                    borderColor: colors.primary300,
                  }}>
                  {playlist.image ? (
                    <Image
                      source={{ uri: playlist.image }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Feather name="music" size={24} color={colors.primary600} />
                  )}
                </View>
              </TouchableOpacity>
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
                  {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <View className="pt-8">
              <TouchableOpacity className="p-4" onPress={openNameModal} activeOpacity={0.7}>
                <Text
                  className="text-center text-lg font-bold"
                  style={{ color: colors.primary600 }}>
                  Edit playlist name
                </Text>
              </TouchableOpacity>
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
