'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type SearchContextType = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const SearchContext = createContext<SearchContextType>({
  isModalOpen: false,
  setIsModalOpen: () => {}, 
});

export const SearchContextProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SearchContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
