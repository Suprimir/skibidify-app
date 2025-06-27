import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { View, Text, TouchableOpacity } from 'react-native';

interface SimpleCardProps {
  text: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}

export default function SimpleCard({ text, icon, onPress }: SimpleCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        className="group w-full flex-row rounded-xl border p-2"
        style={{
          backgroundColor: colors.primary100,
          borderColor: colors.primary300,
          minHeight: 76,
        }}>
        <View style={{ width: '30%', maxWidth: 60, height: 60 }}>
          <View
            className="items-center justify-center"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.primary200,
              backgroundColor: colors.primary200,
            }}>
            <Feather name={icon} size={32} color={colors.primary600} />
          </View>
        </View>

        <View className="ms-4 flex-1 justify-center">
          <Text
            numberOfLines={1}
            className="text-lg font-bold leading-tight"
            style={{
              color: colors.primary800,
              textShadowColor: colors.primary200,
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}>
            {text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
