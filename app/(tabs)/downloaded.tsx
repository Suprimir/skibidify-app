import { Feather } from '@expo/vector-icons';
import SongCard from 'components/SongCardComponents/SongCard';
import { usePlayer } from 'contexts/player';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export default function Downloaded() {
  const { songs } = useSongs();
  const { colors } = useTheme();
  const { setQueue, setShuffleQueue } = usePlayer();

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between p-4">
        <View>
          <Text className="text-4xl font-bold" style={{ color: colors.primary600 }}>
            Downloaded
          </Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary600 }}>
            {songs.length} song
            {songs.length > 1 || songs.length === 0 ? 's' : ''}
          </Text>
        </View>
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

      <FlatList
        data={songs}
        contentContainerClassName="gap-4 p-4"
        contentContainerStyle={{ paddingBottom: 96 }}
        keyExtractor={(song) => song.id ?? Math.random().toString()}
        renderItem={({ item }) => <SongCard song={item} />}
      />
    </View>
  );
}
