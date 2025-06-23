import { createContext } from 'react';
import type { ThemeAccent, ThemeColors, ThemeMode } from '../../types/Theme';

export interface ThemeContextType {
  mode: ThemeMode;
  accent: ThemeAccent;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
  toggleMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
