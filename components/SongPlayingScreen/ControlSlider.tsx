import { View, Text } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Slider } from 'react-native-awesome-slider';
import { usePlayer } from 'contexts/player';
import { useTheme } from 'contexts/theme';
import { useEffect } from 'react';

export default function ControlSlider() {
  const { currentTime, duration, handleSeek } = usePlayer();
  const { colors } = useTheme();

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  useEffect(() => {
    progress.value = currentTime;
  }, [currentTime]);

  useEffect(() => {
    max.value = duration > 0 ? duration : 1;
  }, [duration]);

  return (
    <View className="w-full">
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          width: '100%',
        }}>
        <Slider
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          onSlidingComplete={(value) => handleSeek(value)}
          theme={{
            disableMinTrackTintColor: colors.primary200,
            maximumTrackTintColor: colors.primary200,
            minimumTrackTintColor: colors.primary400,
            cacheTrackTintColor: colors.primary300,
            bubbleBackgroundColor: colors.primary400,
          }}
          containerStyle={{
            width: '100%',
          }}
          renderBubble={() => null}
        />
      </View>
      <View className="mt-1 flex-row justify-between px-1">
        <Text className="text-xs text-gray-400">{formatTime(currentTime)}</Text>
        <Text className="text-xs text-gray-400">{formatTime(duration)}</Text>
      </View>
    </View>
  );
}
