import { useTheme } from 'contexts/theme';
import { useCallback, useState } from 'react';
import { Text, Pressable, InteractionManager } from 'react-native';

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
      className="rounded-lg px-4 py-3"
      style={{
        backgroundColor: colors.primary200,
        opacity: isChangingTheme ? 0.5 : 1,
        shadowColor: colors.primary600,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      }}>
      <Text className="text-center font-medium" style={{ color: colors.primary600 }}>
        {mode === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
      </Text>
    </Pressable>
  );
}
