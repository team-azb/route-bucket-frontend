import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "../../../api/users";
import { UserInfo } from "../../../types";
import SigninRequiredTemplate from "../../organisms/SignInRequiredTemplate";
import BasicInformation from "../../organisms/BasicInformation";
import styles from "./style.module.css";

interface MypageParams {
  userId: string;
}

const Mypage = () => {
  const { userId } = useParams<MypageParams>();
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
    <SigninRequiredTemplate>
      <div className={styles.container}>
        <h2 className={styles.title}>基本情報</h2>
        <hr />
        <BasicInformation userInfo={userInfo} />
        <h2 className={styles.title}>公開ルート</h2>
        <hr />
      </div>
    </SigninRequiredTemplate>
  );
};

export default Mypage;
