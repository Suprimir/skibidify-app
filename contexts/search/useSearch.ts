import { useContext } from 'react';
import { SearchContext } from './searchContext';

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within SearchProvider');
  return context;
};
