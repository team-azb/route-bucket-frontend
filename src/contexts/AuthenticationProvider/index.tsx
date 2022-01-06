import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, User } from "../../api/auth";

type authenticatedUserInfo = {
  authenticatedUser: User | null;
  hasCheckedAuth: boolean;
};

const AuthenticationContext = createContext<authenticatedUserInfo>({
  authenticatedUser: null,
  hasCheckedAuth: false,
});

export const AuthenticationProvider: React.FC = ({ children }) => {
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
    <AuthenticationContext.Provider
      value={{ authenticatedUser, hasCheckedAuth }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useSignedInUserInfoContext = () => {
  const signedInUser = useContext(AuthenticationContext);
  return signedInUser;
};
