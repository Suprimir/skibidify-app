import Icon from 'react-native-vector-icons/Feather';
import { useSearch } from '../../../contexts/search';
import { useTheme } from '../../../contexts/theme';
import { useYoutube } from '../../../hooks/useYoutube';
import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
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

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 8,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 9999,
      borderWidth: 1,
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: colors.primary100,
      borderColor: colors.primary300,
    },
    textInput: {
      marginLeft: 16,
      flex: 1,
      backgroundColor: 'transparent',
      paddingVertical: 8,
      paddingRight: 16,
      fontSize: 18,
      fontWeight: '500',
      color: colors.primary800,
    },
    linkButton: {
      borderRadius: 9999,
      padding: 16,
      backgroundColor: colors.primary500,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} style={{ color: colors.primary600 }} />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            style={styles.textInput}
            placeholderTextColor={colors.primary600}
            placeholder="Search songs..."
            returnKeyType="search"
          />
        </View>
        <Pressable
          style={styles.linkButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="link" size={28} style={{ color: colors.primary200 }} />
        </Pressable>
      </View>

      <Index visible={modalVisible} onHide={() => setModalVisible(false)} />
    </>
  );
}
