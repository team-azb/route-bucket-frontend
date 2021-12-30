import React, { useEffect, useState } from "react";
import { getUser } from "../../../../api/users";
import { UserInfo } from "../../../../types";
import BasicInformation from "../BasicInformation";
import { useSignedInUserInfoContext } from "../../../../contexts/signedInUserContext";
import styles from "./style.module.css";

type MypageContentProps = {
  userId: string;
};

const MypageContent = ({ userId }: MypageContentProps) => {
  const { signedInUser } = useSignedInUserInfoContext();
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
      <BasicInformation userInfo={userInfo} email={signedInUser?.email} />
      <h2 className={styles.title}>公開ルート</h2>
      <hr />
    </div>
  );
};

export default MypageContent;
