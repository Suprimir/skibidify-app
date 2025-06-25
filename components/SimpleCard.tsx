import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Pressable } from 'react-native';

interface SimpleCardProps {
  text: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}

export default function SimpleCard({ text, icon, onPress }: SimpleCardProps) {
  const { colors } = useTheme();

  return (
    <>
      <Pressable
        onPress={() => onPress()}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}>
        <View
          className="mb-2 flex-row rounded-lg"
          style={{
            shadowColor: colors.primary600,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}>
          <View className="rounded-l-lg p-4" style={{ backgroundColor: colors.primary400 }}>
            <Feather name={icon} size={32} color={colors.primary100} />
          </View>
          <View
            className="flex-1 justify-center rounded-r-lg p-4"
            style={{ backgroundColor: colors.primary200 }}>
            <Text className="text-xl font-bold" style={{ color: colors.primary600 }}>
              {text}
            </Text>
          </View>
        </View>
      </Pressable>
    </>
  );
}
