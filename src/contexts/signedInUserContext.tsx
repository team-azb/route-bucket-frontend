import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "../api/auth";

export const SignedInUserUserContext = createContext<User | null>(null);

export const SignedInUserUserProvider: React.FC = ({ children }) => {
  const [signedInUser, setSignedInUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribeWhenUnmounted = onAuthStateChanged((signedInUser) => {
      setSignedInUser(signedInUser);
    });
    return unsubscribeWhenUnmounted;
  }, []);
  return (
    <SignedInUserUserContext.Provider value={signedInUser}>
      {children}
    </SignedInUserUserContext.Provider>
  );
};
