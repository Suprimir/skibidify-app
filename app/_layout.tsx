import { ThemeProvider } from '../contexts/theme';
import { Slot } from 'expo-router';
import '../global.css';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import BottomBar from 'components/BottomBar';
import { DownloadProvider } from 'contexts/download';
import { SongProvider } from 'contexts/song';
import { useTheme } from 'contexts/theme/ThemeProvider';
import { PlayerProvider } from 'contexts/player';
import PlayerBar from 'components/PlayerBar';

export default function Layout() {
  return (
    <ThemeProvider>
      <ThemeLayout>
        <SongProvider>
          <PlayerProvider>
            <DownloadProvider>
              <Slot />
              <PlayerBar />
              <BottomBar />
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
