import { useTheme } from 'contexts/theme';
import { View, Text } from 'react-native';
import { ThemeAccent } from 'types/Theme';

export default function CurrentThemeBox() {
  const { mode, accent, colors } = useTheme();

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
  return (
    <View
      className="rounded-lg p-4"
      style={{
        backgroundColor: colors.primary200,
        borderColor: colors.primary300,
        borderWidth: 1,
      }}>
      <Text className="mb-1 text-sm font-medium" style={{ color: colors.primary700 }}>
        Current Theme
      </Text>
      <Text className="text-lg capitalize" style={{ color: colors.primary600 }}>
        {mode} • {getAccentDisplayName(accent)}
      </Text>
    </View>
  );
}
