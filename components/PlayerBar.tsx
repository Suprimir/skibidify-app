import { usePlayer } from 'contexts/player';
import { View, Image, Text, Pressable, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { useRouter } from 'expo-router';

export default function PlayerBar() {
  const { songPlaying, handlePause, paused } = usePlayer();
  const { colors } = useTheme();
  const router = useRouter();

  if (!songPlaying) return null;

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/songplaying')}>
      <View
        className="m-2 flex-row items-center justify-between rounded-lg border px-4 py-2"
        style={{ backgroundColor: colors.primary100, borderColor: colors.primary200 }}>
        <Image source={{ uri: songPlaying.thumbnail }} className="h-12 w-12 rounded-md" />

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
    </TouchableOpacity>
  );
}
