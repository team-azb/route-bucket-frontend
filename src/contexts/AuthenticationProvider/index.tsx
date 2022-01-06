import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "../../api/auth";

type AuthenticationProviderProps = {
  children?: React.ReactNode;
};

type authenticatedUserInfo = {
  authenticatedUser: User | null;
  isCheckedAuth: boolean;
};

const AuthenticationContext = createContext<authenticatedUserInfo>({
  authenticatedUser: null,
  isCheckedAuth: false,
});

export const AuthenticationProvider = ({
  children,
}: AuthenticationProviderProps) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [isCheckedAuth, setIsCheckedAuth] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribeWhenUnmounted = onAuthStateChanged((authenticatedUser) => {
      setIsCheckedAuth(true);
      setAuthenticatedUser(authenticatedUser);
    });
    return unsubscribeWhenUnmounted;
  }, []);
  return (
    <AuthenticationContext.Provider
      value={{ authenticatedUser, isCheckedAuth }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useSignedInUserInfoContext = () => {
  const signedInUser = useContext(AuthenticationContext);
  return signedInUser;
};
