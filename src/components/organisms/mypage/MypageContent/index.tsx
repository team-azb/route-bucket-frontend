import React, { useCallback, useMemo, useState } from "react";
import BasicInformation from "../BasicInformation";
import { useSignedInUserInfoContext } from "../../../../contexts/AuthenticationProvider";
import styles from "./style.module.css";
import { useUserInfo } from "../../../../contexts/UserInfoProvider";
import BasicInformationUpdateForm from "../BasicInformationUpdateForm";

const MypageContent = () => {
  const userInfo = useUserInfo();
  const { authenticatedUser } = useSignedInUserInfoContext();
  const [isEditingMode, setIsEditingMode] = useState(false);

  const changeEditingModeHandler = useCallback((isActive: boolean) => {
    return () => {
      setIsEditingMode(isActive);
    };
  }, []);

  const editingModeContent = useMemo(() => {
    return (
      <>
        <div className={styles.row}>
          <h2 className={styles.title}>基本情報</h2>
        </div>
        <hr />
        <BasicInformationUpdateForm
          userInfo={userInfo}
          exitEditingModeHandler={changeEditingModeHandler(false)}
        />
      </>
    );
  }, [userInfo, changeEditingModeHandler]);

  const viewingModeContent = useMemo(() => {
    return (
      <>
        <div className={styles.row}>
          <h2 className={styles.title}>基本情報</h2>
          <button
            className={styles.button}
            onClick={changeEditingModeHandler(true)}
          >
            編集
          </button>
        </div>
        <hr />
        <BasicInformation
          userInfo={userInfo}
          email={authenticatedUser?.email}
        />
      </>
    );
  }, [userInfo, changeEditingModeHandler, authenticatedUser?.email]);

  return (
    <div className={styles.container}>
      {isEditingMode ? editingModeContent : viewingModeContent}
      <h2 className={styles.title}>公開ルート</h2>
      <hr />
    </div>
  );
};

export default MypageContent;
