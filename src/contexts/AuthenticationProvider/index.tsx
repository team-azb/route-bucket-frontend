import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "../../api/auth";

type AuthenticationInfoProviderProps = {
  children?: React.ReactNode;
};

type authenticatedUserInfo = {
  authenticatedUser: User | null;
  hasCheckedAuth: boolean;
};

const AuthenticationInfoContext = createContext<authenticatedUserInfo>({
  authenticatedUser: null,
  hasCheckedAuth: false,
});

export const AuthenticationInfoProvider = ({
  children,
}: AuthenticationInfoProviderProps) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [hasCheckedAuth, sethasCheckedAuth] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribeWhenUnmounted = onAuthStateChanged((authenticatedUser) => {
      sethasCheckedAuth(true);
      setAuthenticatedUser(authenticatedUser);
    });
    return unsubscribeWhenUnmounted;
  }, []);
  return (
    <AuthenticationInfoContext.Provider
      value={{ authenticatedUser, hasCheckedAuth }}
    >
      {children}
    </AuthenticationInfoContext.Provider>
  );
};

export const useAuthenticationInfoContext = () => {
  const signedInUser = useContext(AuthenticationInfoContext);
  return signedInUser;
};
