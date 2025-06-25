import { useSongs } from 'contexts/song';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useTheme } from 'contexts/theme/ThemeProvider';
import SongCard from 'components/SongCardComponents/SongCard';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeContent() {
  const { songs, playlists } = useSongs();
  const { colors } = useTheme();
  const router = useRouter();

  const recentSongs = [...songs].sort((a, b) => Number(b.addedAt) - Number(a.addedAt)).slice(0, 4);

  const songPairs = [];
  for (let i = 0; i < recentSongs.length; i += 2) {
    songPairs.push(recentSongs.slice(i, i + 2));
  }

  const playlistPairs = [];
  for (let i = 0; i < playlists.length; i += 2) {
    playlistPairs.push(playlists.slice(i, i + 2));
  }

  return (
    <ScrollView
      className="px-4"
      contentContainerStyle={{
        paddingBottom: 180,
      }}>
      {recentSongs.length > 0 && (
        <>
          <Text className="font-semibold" style={{ color: colors.primary500 }}>
            Recently Added
          </Text>
          <View className="mt-2 gap-4">
            {songPairs.map((pair, index) => (
              <View key={index} className="flex-row justify-center gap-4 px-3">
                {pair.map((song, innerIndex) => (
                  <View key={song.id || innerIndex} className="w-1/2">
                    <SongCard song={song} />
                  </View>
                ))}
                {pair.length < 2 && <View className="w-1/2" />}
              </View>
            ))}
          </View>
        </>
      )}

      {playlists.length > 0 && (
        <>
          <Text className="mt-8 font-semibold" style={{ color: colors.primary500 }}>
            Playlists
          </Text>
          <View className="mt-2 gap-4">
            {playlistPairs.map((pair, index) => (
              <View key={index} className="flex-row justify-center gap-4 px-3">
                {pair.map((playlist, innerIndex) => (
                  <Pressable
                    key={playlist.id || innerIndex}
                    onPress={() => router.push(`/playlist?id=${playlist.id}`)}
                    className="w-1/2 items-center rounded-2xl border p-4"
                    style={{
                      backgroundColor: colors.primary200,
                      borderColor: colors.primary200,
                      shadowColor: colors.primary600,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      elevation: 4,
                    }}>
                    <View
                      className="rounded-xl border-2 p-6"
                      style={{ borderColor: colors.primary600 }}>
                      <Feather name="music" size={96} color={colors.primary600} />
                    </View>
                    <Text className="mt-2 font-bold" style={{ color: colors.primary600 }}>
                      {playlist.name}
                    </Text>
                    <Text className="font-bold " style={{ color: colors.primary400 }}>
                      {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                    </Text>
                  </Pressable>
                ))}
                {pair.length < 2 && <View className="w-1/2" />}
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}
