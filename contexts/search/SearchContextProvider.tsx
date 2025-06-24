import { useState } from 'react';
import { SearchContext } from './searchContext';
import { YouTubeSearchItem } from 'types/YoutubeSearch';

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchItems, setSearchItems] = useState<YouTubeSearchItem[]>([]);

  const value = {
    searchItems,
    setSearchItems,
  };
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
