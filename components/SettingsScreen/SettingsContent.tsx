import { View, Text } from 'react-native';
import ThemeModeButton from './ThemeModeButton';
import ThemeAccentButton from './ThemeAccentButton';
import CurrentThemeBox from './CurrentThemeBox';
import ServicesInput from './ServicesInput';
import { ThemeAccent } from 'types/Theme';
import { useTheme } from 'contexts/theme';

export default function SettingsContent() {
  const { colors } = useTheme();

  const accents: ThemeAccent[] = ['default', 'pink', 'green'];

  return (
    <View className="mt-4 gap-6">
      <ThemeModeButton />

      <View>
        <Text className="mb-2 text-lg font-medium" style={{ color: colors.primary600 }}>
          Color Themes
        </Text>
        <View className="flex-row flex-wrap gap-4">
          {accents.map((colorScheme, index) => (
            <ThemeAccentButton key={index} colorScheme={colorScheme} />
          ))}
        </View>
      </View>

      <CurrentThemeBox />

      <View>
        <Text className="mb-2 text-lg font-semibold" style={{ color: colors.primary600 }}>
          Services
        </Text>
        <ServicesInput serviceName="YOUTUBE_API_KEY" icon="key" sensitive />
      </View>
      <View>
        <Text className="mb-2 text-lg font-semibold" style={{ color: colors.primary600 }}>
          API Server
        </Text>
        <ServicesInput serviceName="API_BASE_URL" icon="server" />
      </View>
    </View>
  );
}
