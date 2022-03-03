import React, { useCallback, useContext, useMemo, useState } from "react";
import BasicInformation from "../BasicInformation";
import { useSignedInUserInfoContext } from "../../../../contexts/signedInUserContext";
import styles from "./style.module.css";
import { UserInfoContext } from "../UserInfoProvider";
import BasicInformationUpdateForm from "../BasicInformationUpdateForm";

const MypageContent = () => {
  const userInfo = useContext(UserInfoContext);
  const { signedInUser } = useSignedInUserInfoContext();
  const [isEditMode, setIsEditMode] = useState(false);

  const changeEditModeHandler = useCallback((isActive: boolean) => {
    return () => {
      setIsEditMode(isActive);
    };
  }, []);

  const editModeContent = useMemo(() => {
    return (
      <>
        <div className={styles.row}>
          <h2 className={styles.title}>基本情報</h2>
        </div>
        <hr />
        <BasicInformationUpdateForm
          userInfo={userInfo}
          exitEditModeHandler={changeEditModeHandler(false)}
        />
      </>
    );
  }, [userInfo, changeEditModeHandler]);

  const viewModeContent = useMemo(() => {
    return (
      <>
        <div className={styles.row}>
          <h2 className={styles.title}>基本情報</h2>
          <button
            className={styles.button}
            onClick={changeEditModeHandler(true)}
          >
            編集
          </button>
        </div>
        <hr />
        <BasicInformation userInfo={userInfo} email={signedInUser?.email} />
      </>
    );
  }, [userInfo, changeEditModeHandler, signedInUser?.email]);

  return (
    <div className={styles.container}>
      {isEditMode ? editModeContent : viewModeContent}
      <h2 className={styles.title}>公開ルート</h2>
      <hr />
    </div>
  );
};

export default MypageContent;
