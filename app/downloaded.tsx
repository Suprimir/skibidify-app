import { Feather } from '@expo/vector-icons';
import SongCard from 'components/SongCard';
import { usePlayer } from 'contexts/player';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Downloaded() {
  const { songs } = useSongs();
  const { colors } = useTheme();
  const { setQueue, setShuffleQueue } = usePlayer();

  return (
    <SafeAreaView className="flex-1 px-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="mb-4 text-4xl font-bold" style={{ color: colors.primary600 }}>
          Descargas
        </Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity activeOpacity={0.7} onPress={() => setQueue(songs)}>
            <View
              className="items-center justify-center rounded-full px-3 py-1"
              style={{ backgroundColor: colors.primary300 }}>
              <Feather name="shuffle" size={24} color={colors.primary600} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShuffleQueue(songs)}>
            <View
              className="items-center justify-center rounded-full px-4 py-2"
              style={{ backgroundColor: colors.primary500 }}>
              <Feather name="play" size={24} color={colors.primary200} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className="space-y-2 pb-8 sm:space-y-4">
        <FlatList
          data={songs}
          keyExtractor={(song) => song.id ?? Math.random().toString()}
          renderItem={({ item }) => (
            <View className="mb-4">
              <SongCard song={item} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
