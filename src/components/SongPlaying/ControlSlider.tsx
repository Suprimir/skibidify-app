import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { usePlayer } from '../../../contexts/player';
import { useTheme } from '../../../contexts/theme';
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

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    sliderContainer: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      width: '100%',
    },
    slider: {
      width: '100%',
    },
    timeContainer: {
      marginTop: 4, // mt-1
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 4, // px-1
    },
    timeText: {
      fontSize: 12, // text-xs
      color: '#9ca3af', // text-gray-400
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
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
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime || 0)}</Text>
        <Text style={styles.timeText}>{formatTime(duration || 0)}</Text>
      </View>
    </View>
  );
}
