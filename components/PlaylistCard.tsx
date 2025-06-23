import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'contexts/theme';
import { Playlist } from 'types/Song';

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity activeOpacity={0.7}>
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
          <Feather name="book-open" size={32} color={colors.primary200} />
        </View>
        <View
          className="flex-1 justify-center rounded-r-lg p-4"
          style={{ backgroundColor: colors.primary100 }}>
          <Text className="text-xl font-bold" style={{ color: colors.primary400 }}>
            {playlist.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
