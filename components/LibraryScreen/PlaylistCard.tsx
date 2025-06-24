import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, Pressable } from 'react-native';

interface PlaylistCardProps {
  text: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}

export default function PlaylistCard({ text, icon, onPress }: PlaylistCardProps) {
  const { colors } = useTheme();

  return (
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
        <View className="p-4">
          <LinearGradient
            colors={[colors.primary400, colors.primary300]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0"
            style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
          />
          <Feather name={icon} size={32} color={colors.primary200} />
        </View>
        <View
          className="flex-1 justify-center rounded-r-lg p-4"
          style={{ backgroundColor: colors.primary100 }}>
          <Text className="text-xl font-bold" style={{ color: colors.primary400 }}>
            {text}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
