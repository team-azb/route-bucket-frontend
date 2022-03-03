import React, { useCallback, useContext, useState } from "react";
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

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <h2 className={styles.title}>基本情報</h2>
        {isEditMode || (
          <button
            className={styles.button}
            onClick={changeEditModeHandler(true)}
          >
            編集
          </button>
        )}
      </div>
      <hr />
      {isEditMode ? (
        <BasicInformationUpdateForm
          userInfo={userInfo}
          exitEditModeHandler={changeEditModeHandler(false)}
        />
      ) : (
        <BasicInformation userInfo={userInfo} email={signedInUser?.email} />
      )}
      <h2 className={styles.title}>公開ルート</h2>
      <hr />
    </div>
  );
};

export default MypageContent;
