import { View, Text, FlatList } from 'react-native';
import PlaylistCard from 'components/PlaylistCardComponents/PlaylistCard';
import { useRouter } from 'expo-router';
import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import SimpleCard from 'components/LibraryScreen/SimpleCard';

export default function LibraryContent() {
  const router = useRouter();
  const { colors } = useTheme();
  const { createPlaylist, playlists } = useSongs();

  return (
    <View className="mt-4 gap-2">
      <View className="gap-2 px-4 pb-4">
        <SimpleCard text="New Playlist" icon="plus" onPress={createPlaylist} />
        <SimpleCard text="Downloads" icon="download" onPress={() => router.push('/downloaded')} />
      </View>

      <View className="flex-row items-center px-4">
        <View className="h-px flex-1" style={{ backgroundColor: colors.primary600 }} />
        <Text className="mx-4 text-sm font-medium opacity-60" style={{ color: colors.primary600 }}>
          YOUR PLAYLISTS
        </Text>
        <View className="h-px flex-1" style={{ backgroundColor: colors.primary300 }} />
      </View>

      <FlatList
        data={playlists}
        contentContainerClassName="gap-4 p-4"
        keyExtractor={(playlist) => playlist.id}
        renderItem={({ item }) => (
          <PlaylistCard
            playlist={item}
            icon="music"
            onPress={() => router.push(`/playlist?id=${item.id}`)}
          />
        )}
      />
    </View>
  );
}
