import { Feather } from '@expo/vector-icons';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import { useState } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Playlist } from 'types/Song';

interface EditPlaylistProps {
  playlist: Playlist;
  visible: boolean;
  onHide: () => void;
}

export default function EditPlaylist({ playlist, visible, onHide }: EditPlaylistProps) {
  const { colors } = useTheme();
  const { updatePlaylist } = useSongs();
  const [nameInput, setNameInput] = useState<string>(playlist.name);

  const handleNameUpdate = () => {
    updatePlaylist(playlist.id, { name: nameInput });
    onHide();
  };

  return (
    <Modal visible={visible} onRequestClose={onHide} transparent={true} animationType="fade">
      <Pressable
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}
        onPress={onHide}>
        <Pressable onPress={(e) => e.stopPropagation()}></Pressable>
        <View className="flex-1 items-center justify-center">
          <View
            className="w-[80vw] rounded-2xl border-2 p-4"
            style={{ backgroundColor: colors.primary50, borderColor: colors.primary300 }}>
            <View className="flex-row items-center gap-2">
              <Text className="my-2 text-xl font-bold" style={{ color: colors.primary600 }}>
                Change the playlist name
              </Text>
            </View>
            <View className="my-2 rounded-xl" style={{ backgroundColor: colors.primary100 }}>
              <TextInput
                className="mx-2 text-lg"
                style={{ color: colors.primary500 }}
                placeholder={playlist.name}
                placeholderTextColor={colors.primary400}
                onChangeText={setNameInput}
                onSubmitEditing={handleNameUpdate}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
