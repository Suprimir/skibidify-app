import { View, Text, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from 'contexts/theme';
import { Feather } from '@expo/vector-icons';

const tabs = [
  { name: '/', title: 'Inicio', icon: 'home' as const },
  { name: '/download', title: 'Descargar', icon: 'download' as const },
  { name: '/library', title: 'Biblioteca', icon: 'book-open' as const },
  { name: '/settings', title: 'Settings', icon: 'settings' as const },
];

export default function BottomBar() {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleTabPress = (tabPath: string) => {
    router.push(tabPath);
  };

  const isTabActive = (tabPath: string) => {
    if (tabPath === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(tabPath);
  };

  return (
    <View
      className="flex-row items-center justify-between px-8 pb-4"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 88,
        backgroundColor: colors.primary100,
        borderTopColor: colors.primary200,
        borderTopWidth: 1,
      }}>
      {tabs.map((tab) => {
        const isActive = isTabActive(tab.name);

        return (
          <Pressable
            className="items-center"
            key={tab.name}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : isActive ? 1 : 0.7,
            })}
            onPress={() => handleTabPress(tab.name)}>
            <Feather
              name={tab.icon}
              size={24}
              color={isActive ? colors.primary500 : colors.primary400}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: isActive ? colors.primary500 : colors.primary400,
                marginTop: 4,
              }}>
              {tab.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
