import Icon from 'react-native-vector-icons/Feather';
import { usePlayer } from '../../contexts/player';
import { useSongs } from '../../contexts/song';
import { useTheme } from '../../contexts/theme';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SongCard from '../components/SongCard/SongCard';

export default function DownloadsScreen() {
  const { songs } = useSongs();
  const { colors } = useTheme();
  const { setQueue, setShuffleQueue } = usePlayer();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.primary600 }]}>
            Downloaded
          </Text>
          <Text style={[styles.songCount, { color: colors.primary600 }]}>
            {songs.length} song
            {songs.length > 1 || songs.length === 0 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setQueue(songs)}>
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
            onPress={() => setShuffleQueue(songs)}
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
        data={songs}
        contentContainerStyle={styles.flatListContent}
        keyExtractor={song => song.id ?? Math.random().toString()}
        renderItem={({ item }) => <SongCard song={item} />}
      />
    </View>
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
  title: {
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
    paddingBottom: 96,
  },
});
