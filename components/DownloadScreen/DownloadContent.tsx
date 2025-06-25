import { FlatList, View } from 'react-native';
import SearchBar from './SearchBar';
import SearchResultCard from './SearchResultCard';
import { useSearch } from 'contexts/search';

export default function DownloadContent() {
  const { searchItems } = useSearch();

  return (
    <View className="mt-4 flex-1 gap-2">
      <View className="px-4">
        <SearchBar />
      </View>

      <FlatList
        data={searchItems}
        contentContainerClassName="gap-4 p-4"
        contentContainerStyle={{ paddingBottom: 172 }}
        keyExtractor={(searchItem) => searchItem.id.videoId ?? 'xd'}
        renderItem={({ item }) => <SearchResultCard key={item.id.videoId} youtubeItem={item} />}
      />
    </View>
  );
}
