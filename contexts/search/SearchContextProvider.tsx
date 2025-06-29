import { useState } from 'react';
import { SearchContext } from './searchContext';
import { SongBase } from '../../types/Song';

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchItems, setSearchItems] = useState<SongBase[]>([]);

  const value = {
    searchItems,
    setSearchItems,
  };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
