/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigator/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './contexts/theme';
import { SongProvider } from './contexts/song';
import { PlayerProvider } from './contexts/player';
import { DownloadProvider } from './contexts/download';
import { SearchProvider } from './contexts/search';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SongProvider>
          <PlayerProvider>
            <DownloadProvider>
              <SearchProvider>
                <View style={styles.container}>
                  <AppNavigator />
                </View>
              </SearchProvider>
            </DownloadProvider>
          </PlayerProvider>
        </SongProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
