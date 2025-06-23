import { useSongs } from 'contexts/song';
import SongCard from './SongCard';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from 'contexts/theme/ThemeProvider';
export default function HomePage() {
  const { songs } = useSongs();
  const { colors } = useTheme();
  return (
    <View className="w-full p-4">
      <Text
        className="mb-4 border-b-2 text-2xl font-bold"
        style={{ color: colors.primary600, borderColor: colors.primary300 }}>
        Recently Added
      </Text>

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
    </View>
  );
}
