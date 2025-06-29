import Icon from 'react-native-vector-icons/Feather';
import { useSongs } from '../../../../contexts/song';
import { useTheme } from '../../../../contexts/theme';
import {
  View,
  Image,
  Text,
  Modal,
  Alert,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Playlist } from '../../../../types/Song';
import {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';

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

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to select images',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImageUpdate = async () => {
    const hasPermission = await requestPermission();

    if (!hasPermission) {
      Alert.alert(
        'Permission denied',
        'Storage permission is required to select images.',
      );
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 1 as PhotoQuality,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        Alert.alert('Info', 'You did not select any image.');
      } else if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          updatePlaylist(playlist.id, { image: imageUri });
        }
      }
    });
  };

  const handleDeletePlaylist = () => {
    onHide();

    setTimeout(() => {
      Alert.alert(
        'Delete playlist',
        `Are you sure to delete "${playlist.name}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deletePlaylist(playlist.id),
          },
        ],
      );
    }, 300);
  };

  if (!visible) {
    return null;
  }

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.primary50,
      borderColor: colors.primary200,
      height: 275,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderLeftWidth: 2,
      borderRightWidth: 2,
      borderTopWidth: 2,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.primary200,
      padding: 24,
    },
    imageContainer: {
      marginRight: 16,
      height: 64,
      width: 64,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 12,
      backgroundColor: colors.primary200,
      borderWidth: 2,
      borderColor: colors.primary300,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    textContainer: {
      flex: 1,
    },
    playlistName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary800,
    },
    songCount: {
      fontSize: 16,
      color: colors.primary600,
    },
    buttonsContainer: {
      paddingTop: 32,
    },
    button: {
      padding: 16,
    },
    editButtonText: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary600,
    },
    deleteButtonText: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ef4444', // text-red-500
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onHide}
    >
      <Pressable style={styles.modalContainer} onPress={onHide}>
        <Pressable onPress={() => null}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={handleImageUpdate} activeOpacity={0.7}>
                <View style={styles.imageContainer}>
                  {playlist.image ? (
                    <Image
                      source={{ uri: playlist.image }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  ) : (
                    <Icon name="music" size={24} color={colors.primary600} />
                  )}
                </View>
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.playlistName} numberOfLines={1}>
                  {playlist.name}
                </Text>
                <Text style={styles.songCount} numberOfLines={1}>
                  {playlist.songs.length} song
                  {playlist.songs.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={openNameModal}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>Edit playlist name</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleDeletePlaylist}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteButtonText}>Delete Playlist</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
