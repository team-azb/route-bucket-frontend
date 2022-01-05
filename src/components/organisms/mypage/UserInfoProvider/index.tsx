import React, { createContext, useEffect, useMemo, useState } from "react";
import { UserInfo } from "../../../../types";
import { getUser } from "../../../../api/users";
import LoadingDisplay from "../../../atoms/LoadingDisplay";
import NotFoundContent from "../NotFoundContent";

type UserInfoProviderProps = {
  children?: React.ReactNode;
  userId: string;
};

type Status = "LOADING" | "NOT_FOUND" | "FOUND";

export const UserInfoContext = createContext<UserInfo>({
  id: "",
  name: "",
  gender: null,
  birthdate: null,
  icon_url: null,
});

const UserInfoProvider = ({ children, userId }: UserInfoProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: "",
    name: "",
    gender: null,
    birthdate: null,
    icon_url: null,
  });
  const [status, setStatus] = useState<Status>("LOADING");

  useEffect(() => {
    setStatus("LOADING");
    (async function () {
      try {
        const res = await getUser(userId);
        res?.data && setUserInfo(res?.data);
        setStatus("FOUND");
      } catch (error) {
        setStatus("NOT_FOUND");
      }
    })();
  }, [userId]);

  const displayedElem = useMemo(() => {
    switch (status) {
      case "LOADING":
        return <LoadingDisplay message="読み込み中です" />;
      case "NOT_FOUND":
        return <NotFoundContent />;
      case "FOUND":
        return (
          <UserInfoContext.Provider value={userInfo}>
            {children}
          </UserInfoContext.Provider>
        );
    }
  }, [children, status, userInfo]);

  return <>{displayedElem}</>;
};

export default React.memo(UserInfoProvider);
