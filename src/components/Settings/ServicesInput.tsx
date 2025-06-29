import Icon from 'react-native-vector-icons/Feather';
import { getKey, setKey } from '../../../config/storageConfig';
import { useTheme } from '../../../contexts/theme';
import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

interface ServicesInputProps {
  serviceName: string;
  icon: string;
  sensitive?: boolean;
}

export default function ServicesInput({
  serviceName,
  icon,
  sensitive = false,
}: ServicesInputProps) {
  const { colors } = useTheme();
  const [serviceInput, setServiceInput] = useState<string>('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const loadKey = async () => {
      const key = await getKey(serviceName);
      setServiceInput(key);
    };
    loadKey();
  }, [serviceName]);

  const handleSaveKey = async () => {
    if (serviceInput.trim()) {
      await setKey(serviceName, serviceInput.trim());
      Alert.alert('Success', `${serviceName} Key saved.`);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.primary100,
            borderColor: colors.primary300,
          },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            {
              borderColor: colors.primary300,
              backgroundColor: colors.primary200,
            },
          ]}
        >
          <Icon name={icon} size={24} color={colors.primary500} />
        </View>
        <TextInput
          value={serviceInput}
          onChangeText={setServiceInput}
          onSubmitEditing={handleSaveKey}
          secureTextEntry={sensitive ? !showKey : false}
          placeholder="Ingresa la IP de tu API"
          style={[
            styles.textInput,
            {
              color: colors.primary700,
            },
          ]}
          placeholderTextColor={colors.primary400}
          returnKeyType="done"
        />
        {sensitive && (
          <TouchableOpacity
            onPress={() => setShowKey(!showKey)}
            style={[
              styles.eyeButton,
              {
                backgroundColor: colors.primary200,
                borderColor: colors.primary300,
              },
            ]}
          >
            {showKey ? (
              <Icon name="eye-off" size={24} color={colors.primary500} />
            ) : (
              <Icon name="eye" size={24} color={colors.primary500} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16,
  },
  eyeButton: {
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 1,
    padding: 16,
  },
});
