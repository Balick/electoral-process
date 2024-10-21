"use client";

import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [term, setTerm] = useState("");

  const updateTerm = (newTerm) => {
    setTerm(newTerm);
  };

  return (
    <SearchContext.Provider
      value={{
        term,
        updateTerm,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchCandidate = () => {
  return useContext(SearchContext);
};
