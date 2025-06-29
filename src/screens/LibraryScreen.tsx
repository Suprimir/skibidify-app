import { View, Text, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '../../contexts/theme';
import { useSongs } from '../../contexts/song';
import { useNavigation } from '@react-navigation/native';
import PlaylistCard from '../components/PlaylistCard/PlaylistCard';
import SimpleCard from '../components/Library/SimpleCard';

export default function LibraryScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { createPlaylist, playlists } = useSongs();

  return (
    <View>
      <Text style={[styles.title, { color: colors.primary800 }]}>Library</Text>
      <Text style={[styles.subtitle, { color: colors.primary600 }]}>
        Manage your music
      </Text>

      <View style={styles.mainContainer}>
        <View style={styles.cardsContainer}>
          <SimpleCard
            text="New Playlist"
            icon="plus"
            onPress={() => createPlaylist()}
          />
          <SimpleCard
            text="Downloads"
            icon="download"
            onPress={() => navigation.navigate('Downloads')}
          />
        </View>

        <View style={styles.dividerContainer}>
          <View
            style={[styles.dividerLine, { backgroundColor: colors.primary600 }]}
          />
          <Text style={[styles.dividerText, { color: colors.primary600 }]}>
            YOUR PLAYLISTS
          </Text>
          <View
            style={[styles.dividerLine, { backgroundColor: colors.primary300 }]}
          />
        </View>

        {playlists.length > 0 && (
          <FlatList
            data={playlists}
            contentContainerStyle={styles.flatListContent}
            keyExtractor={playlist => playlist.id}
            renderItem={({ item }) => (
              <PlaylistCard
                playlist={item}
                icon="music"
                onPress={() =>
                  navigation.navigate('Playlist', {
                    playlistId: item.id,
                  })
                }
              />
            )}
          />
        )}
      </View>
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
  subtitle: {
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  mainContainer: {
    marginTop: 16,
    gap: 8,
  },
  cardsContainer: {
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dividerLine: {
    height: 1,
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  },
  flatListContent: {
    gap: 16,
    padding: 16,
  },
});
