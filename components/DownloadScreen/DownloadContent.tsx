import { FlatList, View } from 'react-native';
import SearchBar from './SearchBar';
import SearchResultCard from './SearchResultCard';
import { useSearch } from 'contexts/search';

export default function DownloadContent() {
  const { searchItems } = useSearch();
  console.log(searchItems);
  return (
    <View className="mt-4 gap-2">
      <SearchBar />

      {searchItems.length > 0 && (
        <FlatList
          data={searchItems}
          contentContainerClassName="gap-4 pt-4"
          keyExtractor={(searchItem) => searchItem.id.videoId ?? 'xd'}
          renderItem={({ item }) => <SearchResultCard key={item.id.videoId} youtubeItem={item} />}
        />
      )}
    </View>
  );
}
