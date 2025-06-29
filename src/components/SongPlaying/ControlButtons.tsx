import { View, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { usePlayer } from '../../../contexts/player';
import { useTheme } from '../../../contexts/theme';

export default function ControlButtons() {
  const { handlePause, paused, playNext, playPrev } = usePlayer();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    button: {
      borderRadius: 9999, // rounded-full
      padding: 12, // p-3
      backgroundColor: colors.primary200,
    },
    prevButton: {
      borderRadius: 9999,
      padding: 12,
      backgroundColor: colors.primary200,
    },
  });

  return (
    <View style={styles.container}>
      <Pressable onPress={playPrev}>
        <View style={styles.prevButton}>
          <Icon name="arrow-left" color={colors.primary400} size={32} />
        </View>
      </Pressable>
      <Pressable onPress={handlePause}>
        <View style={styles.button}>
          <Icon
            name={paused ? 'play-circle' : 'pause-circle'}
            color={colors.primary400}
            size={44}
          />
        </View>
      </Pressable>
      <Pressable onPress={playNext}>
        <View style={styles.button}>
          <Icon name="arrow-right" color={colors.primary400} size={32} />
        </View>
      </Pressable>
    </View>
  );
}
