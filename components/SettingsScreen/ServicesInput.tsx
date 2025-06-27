import Feather from '@expo/vector-icons/Feather';
import { getKey, setKey } from 'config/storageConfig';
import { useTheme } from 'contexts/theme';
import { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';

interface ServicesInputProps {
  serviceName: string;
  icon: keyof typeof Feather.glyphMap;
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
    <View className="flex-col gap-4">
      <View
        className="flex-row items-center rounded-lg border-2 border-transparent"
        style={{
          backgroundColor: colors.primary100,
          borderColor: colors.primary300,
        }}>
        <View
          className="flex-row items-center gap-2 rounded-l-lg border-r p-4 font-medium"
          style={{ borderColor: colors.primary300, backgroundColor: colors.primary200 }}>
          <Feather name={icon} size={24} color={colors.primary500} />
        </View>
        <TextInput
          value={serviceInput}
          onChangeText={setServiceInput}
          onSubmitEditing={handleSaveKey}
          secureTextEntry={sensitive ? (showKey ? false : true) : false}
          placeholder="Ingresa la IP de tu API"
          className="flex-1 bg-transparent p-4"
          placeholderTextColor={colors.primary400}
          style={{ color: colors.primary700 }}
          returnKeyType="done"
        />
        {sensitive && (
          <TouchableOpacity
            onPress={() => setShowKey(!showKey)}
            className="flex cursor-pointer justify-center rounded-r-lg border-l p-4"
            style={{ backgroundColor: colors.primary200, borderColor: colors.primary300 }}>
            {showKey ? (
              <Feather name="eye-off" size={24} color={colors.primary500} />
            ) : (
              <Feather name="eye" size={24} color={colors.primary500} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
