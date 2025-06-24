import { ThemeProvider } from '../contexts/theme';
import { Slot } from 'expo-router';
import { GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import BottomBar from 'components/BottomBar';
import { DownloadProvider } from 'contexts/download';
import { SongProvider } from 'contexts/song';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { PlayerProvider } from 'contexts/player';
import PlayerBar from 'components/PlayerBar';
import { SearchProvider } from 'contexts/search';

export default function Layout() {
  return (
    <ThemeProvider>
      <ThemeLayout>
        <SongProvider>
          <PlayerProvider>
            <DownloadProvider>
              <SearchProvider>
                <GestureHandlerRootView>
                  <Slot />
                </GestureHandlerRootView>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 88,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                  }}>
                  <PlayerBar />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                  }}>
                  <BottomBar />
                </View>
              </SearchProvider>
            </DownloadProvider>
          </PlayerProvider>
        </SongProvider>
      </ThemeLayout>
    </ThemeProvider>
  );
}

function ThemeLayout({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <View
      className="flex-1"
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.primary50,
      }}>
      {children}
    </View>
  );
}
