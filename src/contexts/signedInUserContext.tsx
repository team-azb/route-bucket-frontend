import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "../api/auth";

const SignedInUserUserContext = createContext<User | null>(null);

export const SignedInUserProvider: React.FC = ({ children }) => {
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

export const useSignedInUserUserContext = () => {
  const signedInUser = useContext(SignedInUserUserContext);
  return signedInUser;
};
