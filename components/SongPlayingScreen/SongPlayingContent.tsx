import { usePlayer } from 'contexts/player';
import { useTheme } from 'contexts/theme';
import { Image, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import ControlButtons from './ControlButtons';
import ControlSlider from './ControlSlider';

export default function SongPlayingContent() {
  const { songPlaying } = usePlayer();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!songPlaying) {
      router.push('/');
    }
  }, [songPlaying, router]);

  if (!songPlaying) {
    return (
      <View className="items-center justify-center">
        <Text style={{ color: colors.primary500 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="h-[85vh] items-center justify-center">
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
  );
}
