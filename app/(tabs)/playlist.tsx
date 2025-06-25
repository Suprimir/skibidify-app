import { useSongs } from 'contexts/song';
import { useTheme } from 'contexts/theme';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { usePlayer } from 'contexts/player';
import SongCard from 'components/SongCardComponents/SongCard';

export default function Playlist() {
  const { colors } = useTheme();
  const { playlists, songs } = useSongs();
  const { setQueue, setShuffleQueue } = usePlayer();
  const { id } = useLocalSearchParams();

  const playlist = playlists.find((playlist) => playlist.id === id);

  if (!playlist)
    return (
      <View>
        <Text>No existe la playlist</Text>
      </View>
    );

  const playlistSongs = songs.filter((song) => playlist.songs.includes(song.id));

  return (
    <View className="flex-1">
      <View className="flex-row items-center justify-between p-4">
        <View>
          <Text className="text-4xl font-bold" style={{ color: colors.primary600 }}>
            {playlist.name}
          </Text>
          <Text className="text-lg font-medium" style={{ color: colors.primary600 }}>
            {playlistSongs.length} song
            {playlistSongs.length > 1 || playlistSongs.length === 0 ? 's' : ''}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity activeOpacity={0.7} onPress={() => setQueue(playlistSongs)}>
            <View
              className="items-center justify-center rounded-full px-3 py-1"
              style={{ backgroundColor: colors.primary300 }}>
              <Feather name="shuffle" size={24} color={colors.primary600} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShuffleQueue(playlistSongs)}>
            <View
              className="items-center justify-center rounded-full px-4 py-2"
              style={{ backgroundColor: colors.primary500 }}>
              <Feather name="play" size={24} color={colors.primary200} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={playlistSongs}
        contentContainerClassName="gap-4 p-4"
        contentContainerStyle={{ paddingBottom: 172 }}
        keyExtractor={(song) => song.id ?? Math.random().toString()}
        renderItem={({ item }) => <SongCard song={item} />}
      />
    </View>
  );
}
