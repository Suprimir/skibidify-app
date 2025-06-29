import { useSongs } from '../../contexts/song';
import { useTheme } from '../../contexts/theme';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { usePlayer } from '../../contexts/player';
import { useState } from 'react';
import SongCard from '../components/SongCard/SongCard';
import EditPlaylist from '../components/PlaylistCard/Modals/EditPlaylist';
import { useRoute } from '@react-navigation/native';

export default function PlaylistScreen() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { colors } = useTheme();
  const { playlists, songs } = useSongs();
  const { setQueue, setShuffleQueue } = usePlayer();
  const route = useRoute();
  const { playlistId } = route.params as { playlistId: string };

  const playlist = playlists.find(playlist => playlist.id === playlistId);

  if (!playlist)
    return (
      <View>
        <Text>No existe la playlist</Text>
      </View>
    );

  const playlistSongs = songs.filter(song => playlist.songs.includes(song.id));

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Pressable onPress={() => setModalVisible(true)}>
              <Text
                numberOfLines={1}
                style={[styles.playlistTitle, { color: colors.primary600 }]}
              >
                {playlist.name}
              </Text>
            </Pressable>
            <Text style={[styles.songCount, { color: colors.primary600 }]}>
              {playlistSongs.length} song
              {playlistSongs.length > 1 || playlistSongs.length === 0
                ? 's'
                : ''}
            </Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setQueue(playlistSongs)}
            >
              <View
                style={[
                  styles.shuffleButton,
                  { backgroundColor: colors.primary300 },
                ]}
              >
                <Icon name="shuffle" size={24} color={colors.primary600} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShuffleQueue(playlistSongs)}
            >
              <View
                style={[
                  styles.playButton,
                  { backgroundColor: colors.primary500 },
                ]}
              >
                <Icon name="play" size={24} color={colors.primary200} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={playlistSongs}
          contentContainerStyle={styles.flatListContent}
          keyExtractor={song => song.id ?? Math.random().toString()}
          renderItem={({ item }) => <SongCard song={item} />}
        />
      </View>

      <EditPlaylist
        playlist={playlist}
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  playlistTitle: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  songCount: {
    fontSize: 18,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shuffleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  flatListContent: {
    gap: 16,
    padding: 16,
    paddingBottom: 172,
  },
});
