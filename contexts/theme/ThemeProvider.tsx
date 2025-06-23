import { useEffect, useState, ReactNode, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeAccent, ThemeColors, ThemeMode } from 'types/Theme';
import { ThemeContext } from './themeContext';

const themeColors: Record<`${ThemeMode}-${ThemeAccent}`, ThemeColors> = {
  'light-default': {
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f8fafc',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    ring: '#64748b',
    accent: '#64748b',
    primary50: '#f8fafc',
    primary100: '#f1f5f9',
    primary200: '#e2e8f0',
    primary300: '#cbd5e1',
    primary400: '#94a3b8',
    primary500: '#64748b',
    primary600: '#475569',
    primary700: '#334155',
    primary800: '#1e293b',
    primary900: '#0f172a',
    primary950: '#020617',
  },
  'light-pink': {
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f8fafc',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    ring: '#ec4899',
    accent: '#f472b6',
    primary50: '#fdf2f8',
    primary100: '#fce7f3',
    primary200: '#fbcfe8',
    primary300: '#f9a8d4',
    primary400: '#f472b6',
    primary500: '#ec4899',
    primary600: '#db2777',
    primary700: '#be185d',
    primary800: '#9d174d',
    primary900: '#831843',
    primary950: '#500724',
  },
  'light-green': {
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f8fafc',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    ring: '#22c55e',
    accent: '#4ade80',
    primary50: '#f0fdf4',
    primary100: '#dcfce7',
    primary200: '#bbf7d0',
    primary300: '#86efac',
    primary400: '#4ade80',
    primary500: '#22c55e',
    primary600: '#16a34a',
    primary700: '#15803d',
    primary800: '#166534',
    primary900: '#14532d',
    primary950: '#052e16',
  },
  'dark-default': {
    background: '#0f172a',
    foreground: '#f1f5f9',
    muted: '#1e293b',
    mutedForeground: '#94a3b8',
    border: '#334155',
    ring: '#94a3b8',
    accent: '#94a3b8',
    primary50: '#020617',
    primary100: '#0f172a',
    primary200: '#1e293b',
    primary300: '#334155',
    primary400: '#475569',
    primary500: '#64748b',
    primary600: '#94a3b8',
    primary700: '#cbd5e1',
    primary800: '#e2e8f0',
    primary900: '#f1f5f9',
    primary950: '#f8fafc',
  },
  'dark-pink': {
    background: '#0c0a0b',
    foreground: '#fce7f3',
    muted: '#2d1b26',
    mutedForeground: '#d4a5c2',
    border: '#4a2c3a',
    ring: '#ec4899',
    accent: '#f472b6',
    primary50: '#500724',
    primary100: '#831843',
    primary200: '#9d174d',
    primary300: '#be185d',
    primary400: '#db2777',
    primary500: '#ec4899',
    primary600: '#f472b6',
    primary700: '#f9a8d4',
    primary800: '#fbcfe8',
    primary900: '#fce7f3',
    primary950: '#fdf2f8',
  },
  'dark-green': {
    background: '#0b1e12',
    foreground: '#e3fbe8',
    muted: '#102a1d',
    mutedForeground: '#9fd8b6',
    border: '#1e3a2a',
    ring: '#3ca466',
    accent: '#4dd47e',
    primary50: '#0f2f1e',
    primary100: '#1a4430',
    primary200: '#22603f',
    primary300: '#2d7b51',
    primary400: '#3ca466',
    primary500: '#4dd47e',
    primary600: '#6ff598',
    primary700: '#a7fbc1',
    primary800: '#cbfce0',
    primary900: '#e9fdf3',
    primary950: '#f5fef9',
  },
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@app_theme';

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [accent, setAccentState] = useState<ThemeAccent>('default');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tema guardado
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          const [savedMode, savedAccent] = savedTheme.split('-') as [ThemeMode, ThemeAccent];
          if (savedMode && savedAccent) {
            setModeState(savedMode);
            setAccentState(savedAccent);
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Guardar tema cuando cambie
  useEffect(() => {
    if (!isLoading) {
      const saveTheme = async () => {
        try {
          await AsyncStorage.setItem(THEME_STORAGE_KEY, `${mode}-${accent}`);
        } catch (error) {
          console.error('Error saving theme:', error);
        }
      };
      saveTheme();
    }
  }, [mode, accent, isLoading]);

  if (isLoading) {
    return null;
  }

  const colors = themeColors[`${mode}-${accent}`];

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const setAccent = (newAccent: ThemeAccent) => {
    setAccentState(newAccent);
  };

  const toggleMode = () => {
    setModeState(mode === 'light' ? 'dark' : 'light');
  };

  const value = {
    mode,
    accent,
    colors,
    setMode,
    setAccent,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {children}
    </ThemeContext.Provider>
  );
}
