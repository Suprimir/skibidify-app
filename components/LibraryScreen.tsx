import { Feather } from '@expo/vector-icons';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaylistCard from './PlaylistCard';

export default function LibraryScreen() {
  const { colors } = useTheme();
  const { createPlaylist, playlists } = useSongs();
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 px-4">
      <Text className="text-4xl font-bold" style={{ color: colors.primary600 }}>
        Library
      </Text>
      <Text className="mb-4 text-xl opacity-75" style={{ color: colors.primary500 }}>
        Manage your music
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={() => createPlaylist()}>
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
            <Feather name="plus" size={32} color={colors.primary200} />
          </View>
          <View
            className="flex-1 justify-center rounded-r-lg p-4"
            style={{ backgroundColor: colors.primary100 }}>
            <Text className="text-xl font-bold" style={{ color: colors.primary400 }}>
              New playlist
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/downloaded')}>
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
            <Feather name="download" size={32} color={colors.primary200} />
          </View>
          <View
            className="flex-1 justify-center rounded-r-lg p-4"
            style={{ backgroundColor: colors.primary100 }}>
            <Text className="text-xl font-bold" style={{ color: colors.primary400 }}>
              Descargas
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View className="mb-2 flex-row items-center">
        <View className="h-px flex-1" style={{ backgroundColor: colors.primary300 }} />
        <Text className="mx-4 text-sm font-medium opacity-60" style={{ color: colors.primary500 }}>
          YOUR PLAYLISTS
        </Text>
        <View className="h-px flex-1" style={{ backgroundColor: colors.primary300 }} />
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(playlist) => playlist.id}
        renderItem={({ item }) => <PlaylistCard playlist={item} />}
      />
    </SafeAreaView>
  );
}
