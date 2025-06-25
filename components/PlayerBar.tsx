import { usePlayer } from 'contexts/player';
import { View, Image, Text, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import ModalSongPlaying from './SongPlayingScreen/ModalSongPlaying';

export default function PlayerBar() {
  const { songPlaying, handlePause, paused } = usePlayer();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  if (!songPlaying) return null;

  return (
    <>
      <Pressable onPress={handleModal}>
        <View
          className="m-2 flex-row items-center justify-between rounded-lg border px-4 py-2"
          style={{
            backgroundColor: colors.primary100,
            borderColor: colors.primary200,
            shadowColor: colors.primary600,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View
            className="h-14 w-14 items-center justify-center"
            style={{
              aspectRatio: 1,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.primary200,
              overflow: 'hidden',
            }}>
            <Image
              source={{ uri: songPlaying.thumbnail }}
              style={{ width: '135%', height: '135%' }}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 px-3">
            <Text
              numberOfLines={1}
              className="text-sm font-semibold"
              style={{ color: colors.primary800 }}>
              {songPlaying.title}
            </Text>
            <Text numberOfLines={1} className="text-xs" style={{ color: colors.primary600 }}>
              {songPlaying.channelTitle}
            </Text>
          </View>

          <Pressable onPress={handlePause} className="p-2">
            <Feather name={paused ? 'play' : 'pause'} size={24} color={colors.primary600} />
          </Pressable>
        </View>
      </Pressable>

      <ModalSongPlaying visible={modalVisible} onHide={handleModal} />
    </>
  );
}
