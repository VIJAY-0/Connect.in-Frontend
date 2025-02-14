import { createContext, useState, useContext } from "react";

const GlobalContext = createContext(null);

export const ContextProvider = ({ children }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [wall, setWall] = useState(null);

  return (
    <GlobalContext.Provider value={{ 
        showCreatePost,
        setShowCreatePost,
        wall,
        setWall
        }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
