import { useState, useEffect, createContext, PropsWithChildren } from "react";
import { User } from "@firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const userContext = createContext<User | null>(null);
export const UserContextProvider = (props: PropsWithChildren<Object>) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <userContext.Provider value={user}>{props.children}</userContext.Provider>
  );
};
