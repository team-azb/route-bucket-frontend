import React, { createContext, useState, useEffect } from "react";
import { User } from "@firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const SignedInUserUserContext = createContext<User | null>(null);

export const SignedInUserUserProvider: React.FC = ({ children }) => {
  const [signedInUser, setSignedInUser] = useState<User | null>(null);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeWhenUnmounted = onAuthStateChanged(
      auth,
      async (signedInUser) => {
        console.log(await signedInUser?.getIdToken());
        setSignedInUser(signedInUser);
      }
    );
    return unsubscribeWhenUnmounted;
  }, []);
  return (
    <SignedInUserUserContext.Provider value={signedInUser}>
      {children}
    </SignedInUserUserContext.Provider>
  );
};
