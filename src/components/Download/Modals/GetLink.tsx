import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../../contexts/theme';

interface GetLinkProps {
  visible: boolean;
  onHide: () => void;
  handleSearch: (url: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function GetLink({
  visible,
  onHide,
  handleSearch,
}: GetLinkProps) {
  const { colors } = useTheme();
  const [url, setUrl] = useState('');

  const onSubmit = () => {
    if (url.trim()) {
      handleSearch(url.trim());
      setUrl('');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onHide}
    >
      <Pressable style={styles.backdrop} onPress={onHide}>
        <Pressable onPress={e => e.stopPropagation()}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.primary200 },
            ]}
          >
            <View
              style={[
                styles.header,
                {
                  borderBottomColor: colors.primary300,
                },
              ]}
            >
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.primary800,
                  },
                ]}
              >
                Video or playlist link
              </Text>
              <Pressable
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: colors.primary300,
                  },
                ]}
                onPress={onHide}
              >
                <Icon name="x" size={20} color={colors.primary800} />
              </Pressable>
            </View>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.primary100 },
              ]}
            >
              <TextInput
                style={[styles.textInput, { color: colors.primary500 }]}
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
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary600 },
              ]}
            >
              <Text
                style={[styles.submitButtonText, { color: colors.primary100 }]}
              >
                Buscar
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: screenWidth * 0.8, // 80vw equivalent
    borderRadius: 16, // rounded-2xl
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 16,
  },
  title: {
    fontSize: 18, // text-lg
    fontWeight: 'bold',
  },
  closeButton: {
    height: 32, // h-8
    width: 32, // w-8
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16, // rounded-full
  },
  inputContainer: {
    margin: 16, // m-4
    borderRadius: 12, // rounded-xl
  },
  textInput: {
    marginStart: 8, // ms-2
    fontSize: 18, // text-lg
    paddingVertical: 12, // Añadido para mejor UX
    paddingHorizontal: 4,
  },
  submitButton: {
    margin: 16, // m-4
    marginTop: 0, // mt-0
    borderRadius: 12, // rounded-xl
    padding: 16, // p-4
  },
  submitButtonText: {
    textAlign: 'center',
    fontWeight: '600', // font-semibold
  },
});
