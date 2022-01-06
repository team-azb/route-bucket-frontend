import React from "react";
import BasicInformation from "../BasicInformation";
import { useUserInfo } from "../../../../contexts/UserInfoProvider";
import styles from "./style.module.css";

const ProfileContent = () => {
  const userInfo = useUserInfo();
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
