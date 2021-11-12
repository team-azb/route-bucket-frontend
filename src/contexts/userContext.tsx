import React, { createContext, useState, useEffect } from "react";
import { User } from "@firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext<User | null>(null);

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
