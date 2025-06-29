import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';
import React from 'react';
import ThemeModeButton from '../components/Settings/ThemeModeButton';
import ThemeAccentButton from '../components/Settings/ThemeAccentButton';
import CurrentThemeBox from '../components/Settings/CurrentThemeBox';
import ServicesInput from '../components/Settings/ServicesInput';
import { ThemeAccent } from '../../types/Theme';
import { useTheme } from '../../contexts/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();

  const accents: ThemeAccent[] = ['default', 'pink', 'green'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={[styles.title, { color: colors.primary800 }]}>
          Settings
        </Text>
        <Text style={[styles.subtitle, { color: colors.primary600 }]}>
          Appearance
        </Text>

        <View style={styles.contentContainer}>
          <ThemeModeButton />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary600 }]}>
              Color Themes
            </Text>
            <View style={styles.accentButtonsContainer}>
              {accents.map((colorScheme, index) => (
                <ThemeAccentButton key={index} colorScheme={colorScheme} />
              ))}
            </View>
          </View>

          <CurrentThemeBox />

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitleBold, { color: colors.primary600 }]}
            >
              Services
            </Text>
            <ServicesInput serviceName="YOUTUBE_API_KEY" icon="key" sensitive />
          </View>

          <View style={styles.section}>
            <Text
              style={[styles.sectionTitleBold, { color: colors.primary600 }]}
            >
              API Server
            </Text>
            <ServicesInput serviceName="API_BASE_URL" icon="server" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 60,
  },
  title: {
    paddingTop: 16,
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '500',
  },
  contentContainer: {
    marginTop: 16,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '500',
  },
  sectionTitleBold: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  accentButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
});
