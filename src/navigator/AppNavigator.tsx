import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import DownloadScreen from '../screens/DownloadScreen';
import LibraryScreen from '../screens/LibraryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/theme';
import PlaylistScreen from '../screens/PlaylistScreen';
import DownloadsScreen from '../screens/DownloadsScreen';
import PlayerBar from '../components/PlayerBar';
import { usePlayer } from '../../contexts/player';

const Tab = createBottomTabNavigator();

interface TabIconProps {
  color: string;
  size: number;
}

const HomeIcon = ({ color, size }: TabIconProps) => (
  <Icon name="home" color={color} size={size} />
);

const DownloadIcon = ({ color, size }: TabIconProps) => (
  <Icon name="download" color={color} size={size} />
);

const LibraryIcon = ({ color, size }: TabIconProps) => (
  <Icon name="book-open" color={color} size={size} />
);

const SettingsIcon = ({ color, size }: TabIconProps) => (
  <Icon name="settings" color={color} size={size} />
);

export default function AppNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { songPlaying } = usePlayer();

  // Altura del PlayerBar cuando está visible
  const PLAYER_BAR_HEIGHT = 72;

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            sceneStyle: {
              backgroundColor: colors.primary50,
              paddingTop: insets.top,
              // Agregar padding bottom cuando el player está activo
              paddingBottom: songPlaying ? PLAYER_BAR_HEIGHT : 0,
            },
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
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: HomeIcon,
            }}
          />
          <Tab.Screen
            name="Download"
            component={DownloadScreen}
            options={{
              tabBarIcon: DownloadIcon,
            }}
          />
          <Tab.Screen
            name="Library"
            component={LibraryScreen}
            options={{
              tabBarIcon: LibraryIcon,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: SettingsIcon,
            }}
          />
          <Tab.Screen
            name="Downloads"
            component={DownloadsScreen}
            options={{
              tabBarButton: () => null,
              tabBarItemStyle: { display: 'none' },
            }}
          />
          <Tab.Screen
            name="Playlist"
            component={PlaylistScreen}
            options={{
              tabBarButton: () => null,
              tabBarItemStyle: { display: 'none' },
            }}
          />
        </Tab.Navigator>

        {/* PlayerBar en posición absoluta */}
        {songPlaying && (
          <View
            style={[
              styles.playerBarContainer,
              {
                bottom: 88,
              },
            ]}
          >
            <PlayerBar />
          </View>
        )}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playerBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
