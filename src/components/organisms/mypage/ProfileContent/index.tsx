import React from "react";
import { UserInfo } from "../../../../types";
import BasicInformation from "../BasicInformation";
import styles from "./style.module.css";

type ProfileContentProps = {
  userInfo?: UserInfo;
};

const ProfileContent = ({ userInfo }: ProfileContentProps) => {
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
