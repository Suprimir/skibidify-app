import Feather from '@expo/vector-icons/Feather';
import { useSearch } from 'contexts/search';
import { useTheme } from 'contexts/theme';
import { useYoutube } from 'hooks/useYoutube';
import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Index from './Modals/Index';

export default function SearchBar() {
  const { colors } = useTheme();
  const { searchSongs } = useYoutube();
  const { setSearchItems } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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
    <>
      <View className="flex-row gap-2">
        <View
          style={{
            backgroundColor: colors.primary100,
            borderColor: colors.primary300,
          }}
          className="flex-1 flex-row items-center rounded-full border px-5 py-2">
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
        <Pressable
          className="rounded-full p-4"
          onPress={() => setModalVisible(true)}
          style={{
            backgroundColor: colors.primary500,
          }}>
          <Feather name="link" size={24} style={{ color: colors.primary200 }} />
        </Pressable>
      </View>

      <Index visible={modalVisible} onHide={() => setModalVisible(false)} />
    </>
  );
}
