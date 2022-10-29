import React from "react";

export const AppContext = React.createContext(null);

export const useAppContext = () => {
  return React.useContext(AppContext);
};
