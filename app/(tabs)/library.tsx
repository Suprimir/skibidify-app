import { useTheme } from 'contexts/theme';
import { View, Text } from 'react-native';
import LibraryContent from 'components/LibraryScreen/LibraryContent';

export default function Library() {
  const { colors } = useTheme();
  return (
    <View>
      <Text className="px-4 pt-4 text-4xl font-bold" style={{ color: colors.primary800 }}>
        Library
      </Text>
      <Text className="mb-3 px-4 text-lg font-medium" style={{ color: colors.primary600 }}>
        Manage your music
      </Text>

      <LibraryContent />
    </View>
  );
}
