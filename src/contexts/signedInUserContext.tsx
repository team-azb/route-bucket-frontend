import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "../api/auth";

type signedInUserInfo = {
  signedInUser: User | null;
  hasCheckedAuth: boolean;
};

const SignedInUserInfoContext = createContext<signedInUserInfo>({
  signedInUser: null,
  hasCheckedAuth: false,
});

export const SignedInUserInfoProvider: React.FC = ({ children }) => {
  const [signedInUser, setSignedInUser] = useState<User | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribeWhenUnmounted = onAuthStateChanged((signedInUser) => {
      setHasCheckedAuth(true);
      setSignedInUser(signedInUser);
    });
    return unsubscribeWhenUnmounted;
  }, []);
  return (
    <SignedInUserInfoContext.Provider value={{ signedInUser, hasCheckedAuth }}>
      {children}
    </SignedInUserInfoContext.Provider>
  );
};

export const useSignedInUserInfoContext = () => {
  const signedInUser = useContext(SignedInUserInfoContext);
  return signedInUser;
};
