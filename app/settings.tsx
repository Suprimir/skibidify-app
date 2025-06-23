import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '../contexts/theme';
import {
  Text,
  View,
  Pressable,
  InteractionManager,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ThemeAccent } from 'types/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { getKey, setKey } from 'config/storageConfig';

export default function Settings() {
  const [showYouTubeKey, setShowYouTubeKey] = useState(false);
  const [youtubeInput, setYoutubeInput] = useState<string>('');
  const [serverInput, setServerInput] = useState<string>('');
  const { setAccent, toggleMode, mode, accent, colors } = useTheme();
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  useEffect(() => {
    const loadKey = async () => {
      const youtubeKey = await getKey('YOUTUBE_API_KEY');
      setYoutubeInput(youtubeKey);

      const serverUrl = await getKey('API_BASE_URL');
      setServerInput(serverUrl);
    };
    loadKey();
  }, []);

  const accents: ThemeAccent[] = ['default', 'pink', 'green'];

  const accentPreviewColors: Record<ThemeAccent, { light: string[]; dark: string[] }> = {
    default: {
      light: ['#f8fafc', '#e2e8f0', '#64748b', '#334155'],
      dark: ['#334155', '#475569', '#64748b', '#94a3b8'],
    },
    pink: {
      light: ['#fdf2f8', '#fbcfe8', '#ec4899', '#be185d'],
      dark: ['#500724', '#9d174d', '#ec4899', '#f9a8d4'],
    },
    green: {
      light: ['#f0fdf4', '#bbf7d0', '#22c55e', '#15803d'],
      dark: ['#052e16', '#166534', '#22c55e', '#86efac'],
    },
  };

  const handleSaveYoutube = async () => {
    if (youtubeInput.trim()) {
      await setKey('YOUTUBE_API_KEY', youtubeInput.trim());
      Alert.alert('Succes', 'API Key Saved');
    }
  };

  const handleSaveServer = async () => {
    if (serverInput.trim()) {
      await setKey('API_BASE_URL', serverInput.trim());
      Alert.alert('Succes', 'API Url Saved');
    }
  };

  const handleAccentChange = useCallback(
    (newAccent: ThemeAccent) => {
      if (isChangingTheme) return;

      setIsChangingTheme(true);

      InteractionManager.runAfterInteractions(() => {
        setAccent(newAccent);

        setTimeout(() => {
          setIsChangingTheme(false);
        }, 100);
      });
    },
    [setAccent, isChangingTheme]
  );

  const handleModeToggle = useCallback(() => {
    if (isChangingTheme) return;

    setIsChangingTheme(true);

    InteractionManager.runAfterInteractions(() => {
      toggleMode();

      setTimeout(() => {
        setIsChangingTheme(false);
      }, 100);
    });
  }, [toggleMode, isChangingTheme]);

  const getAccentDisplayName = (accentName: ThemeAccent) => {
    switch (accentName) {
      case 'default':
        return 'Slate';
      case 'pink':
        return 'Pink';
      case 'green':
        return 'Green';
      default:
        return accentName;
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View>
        <Text className="p-4 text-4xl font-bold" style={{ color: colors.primary600 }}>
          Settings
        </Text>

        <View className="mb-6 px-4">
          <Text className="mb-3 text-lg font-medium" style={{ color: colors.foreground }}>
            Appearance
          </Text>
          <Pressable
            onPress={handleModeToggle}
            disabled={isChangingTheme}
            className="rounded-lg px-4 py-3"
            style={{
              backgroundColor: colors.primary100,
              opacity: isChangingTheme ? 0.5 : 1,
            }}>
            <Text className="text-center font-medium" style={{ color: colors.foreground }}>
              {mode === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
            </Text>
          </Pressable>
        </View>

        <View className="px-4">
          <Text className="mb-3 text-lg font-medium" style={{ color: colors.foreground }}>
            Color Themes
          </Text>
          <View className="flex-row flex-wrap gap-4">
            {accents.map((option) => {
              const currentColors = accentPreviewColors[option][mode];
              const isSelected = accent === option;

              return (
                <View key={option} className="items-center">
                  <Pressable
                    onPress={() => handleAccentChange(option)}
                    disabled={isChangingTheme}
                    className="h-20 w-20 rounded-xl p-1"
                    style={{
                      borderWidth: 2,
                      borderColor: isSelected ? colors.primary500 : colors.border,
                      transform: [{ scale: isSelected ? 1.05 : 1 }],
                      opacity: isChangingTheme ? 0.5 : 1,
                    }}>
                    <View className="flex h-full w-full flex-col overflow-hidden rounded-lg">
                      <View className="flex-1 flex-row">
                        <View
                          className="h-full w-1/2"
                          style={{ backgroundColor: currentColors[0] }}
                        />
                        <View
                          className="h-full w-1/2"
                          style={{ backgroundColor: currentColors[1] }}
                        />
                      </View>
                      <View className="flex-1 flex-row">
                        <View
                          className="h-full w-1/2"
                          style={{ backgroundColor: currentColors[2] }}
                        />
                        <View
                          className="h-full w-1/2"
                          style={{ backgroundColor: currentColors[3] }}
                        />
                      </View>
                    </View>
                  </Pressable>

                  <Text
                    className="mt-2 text-center text-xs font-medium"
                    style={{ color: colors.foreground }}>
                    {getAccentDisplayName(option)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View className="mt-8 px-4">
          <View
            className="rounded-lg p-4"
            style={{
              backgroundColor: colors.primary100,
              borderColor: colors.primary200,
              borderWidth: 1,
            }}>
            <Text className="mb-1 text-sm font-medium" style={{ color: colors.mutedForeground }}>
              Current Theme
            </Text>
            <Text className="text-lg capitalize" style={{ color: colors.primary500 }}>
              {mode} • {getAccentDisplayName(accent)}
            </Text>
          </View>
        </View>

        <View className="mt-8 px-4">
          <Text className="mb-3 text-lg font-semibold" style={{ color: colors.primary600 }}>
            Services
          </Text>
          <View className="flex-col gap-4">
            <View
              className="flex-row items-center rounded-lg border-2 border-transparent"
              style={{ backgroundColor: colors.primary50 }}>
              <View
                className="flex-row items-center gap-2 rounded-l-lg border-r p-3 font-medium"
                style={{ borderColor: colors.primary200, backgroundColor: colors.primary100 }}>
                <Feather name="youtube" size={24} color={colors.primary500} />
              </View>
              <TextInput
                value={youtubeInput}
                onChangeText={setYoutubeInput}
                onSubmitEditing={handleSaveYoutube}
                placeholder="Ingresa tu YouTube API Key"
                secureTextEntry={showYouTubeKey ? false : true}
                className="flex-1 bg-transparent p-3"
                placeholderTextColor={colors.primary400}
                style={{ color: colors.primary700 }}
              />
              <TouchableOpacity
                onPress={() => setShowYouTubeKey(!showYouTubeKey)}
                className="flex cursor-pointer justify-center rounded-l-md p-4"
                style={{ backgroundColor: colors.primary100 }}>
                {showYouTubeKey ? (
                  <Feather name="eye-off" size={24} color={colors.primary500} />
                ) : (
                  <Feather name="eye" size={24} color={colors.primary500} />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <Text className="my-3 text-lg font-semibold" style={{ color: colors.primary600 }}>
            API Server
          </Text>
          <View className="flex-col gap-4">
            <View
              className="flex-row items-center rounded-lg border-2 border-transparent"
              style={{ backgroundColor: colors.primary50 }}>
              <View
                className="flex-row items-center gap-2 rounded-l-lg border-r p-3 font-medium"
                style={{ borderColor: colors.primary200, backgroundColor: colors.primary100 }}>
                <Feather name="code" size={24} color={colors.primary500} />
              </View>
              <TextInput
                value={serverInput}
                onChangeText={setServerInput}
                onSubmitEditing={handleSaveServer}
                placeholder="Ingresa la IP de tu API"
                className="flex-1 bg-transparent p-3"
                placeholderTextColor={colors.primary400}
                style={{ color: colors.primary700 }}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
