import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "../api/auth";

type signedInUserInfo = {
  signedInUser: User | null;
  isCheckedAuth: boolean;
};

const SignedInUserInfoContext = createContext<signedInUserInfo>({
  signedInUser: null,
  isCheckedAuth: false,
});

export const SignedInUserInfoProvider: React.FC = ({ children }) => {
  const [signedInUser, setSignedInUser] = useState<User | null>(null);
  const [isCheckedAuth, setIsCheckedAuth] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribeWhenUnmounted = onAuthStateChanged((signedInUser) => {
      setIsCheckedAuth(true);
      setSignedInUser(signedInUser);
    });
    return unsubscribeWhenUnmounted;
  }, []);
  return (
    <SignedInUserInfoContext.Provider value={{ signedInUser, isCheckedAuth }}>
      {children}
    </SignedInUserInfoContext.Provider>
  );
};

export const useSignedInUserInfoContext = () => {
  const signedInUser = useContext(SignedInUserInfoContext);
  return signedInUser;
};
