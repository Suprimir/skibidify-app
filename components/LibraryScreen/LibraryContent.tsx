import { View, Text, FlatList } from 'react-native';
import PlaylistCard from './PlaylistCard';
import { useRouter } from 'expo-router';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';

export default function LibraryContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { createPlaylist, playlists } = useSongs();

  return (
    <View className="mt-4 gap-2">
      <PlaylistCard text="New Playlist" icon="plus" onPress={createPlaylist} />
      <PlaylistCard text="Downloads" icon="download" onPress={() => router.push('/downloaded')} />
      <View className="flex-row items-center">
        <View className="h-px flex-1" style={{ backgroundColor: colors.primary300 }} />
        <Text className="mx-4 text-sm font-medium opacity-60" style={{ color: colors.primary500 }}>
          YOUR PLAYLISTS
        </Text>
        <View className="h-px flex-1" style={{ backgroundColor: colors.primary300 }} />
      </View>
      <FlatList
        data={playlists}
        contentContainerClassName="gap-2"
        keyExtractor={(playlist) => playlist.id}
        renderItem={({ item }) => (
          <PlaylistCard
            text={item.name}
            icon="music"
            onPress={() => router.push(`/playlist?id=${item.id}`)}
          />
        )}
      />
    </View>
  );
}
