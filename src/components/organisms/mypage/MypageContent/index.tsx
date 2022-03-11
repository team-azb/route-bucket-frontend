import React, { useCallback, useContext, useMemo, useState } from "react";
import BasicInformation from "../BasicInformation";
import { useSignedInUserInfoContext } from "../../../../contexts/signedInUserContext";
import styles from "./style.module.css";
import { UserInfoContext } from "../UserInfoProvider";
import BasicInformationUpdateForm from "../BasicInformationUpdateForm";

const MypageContent = () => {
  const userInfo = useContext(UserInfoContext);
  const { signedInUser } = useSignedInUserInfoContext();
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
        <BasicInformation userInfo={userInfo} email={signedInUser?.email} />
      </>
    );
  }, [userInfo, changeEditingModeHandler, signedInUser?.email]);

  return (
    <div className={styles.container}>
      {isEditingMode ? editingModeContent : viewingModeContent}
      <h2 className={styles.title}>公開ルート</h2>
      <hr />
    </div>
  );
};

export default MypageContent;
