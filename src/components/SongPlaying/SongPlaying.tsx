import { usePlayer } from '../../../contexts/player';
import { useTheme } from '../../../contexts/theme';
import { Image, Modal, Text, View, StyleSheet } from 'react-native';
import ControlButtons from './ControlButtons';
import ControlSlider from './ControlSlider';

interface ModalSongPlayingProps {
  visible: boolean;
  onHide: () => void;
}

export default function ModalSongPlaying({
  visible,
  onHide,
}: ModalSongPlayingProps) {
  const { songPlaying } = usePlayer();
  const { colors } = useTheme();

  if (!visible || !songPlaying) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16, // p-4
      backgroundColor: colors.primary50,
    },
    imageContainer: {
      height: 320, // h-80 (80 * 4px = 320px)
      width: 320, // w-80 (80 * 4px = 320px)
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderRadius: 12, // rounded-xl
      borderWidth: 1,
      borderColor: colors.primary200,
    },
    image: {
      height: '135%',
      width: '135%',
      borderRadius: 12, // rounded-xl
    },
    textContainer: {
      marginBottom: 24, // mb-6 (6 * 4px = 24px)
      marginTop: 32, // mt-8 (8 * 4px = 32px)
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: 16, // px-4
    },
    title: {
      textAlign: 'center',
      fontSize: 20, // text-xl
      fontWeight: '600', // font-semibold
      color: colors.primary800,
      textShadowColor: colors.primary200,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    artist: {
      marginTop: 4, // mt-1
      fontSize: 14, // text-sm
      color: colors.primary600,
      textShadowColor: colors.primary200,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
  });

  return (
    <Modal visible={visible} onRequestClose={onHide} animationType="slide">
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            src={songPlaying.thumbnail}
            alt={`${songPlaying.title} thumbnail`}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {songPlaying.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {songPlaying.channelTitle}
          </Text>
        </View>

        <ControlSlider />
        <ControlButtons />
      </View>
    </Modal>
  );
}
