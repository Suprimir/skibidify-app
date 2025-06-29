import { View, Text, FlatList, StyleSheet } from 'react-native';
import React from 'react';
import SearchResultCard from '../components/Download/SearchResultCard';
import SearchBar from '../components/Download/SearchBar';
import { useTheme } from '../../contexts/theme';
import { useSearch } from '../../contexts/search';

export default function DownloadScreen() {
  const { colors } = useTheme();
  const { searchItems } = useSearch();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary800 }]}>Download</Text>
      <Text style={[styles.subtitle, { color: colors.primary600 }]}>
        Download your music using multiple services
      </Text>

      <View style={styles.contentContainer}>
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>

        <FlatList
          data={searchItems}
          contentContainerStyle={styles.flatListContainer}
          keyExtractor={searchItem => searchItem.id}
          renderItem={({ item }) => (
            <SearchResultCard key={item.id} youtubeItem={item} />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  contentContainer: {
    marginTop: 16,
    flex: 1,
    gap: 8,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
  },
  flatListContainer: {
    gap: 16,
    padding: 16,
    paddingBottom: 172,
  },
});
