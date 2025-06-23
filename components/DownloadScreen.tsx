import { View, TextInput, Pressable, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchResultCard from './SearchResultCard'; // asegúrate de que la ruta es correcta
import type { YouTubeSearchItem } from 'types/YoutubeSearch';
import { useYoutube } from 'hooks/useYoutube';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'contexts/theme/ThemeProvider';

export default function DownloadScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{ items: YouTubeSearchItem[] } | null>(null);
  const { colors } = useTheme();
  const { searchSongs } = useYoutube();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const data = await searchSongs(searchTerm);
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView className="flex-1 px-4">
      <View
        style={{ backgroundColor: colors.primary200, borderColor: colors.primary300 }}
        className="mb-4 flex flex-row items-center rounded-full border px-5 py-2">
        <Feather name="search" size={24} style={{ color: colors.primary600 }} />
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          className="ml-4 flex-1 bg-transparent py-2 pr-4 text-lg font-medium"
          placeholderTextColor={colors.primary600}
          style={{ color: colors.primary800 }}
          placeholder="Search songs..."
          returnKeyType="search"
        />
      </View>

      {results && (
        <FlatList
          data={results.items}
          keyExtractor={(item) => item.id?.videoId ?? Math.random().toString()}
          renderItem={({ item }) => (
            <View className="mb-4">
              <SearchResultCard youtubeItem={item} />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
