import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "../../api/auth";

type AuthenticationInfoProviderProps = {
  children?: React.ReactNode;
};

type AuthenticationInfo = {
  authenticatedUser: User | null;
  isCheckedAuth: boolean;
};

const AuthenticationInfoContext = createContext<AuthenticationInfo>({
  authenticatedUser: null,
  isCheckedAuth: false,
});

export const AuthenticationInfoProvider = ({
  children,
}: AuthenticationInfoProviderProps) => {
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
    <AuthenticationInfoContext.Provider
      value={{ authenticatedUser, isCheckedAuth }}
    >
      {children}
    </AuthenticationInfoContext.Provider>
  );
};

export const useAuthenticationInfoContext = () => {
  const signedInUser = useContext(AuthenticationInfoContext);
  return signedInUser;
};
