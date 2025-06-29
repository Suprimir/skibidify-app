import { useTheme } from '../../../contexts/theme';
import { useCallback, useState } from 'react';
import { Text, Pressable, InteractionManager, StyleSheet } from 'react-native';

export default function ThemeModeButton() {
  const { toggleMode, mode, colors } = useTheme();
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  const handleModeToggle = useCallback(() => {
    if (isChangingTheme) return;

    setIsChangingTheme(true);

    InteractionManager.runAfterInteractions(() => {
      toggleMode();

      setTimeout(() => {
        setIsChangingTheme(false);
      }, 100);
    });
  }, [toggleMode, isChangingTheme]);

  return (
    <Pressable
      onPress={handleModeToggle}
      disabled={isChangingTheme}
      style={[styles.pressable, { backgroundColor: colors.primary200 }]}
    >
      <Text style={[styles.text, { color: colors.primary600 }]}>
        {mode === 'light'
          ? '🌙 Switch to Dark Mode'
          : '☀️ Switch to Light Mode'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    textAlign: 'center',
    fontWeight: '500',
  },
});
