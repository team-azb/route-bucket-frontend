import React from "react";
import BasicInformation from "../BasicInformation";
import UserInfoProvider from "../UserInfoProvider";
import { useSignedInUserInfoContext } from "../../../../contexts/signedInUserContext";
import styles from "./style.module.css";

type MypageContentProps = {
  userId: string;
};

const MypageContent = ({ userId }: MypageContentProps) => {
  const { signedInUser } = useSignedInUserInfoContext();
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>基本情報</h2>
      <hr />
      <UserInfoProvider userId={userId}>
        <BasicInformation email={signedInUser?.email} />
      </UserInfoProvider>
      <h2 className={styles.title}>公開ルート</h2>
      <hr />
    </div>
  );
};

export default MypageContent;
