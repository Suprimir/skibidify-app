import { useState } from 'react';
import type { Song } from 'types/Song';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { usePlayer } from 'contexts/player';
import Index from './Modals/Index';

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
        delayLongPress={500}>
        <View
          className="group w-full flex-row rounded-xl border p-2"
          style={{
            backgroundColor: colors.primary100,
            borderColor: colors.primary300,
            minHeight: 76, // 60px del icono + 16px de padding
          }}>
          <View style={{ width: '30%', maxWidth: 60, height: 60 }}>
            <View
              className="items-center justify-center"
              style={{
                width: '100%',
                height: '100%',
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
              style={{
                color: colors.primary800,
                textShadowColor: colors.primary200,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}>
              {song.title}
            </Text>
            <Text
              numberOfLines={1}
              className="mt-0.5 text-xs font-medium"
              style={{
                color: colors.primary600,
                textShadowColor: colors.primary200,
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 1,
              }}>
              {song.channelTitle}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <Index song={song} visible={modalVisible} onHide={hideContextMenu} />
    </>
  );
}
