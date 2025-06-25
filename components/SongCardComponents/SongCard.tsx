import { useState } from 'react';
import type { Song } from 'types/Song';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { usePlayer } from 'contexts/player';
import ModalSongCard from './ModalSongCard';

interface SongCardProps {
  song: Song;
  onDelete?: (song: Song) => void;
}

export default function SongCard({ song }: SongCardProps) {
  const { colors } = useTheme();
  const { handlePlay } = usePlayer();
  const [modalVisible, setModalVisible] = useState(false);

  const showContextMenu = () => {
    setModalVisible(true);
  };

  const hideContextMenu = () => {
    setModalVisible(false);
  };

  const handleRegularPress = () => {
    handlePlay(song);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleRegularPress}
        onLongPress={showContextMenu}
        delayLongPress={500}
        className="flex-1">
        <View
          className="group h-full w-full cursor-pointer flex-row rounded-xl border p-2" // Cambiado a h-full
          style={{
            backgroundColor: colors.primary200,
            borderColor: colors.primary200,
            shadowColor: colors.primary600,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}>
          <View style={{ width: '30%', maxWidth: 60 }}>
            <View
              className="items-center justify-center"
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.primary200,
                overflow: 'hidden',
              }}>
              <Image
                source={{ uri: song.thumbnail }}
                style={{ width: '135%', height: '135%' }}
                resizeMode="cover"
              />
            </View>
          </View>

          <View className="ms-4 flex-1 justify-center">
            <Text
              numberOfLines={1}
              className="text-sm font-bold leading-tight "
              style={{ color: colors.primary800 }}>
              {song.title}
            </Text>
            <Text
              numberOfLines={1}
              className="mt-0.5 text-xs font-medium"
              style={{ color: colors.primary600 }}>
              {song.channelTitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <ModalSongCard song={song} visible={modalVisible} onHide={hideContextMenu} />
    </>
  );
}
