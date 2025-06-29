import { useTheme } from '../../../contexts/theme';
import { View, Text } from 'react-native';
import { ThemeAccent } from '../../../types/Theme';

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
      style={{
        backgroundColor: colors.primary200,
        borderColor: colors.primary300,
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
      }}
    >
      <Text
        style={{
          color: colors.primary700,
          marginBottom: 1,
          fontSize: 14,
          fontWeight: '200',
        }}
      >
        Current Theme
      </Text>
      <Text
        style={{
          color: colors.primary600,
          fontSize: 18,
          textTransform: 'capitalize',
        }}
      >
        {mode} • {getAccentDisplayName(accent)}
      </Text>
    </View>
  );
}
