import { usePlayer } from 'contexts/player';
import { useTheme } from 'contexts/theme';
import { Image, Modal, Text, View } from 'react-native';
import ControlButtons from './ControlButtons';
import ControlSlider from './ControlSlider';

interface ModalSongPlayingProps {
  visible: boolean;
  onHide: () => void;
}

export default function ModalSongPlaying({ visible, onHide }: ModalSongPlayingProps) {
  const { songPlaying } = usePlayer();
  const { colors } = useTheme();

  if (!visible || !songPlaying) {
    return null;
  }
  return (
    <Modal visible={visible} onRequestClose={onHide} animationType="slide">
      <View
        className="h-full items-center justify-center p-4 "
        style={{ backgroundColor: colors.primary50 }}>
        <View
          className="h-80 w-80 items-center justify-center overflow-hidden rounded-xl border"
          style={{ borderColor: colors.primary200 }}>
          <Image
            src={songPlaying.thumbnail}
            alt={`${songPlaying.title} thumbnail`}
            className="h-[36rem] w-[36rem] rounded-xl object-cover object-center"
          />
        </View>

        <View className="mb-6 mt-8 w-full items-center">
          <Text className="text-center text-xl font-semibold" style={{ color: colors.primary500 }}>
            {songPlaying.title}
          </Text>
          <Text className="text-sm" style={{ color: colors.primary400 }}>
            {songPlaying.channelTitle}
          </Text>
        </View>

        <ControlSlider />
        <ControlButtons />
      </View>
    </Modal>
  );
}
