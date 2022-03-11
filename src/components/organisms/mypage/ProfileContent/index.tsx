import React, { useContext } from "react";
import BasicInformation from "../BasicInformation";
import { UserInfoContext } from "../UserInfoProvider";
import styles from "./style.module.css";

const ProfileContent = () => {
  const userInfo = useContext(UserInfoContext);
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
