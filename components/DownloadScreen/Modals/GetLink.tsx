import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from 'contexts/theme';

interface GetLinkProps {
  visible: boolean;
  onHide: () => void;
  handleSearch: (url: string) => void;
}

export default function GetLink({ visible, onHide, handleSearch }: GetLinkProps) {
  const { colors } = useTheme();
  const [url, setUrl] = useState('');

  const onSubmit = () => {
    if (url.trim()) {
      handleSearch(url.trim());
      setUrl('');
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onHide}>
      <Pressable className="flex-1 items-center justify-center" onPress={onHide}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="w-[80vw] rounded-2xl" style={{ backgroundColor: colors.primary200 }}>
            <View
              className="flex-row items-center justify-between border-b p-4"
              style={{
                borderBottomColor: colors.primary300,
              }}>
              <Text
                className="text-lg font-bold"
                style={{
                  color: colors.primary800,
                }}>
                Video or playlist link
              </Text>
              <Pressable
                className="h-8 w-8 items-center justify-center rounded-full"
                onPress={onHide}
                style={{
                  backgroundColor: colors.primary300,
                }}>
                <Feather name="x" size={20} color={colors.primary800} />
              </Pressable>
            </View>
            <View className="m-4 rounded-xl" style={{ backgroundColor: colors.primary100 }}>
              <TextInput
                className="ms-2 text-lg "
                style={{ color: colors.primary500 }}
                placeholder="youtube.com/watch?v=XXXXX"
                placeholderTextColor={colors.primary400}
                value={url}
                onChangeText={setUrl}
                onSubmitEditing={onSubmit}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Pressable
              onPress={onSubmit}
              className="m-4 mt-0 rounded-xl p-4"
              style={{ backgroundColor: colors.primary600 }}>
              <Text className="text-center font-semibold" style={{ color: colors.primary100 }}>
                Buscar
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
