import { useTheme } from '../../../contexts/theme';
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  InteractionManager,
  StyleSheet,
} from 'react-native';
import { ThemeAccent } from '../../../types/Theme';

interface ColorSchemeButtonProps {
  colorScheme: ThemeAccent;
}

export default function ThemeAccentButton({
  colorScheme,
}: ColorSchemeButtonProps) {
  const { setAccent, mode, accent, colors } = useTheme();
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  const accentPreviewColors: Record<
    ThemeAccent,
    { light: string[]; dark: string[] }
  > = {
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
    [setAccent, isChangingTheme],
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
    <View style={styles.container}>
      <Pressable
        onPress={() => handleAccentChange(colorScheme)}
        disabled={isChangingTheme}
        style={[
          styles.pressable,
          {
            borderColor: isSelected ? colors.primary500 : colors.border,
            transform: [{ scale: isSelected ? 1.05 : 1 }],
            opacity: isChangingTheme ? 0.5 : 1,
          },
        ]}
      >
        <View style={styles.colorGrid}>
          <View style={styles.topRow}>
            <View
              style={[styles.colorBox, { backgroundColor: currentColors[0] }]}
            />
            <View
              style={[styles.colorBox, { backgroundColor: currentColors[1] }]}
            />
          </View>
          <View style={styles.bottomRow}>
            <View
              style={[styles.colorBox, { backgroundColor: currentColors[2] }]}
            />
            <View
              style={[styles.colorBox, { backgroundColor: currentColors[3] }]}
            />
          </View>
        </View>
      </Pressable>

      <Text style={[styles.label, { color: colors.primary600 }]}>
        {getAccentDisplayName(colorScheme)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pressable: {
    height: 80,
    width: 80,
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
  },
  colorGrid: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 8,
  },
  topRow: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomRow: {
    flex: 1,
    flexDirection: 'row',
  },
  colorBox: {
    height: '100%',
    width: '50%',
  },
  label: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
  },
});
