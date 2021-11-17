import React, { createContext, useState, useEffect } from "react";
import { User } from "@firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthentificatedUserContext = createContext<User | null>(null);

export const AuthentificatedUserProvider: React.FC = ({ children }) => {
  const [authenticatedUser, setaAuthenticatedUser] = useState<User | null>(
    null
  );
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeWhenUnmounted = onAuthStateChanged(
      auth,
      (authenticatedUser) => {
        setaAuthenticatedUser(authenticatedUser);
      }
    );
    return unsubscribeWhenUnmounted;
  }, []);
  return (
    <AuthentificatedUserContext.Provider value={authenticatedUser}>
      {children}
    </AuthentificatedUserContext.Provider>
  );
};
