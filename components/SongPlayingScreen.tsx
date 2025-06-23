import { Feather } from '@expo/vector-icons';
import { usePlayer } from 'contexts/player';
import { useTheme } from 'contexts/theme';
import Slider from '@react-native-community/slider';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function SongPlayingScreen() {
  const {
    songPlaying,
    currentTime,
    duration,
    handlePause,
    handleSeek,
    paused,
    playNext,
    playPrev,
  } = usePlayer();
  const { colors } = useTheme();
  const router = useRouter();

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!songPlaying) {
      router.push('/');
    }
  }, [songPlaying, router]);

  if (!songPlaying) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text style={{ color: colors.primary500 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center space-y-6 px-4">
      <View
        className="h-80 w-80 items-center justify-center overflow-hidden rounded-xl border"
        style={{ borderColor: colors.primary200 }}>
        <Image
          src={songPlaying.thumbnail}
          alt={`${songPlaying.title} thumbnail`}
          className="h-96 w-96 rounded-xl object-cover object-center"
        />
      </View>

      <View className="w-full items-center">
        <Text className="text-center text-base font-semibold" style={{ color: colors.primary500 }}>
          {songPlaying.title}
        </Text>
        <Text className="text-sm" style={{ color: colors.primary300 }}>
          {songPlaying.channelTitle}
        </Text>
      </View>

      <View className="w-full">
        <Slider
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={handleSeek}
          minimumTrackTintColor={colors.primary400}
          maximumTrackTintColor={colors.primary200}
          thumbTintColor={colors.primary400}
        />
        <View className="mt-1 flex-row justify-between px-1">
          <Text className="text-xs text-gray-400">{formatTime(currentTime)}</Text>
          <Text className="text-xs text-gray-400">{formatTime(duration)}</Text>
        </View>
      </View>

      <View className="flex-row gap-4">
        <TouchableOpacity activeOpacity={0.7} onPress={playPrev}>
          <View className="rounded-full p-3" style={{ backgroundColor: colors.primary200 }}>
            <Feather name="arrow-left" color={colors.primary400} size={28} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={handlePause}>
          <View className="rounded-full p-3" style={{ backgroundColor: colors.primary200 }}>
            <Feather name={paused ? 'play' : 'pause'} color={colors.primary400} size={28} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={playNext}>
          <View className="rounded-full p-3" style={{ backgroundColor: colors.primary200 }}>
            <Feather name="arrow-right" color={colors.primary400} size={28} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
