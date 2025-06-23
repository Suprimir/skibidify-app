import type { Song } from '../types/Song';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { usePlayer } from 'contexts/player';

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const { colors } = useTheme();
  const { handlePlay } = usePlayer();
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => handlePlay(song)}>
      <View
        className="group w-full cursor-pointer flex-row rounded-xl border p-3"
        style={{ backgroundColor: colors.primary100, borderColor: colors.primary200 }}>
        <View
          className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border"
          style={{ borderColor: colors.primary200 }}>
          <Image
            src={song.thumbnail}
            alt={`${song.title} thumbnail`}
            className="h-28 w-28 rounded-xl object-cover object-center"
          />
        </View>

        <View className="ms-4 flex-1 justify-center">
          <Text
            className="truncate text-sm font-bold leading-tight"
            style={{ color: colors.primary800 }}>
            {song.title}
          </Text>
          <Text
            className="mt-0.5 truncate text-xs font-medium"
            style={{ color: colors.primary600 }}>
            {song.channelTitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
