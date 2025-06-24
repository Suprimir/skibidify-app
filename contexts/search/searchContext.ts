import { createContext } from 'react';
import { YouTubeSearchItem } from 'types/YoutubeSearch';

export interface SearchContextType {
  searchItems: YouTubeSearchItem[];
  setSearchItems: (items: YouTubeSearchItem[]) => void;
}

export const SearchContext = createContext<SearchContextType | null>(null);
