import { useSongs } from '../../../../contexts/song';
import { useTheme } from '../../../../contexts/theme';
import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Playlist } from '../../../../types/Song';

interface EditPlaylistProps {
  playlist: Playlist;
  visible: boolean;
  onHide: () => void;
}

export default function EditPlaylist({
  playlist,
  visible,
  onHide,
}: EditPlaylistProps) {
  const { colors } = useTheme();
  const { updatePlaylist } = useSongs();
  const [nameInput, setNameInput] = useState<string>(playlist.name);

  const handleNameUpdate = () => {
    updatePlaylist(playlist.id, { name: nameInput });
    onHide();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onHide}
      transparent={true}
      animationType="fade"
    >
      <Pressable style={styles.modalBackdrop} onPress={onHide}>
        <Pressable onPress={() => null}></Pressable>
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.primary50,
                borderColor: colors.primary300,
              },
            ]}
          >
            <View style={styles.headerContainer}>
              <Text style={[styles.titleText, { color: colors.primary600 }]}>
                Change the playlist name
              </Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.primary100 },
              ]}
            >
              <TextInput
                style={[styles.textInput, { color: colors.primary500 }]}
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

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  centerContainer: {
    flex: 1, // flex-1
    alignItems: 'center', // items-center
    justifyContent: 'center', // justify-center
  },
  modalContent: {
    width: '80%', // w-[80vw]
    borderRadius: 16, // rounded-2xl
    borderWidth: 2, // border-2
    padding: 16, // p-4
  },
  headerContainer: {
    flexDirection: 'row', // flex-row
    alignItems: 'center', // items-center
    gap: 8, // gap-2
  },
  titleText: {
    marginVertical: 8, // my-2
    fontSize: 20, // text-xl
    fontWeight: 'bold', // font-bold
  },
  inputContainer: {
    marginVertical: 8, // my-2
    borderRadius: 12, // rounded-xl
  },
  textInput: {
    marginHorizontal: 8, // mx-2
    fontSize: 18, // text-lg
    paddingVertical: 12, // Añadido para mejor usabilidad
  },
});
