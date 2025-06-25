import { ThemeProvider } from '../contexts/theme';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { DownloadProvider } from 'contexts/download';
import { SongProvider } from 'contexts/song';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { PlayerProvider } from 'contexts/player';
import PlayerBar from 'components/PlayerBar';
import { SearchProvider } from 'contexts/search';
import '../global.css';

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <ThemeLayout>
          <SongProvider>
            <PlayerProvider>
              <DownloadProvider>
                <SearchProvider>
                  <Slot />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 88,
                      left: 0,
                      right: 0,
                    }}>
                    <PlayerBar />
                  </View>
                </SearchProvider>
              </DownloadProvider>
            </PlayerProvider>
          </SongProvider>
        </ThemeLayout>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function ThemeLayout({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.primary50,
      }}>
      {children}
    </View>
  );
}
