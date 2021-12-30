import React from "react";
import BasicInformation from "../BasicInformation";
import UserInfoProvider from "../UserInfoProvider";
import styles from "./style.module.css";

type ProfileContentProps = {
  userId: string;
};

const ProfileContent = ({ userId }: ProfileContentProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>基本情報</h2>
      <hr />
      <UserInfoProvider userId={userId}>
        <BasicInformation />
      </UserInfoProvider>
      <h2 className={styles.title}>公開ルート</h2>
      <hr />
    </div>
  );
};

export default ProfileContent;
