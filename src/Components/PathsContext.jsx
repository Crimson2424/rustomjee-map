import { createContext, useContext, useState } from "react";

const PathsContext = createContext();

export function PathsProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

  return (
    <PathsContext.Provider value={{
      selectedCategory,
      selectedPath,
      setSelectedCategory,
      setSelectedPath
    }}>
      {children}
    </PathsContext.Provider>
  );
}

export const usePaths = () => useContext(PathsContext);
