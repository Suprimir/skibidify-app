import { createContext } from 'react';
import { SongBase } from '../../types/Song';

export interface SearchContextType {
  searchItems: SongBase[];
  setSearchItems: (items: SongBase[]) => void;
}

export const SearchContext = createContext<SearchContextType | null>(null);
