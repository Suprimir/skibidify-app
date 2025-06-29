import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '../../contexts/theme';
import SongCard from '../components/SongCard/SongCard';
import PlaylistLargeCard from '../components/PlaylistCard/PlaylistLargeCard';
import { useSongs } from '../../contexts/song';

export default function HomeScreen() {
  const { songs, playlists } = useSongs();
  const { colors } = useTheme();

  const recentSongs = [...songs]
    .sort((a, b) => Number(b.addedAt) - Number(a.addedAt))
    .slice(0, 4);

  const songPairs = [];
  for (let i = 0; i < recentSongs.length; i += 2) {
    songPairs.push(recentSongs.slice(i, i + 2));
  }

  const playlistPairs = [];
  for (let i = 0; i < playlists.length; i += 2) {
    playlistPairs.push(playlists.slice(i, i + 2));
  }

  return (
    <View>
      <Text style={[styles.title, { color: colors.primary800 }]}>Home</Text>
      <Text style={[styles.welcome, { color: colors.primary600 }]}>
        Welcome
      </Text>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {recentSongs.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.primary500 }]}>
              Recently Added
            </Text>
            <View style={styles.contentContainer}>
              {songPairs.map((pair, index) => (
                <View key={index} style={styles.pairRow}>
                  {pair.map((song, innerIndex) => (
                    <View key={song.id || innerIndex} style={styles.halfWidth}>
                      <SongCard song={song} />
                    </View>
                  ))}
                  {pair.length < 2 && <View style={styles.halfWidth} />}
                </View>
              ))}
            </View>
          </>
        )}

        {playlists.length > 0 && (
          <>
            <Text style={[styles.playlistTitle, { color: colors.primary500 }]}>
              Playlists
            </Text>
            <View style={styles.contentContainer}>
              {playlistPairs.map((pair, index) => (
                <View key={index} style={styles.playlistRow}>
                  {pair.map((playlist, innerIndex) => (
                    <PlaylistLargeCard
                      key={playlist.id || innerIndex}
                      playlist={playlist}
                    />
                  ))}
                  {pair.length < 2 && <View style={styles.halfWidth} />}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 16,
    paddingTop: 16,
    fontSize: 36,
    fontWeight: 'bold',
  },
  welcome: {
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 180,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  contentContainer: {
    marginTop: 8,
    gap: 16,
  },
  pairRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 12,
  },
  playlistRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  halfWidth: {
    width: '50%',
  },
  playlistTitle: {
    marginTop: 32,
    fontWeight: '600',
  },
});
