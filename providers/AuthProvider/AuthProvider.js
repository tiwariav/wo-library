/* A react context provider, that make basic authentication related state available to children */
import React, { useReducer } from "react";
import authReducer, { authInit, authInitialState } from "./authReducer";

export const AuthContext = React.createContext();

const AuthProvider = React.memo(({ children }) => {
  const [state, dispatch] = useReducer(
    authReducer,
    {
      ...authInitialState,
      // add any props dependent values
    },
    authInit
  );
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
});

export default AuthProvider;
