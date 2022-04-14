import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { onAuthStateChanged, User } from "../../api/auth";

type AuthenticationInfoProviderProps = {
  children?: React.ReactNode;
};

type AuthenticationInfo = {
  authenticatedUser: User | null;
  hasCheckedAuth: boolean;
  getIdToken: () => Promise<string> | undefined;
};

const AuthenticationInfoContext = createContext<AuthenticationInfo>({
  authenticatedUser: null,
  hasCheckedAuth: false,
  getIdToken: async () => "",
});

export const AuthenticationInfoProvider = ({
  children,
}: AuthenticationInfoProviderProps) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [hasCheckedAuth, setHasCheckedAuth] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribeWhenUnmounted = onAuthStateChanged((authenticatedUser) => {
      setHasCheckedAuth(true);
      setAuthenticatedUser(authenticatedUser);
    });
    return unsubscribeWhenUnmounted;
  }, []);

  const getIdToken = useCallback(() => {
    return authenticatedUser?.getIdToken();
  }, [authenticatedUser]);

  return (
    <AuthenticationInfoContext.Provider
      value={{
        authenticatedUser,
        hasCheckedAuth,
        getIdToken: getIdToken,
      }}
    >
      {children}
    </AuthenticationInfoContext.Provider>
  );
};

export const useAuthenticationInfoContext = () => {
  const authenticationInfo = useContext(AuthenticationInfoContext);
  return authenticationInfo;
};
