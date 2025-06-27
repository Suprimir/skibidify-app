import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { usePlayer } from 'contexts/player';
import { useTheme } from 'contexts/theme';
import { useState, useEffect, useRef } from 'react';

export default function ControlSlider() {
  const { currentTime, duration, handleSeek } = usePlayer();
  const { colors } = useTheme();
  const [sliderValue, setSliderValue] = useState(0);
  const isSeeking = useRef(false);

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isSeeking.current) {
      setSliderValue(currentTime || 0);
    }
  }, [currentTime]);

  const onSlidingStart = () => {
    isSeeking.current = true;
  };

  const onValueChange = (value: number) => {
    setSliderValue(value);
  };

  const onSlidingComplete = (value: number) => {
    isSeeking.current = false;
    handleSeek(value);
  };

  return (
    <View className="w-full">
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 10,
          width: '100%',
        }}>
        <Slider
          style={{ width: '100%' }}
          value={sliderValue}
          minimumValue={0}
          maximumValue={duration > 0 ? duration : 1}
          onSlidingStart={onSlidingStart}
          onValueChange={onValueChange}
          onSlidingComplete={onSlidingComplete}
          minimumTrackTintColor={colors.primary400}
          maximumTrackTintColor={colors.primary200}
          thumbTintColor={colors.primary400}
        />
      </View>
      <View className="mt-1 flex-row justify-between px-1">
        <Text className="text-xs text-gray-400">{formatTime(currentTime || 0)}</Text>
        <Text className="text-xs text-gray-400">{formatTime(duration || 0)}</Text>
      </View>
    </View>
  );
}
