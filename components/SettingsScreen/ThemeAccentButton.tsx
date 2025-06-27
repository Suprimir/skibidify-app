import { useTheme } from 'contexts/theme';
import { useCallback, useState } from 'react';
import { View, Text, Pressable, InteractionManager } from 'react-native';
import { ThemeAccent } from 'types/Theme';

interface ColorSchemeButtonProps {
  colorScheme: ThemeAccent;
}

export default function ThemeAccentButton({ colorScheme }: ColorSchemeButtonProps) {
  const { setAccent, mode, accent, colors } = useTheme();
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  const accentPreviewColors: Record<ThemeAccent, { light: string[]; dark: string[] }> = {
    default: {
      light: ['#f8fafc', '#e2e8f0', '#64748b', '#334155'],
      dark: ['#334155', '#475569', '#64748b', '#94a3b8'],
    },
    pink: {
      light: ['#fdf2f8', '#fbcfe8', '#ec4899', '#be185d'],
      dark: ['#500724', '#9d174d', '#ec4899', '#f9a8d4'],
    },
    green: {
      light: ['#f0fdf4', '#bbf7d0', '#22c55e', '#15803d'],
      dark: ['#052e16', '#166534', '#22c55e', '#86efac'],
    },
  };

  const handleAccentChange = useCallback(
    (newAccent: ThemeAccent) => {
      if (isChangingTheme) return;

      setIsChangingTheme(true);

      InteractionManager.runAfterInteractions(() => {
        setAccent(newAccent);

        setTimeout(() => {
          setIsChangingTheme(false);
        }, 100);
      });
    },
    [setAccent, isChangingTheme]
  );

  const getAccentDisplayName = (accentName: ThemeAccent) => {
    switch (accentName) {
      case 'default':
        return 'Slate';
      case 'pink':
        return 'Pink';
      case 'green':
        return 'Green';
      default:
        return accentName;
    }
  };

  const currentColors = accentPreviewColors[colorScheme][mode];
  const isSelected = accent === colorScheme;

  return (
    <View key={colorScheme} className="items-center">
      <Pressable
        onPress={() => handleAccentChange(colorScheme)}
        disabled={isChangingTheme}
        className="h-20 w-20 rounded-xl p-1"
        style={{
          borderWidth: 2,
          borderColor: isSelected ? colors.primary500 : colors.border,
          transform: [{ scale: isSelected ? 1.05 : 1 }],
          opacity: isChangingTheme ? 0.5 : 1,
        }}>
        <View className="flex h-full w-full flex-col overflow-hidden rounded-lg">
          <View className="flex-1 flex-row">
            <View className="h-full w-1/2" style={{ backgroundColor: currentColors[0] }} />
            <View className="h-full w-1/2" style={{ backgroundColor: currentColors[1] }} />
          </View>
          <View className="flex-1 flex-row">
            <View className="h-full w-1/2" style={{ backgroundColor: currentColors[2] }} />
            <View className="h-full w-1/2" style={{ backgroundColor: currentColors[3] }} />
          </View>
        </View>
      </Pressable>

      <Text className="mt-2 text-center text-xs font-medium" style={{ color: colors.primary600 }}>
        {getAccentDisplayName(colorScheme)}
      </Text>
    </View>
  );
}
