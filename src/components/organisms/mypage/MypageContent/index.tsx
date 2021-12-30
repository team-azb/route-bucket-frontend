import React from "react";
import BasicInformation from "../BasicInformation";
import { useSignedInUserInfoContext } from "../../../../contexts/signedInUserContext";
import styles from "./style.module.css";
import { UserInfo } from "../../../../types";

type MypageContentProps = {
  userInfo?: UserInfo;
};

const MypageContent = ({ userInfo }: MypageContentProps) => {
  const { signedInUser } = useSignedInUserInfoContext();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>基本情報</h2>
      <hr />
      <BasicInformation userInfo={userInfo} email={signedInUser?.email} />
      <h2 className={styles.title}>公開ルート</h2>
      <hr />
    </div>
  );
};

export default MypageContent;
