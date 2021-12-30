import React, { useState, useEffect } from "react";
import BasicInformation from "../BasicInformation";
import { getUser } from "../../../../api/users";
import { UserInfo } from "../../../../types";
import styles from "./style.module.css";

type ProfileContentProps = {
  userId: string;
};

const ProfileContent = ({ userId }: ProfileContentProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: "",
    name: "",
    gender: null,
    birthdate: null,
    icon_url: null,
  });

  useEffect(() => {
    (async function () {
      const res = await getUser(userId);
      res?.data && setUserInfo(res?.data);
    })();
  }, [userId]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>基本情報</h2>
      <hr />
      <BasicInformation userInfo={userInfo} />
      <h2 className={styles.title}>公開ルート</h2>
      <hr />
    </div>
  );
};

export default ProfileContent;
