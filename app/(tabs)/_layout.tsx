import { Tabs } from 'expo-router';
import { useTheme } from 'contexts/theme';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.primary50, paddingTop: insets.top },
        tabBarStyle: {
          backgroundColor: colors.primary100,
          borderColor: colors.primary200,
          height: 88,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary500,
        tabBarInactiveTintColor: colors.primary400,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        animation: 'shift',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="download"
        options={{
          title: 'Download',
          tabBarIcon: ({ color, size }) => <Feather name="download" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => <Feather name="book-open" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="downloaded"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
