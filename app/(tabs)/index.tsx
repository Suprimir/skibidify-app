import HomeContent from 'components/HomeScreen/HomeContent';
import { useTheme } from 'contexts/theme';
import { Text, View } from 'react-native';

export default function Index() {
  const { colors } = useTheme();

  return (
    <View>
      <Text className="px-4 pt-4 text-4xl font-bold" style={{ color: colors.primary800 }}>
        Home
      </Text>
      <Text className="mb-3 px-4 text-lg font-medium" style={{ color: colors.primary600 }}>
        Welcome
      </Text>

      <HomeContent />
    </View>
  );
}
