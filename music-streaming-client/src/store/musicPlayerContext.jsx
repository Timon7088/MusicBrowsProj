import { useReducer, createContext, useContext } from "react";
import { reducer, initialState } from "./reducers/musicPlayerReduce";

const MusicPlayerContext = createContext(null);

export const MusicPlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MusicPlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayerContext = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error(
      "useMusicPlayerContext must be used within a MusicPlayerProvider"
    );
  }
  return context;
};
