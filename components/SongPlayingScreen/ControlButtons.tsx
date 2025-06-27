import { View, Pressable } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { usePlayer } from 'contexts/player';
import { useTheme } from 'contexts/theme';

export default function ControlButtons() {
  const { handlePause, paused, playNext, playPrev } = usePlayer();
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center gap-4">
      <Pressable onPress={playPrev}>
        <View
          className="rounded-full p-3"
          style={{
            backgroundColor: colors.primary200,
            shadowColor: colors.primary600,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}>
          <Feather name="arrow-left" color={colors.primary400} size={32} />
        </View>
      </Pressable>
      <Pressable onPress={handlePause}>
        <View
          className="rounded-full p-3"
          style={{
            backgroundColor: colors.primary200,
          }}>
          <Feather
            name={paused ? 'play-circle' : 'pause-circle'}
            color={colors.primary400}
            size={44}
          />
        </View>
      </Pressable>
      <Pressable onPress={playNext}>
        <View
          className="rounded-full p-3"
          style={{
            backgroundColor: colors.primary200,
          }}>
          <Feather name="arrow-right" color={colors.primary400} size={32} />
        </View>
      </Pressable>
    </View>
  );
}
