import DownloadContent from 'components/DownloadScreen/DownloadContent';
import { useTheme } from 'contexts/theme';
import { Text, View } from 'react-native';

export default function Download() {
  const { colors } = useTheme();
  return (
    <View className="flex-1">
      <Text className="px-4 pt-4 text-4xl font-bold" style={{ color: colors.primary800 }}>
        Download
      </Text>
      <Text className="mb-3 px-4 text-lg font-medium" style={{ color: colors.primary600 }}>
        Download your music using multiple services
      </Text>

      <DownloadContent />
    </View>
  );
}
