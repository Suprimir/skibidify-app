import SettingsContent from 'components/SettingsScreen/SettingsContent';
import { useTheme } from 'contexts/theme';
import { Text, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

export default function Settings() {
  const { colors } = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView
        className="px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}>
        <Text className="pt-4 text-4xl font-bold" style={{ color: colors.primary800 }}>
          Settings
        </Text>
        <Text className="mb-3 text-lg font-medium" style={{ color: colors.primary600 }}>
          Appearance
        </Text>

        <SettingsContent />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
