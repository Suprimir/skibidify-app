import Feather from '@expo/vector-icons/Feather';
import { useSearch } from 'contexts/search';
import { useTheme } from 'contexts/theme';
import { useYoutube } from 'hooks/useYoutube';
import { useState } from 'react';
import { View, TextInput } from 'react-native';

export default function SearchBar() {
  const { colors } = useTheme();
  const { searchSongs } = useYoutube();
  const { setSearchItems } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const data = await searchSongs(searchTerm);

      if (!data) return;
      setSearchItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.primary200,
        borderColor: colors.primary300,
        shadowColor: colors.primary600,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      }}
      className="flex flex-row items-center rounded-full border px-5 py-2">
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
  );
}
