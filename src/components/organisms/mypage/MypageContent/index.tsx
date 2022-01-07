import React, { useCallback, useState } from "react";
import BasicInformation from "../BasicInformation";
import { useAuthenticationInfoContext } from "../../../../contexts/AuthenticationProvider";
import styles from "./style.module.css";
import { useUserInfo } from "../../../../contexts/UserInfoProvider";
import BasicInformationForm from "../BasicInformationForm";
import PageContainer from "../../../atoms/PageContainer";
import PageTitle from "../../../atoms/PageTitle";

const MypageContent = () => {
  const userInfo = useUserInfo();
  const { authenticatedUser } = useAuthenticationInfoContext();
  const [isEditMode, setIsEditMode] = useState(false);

  const changeEditModeHandler = useCallback((isActive: boolean) => {
    return () => {
      setIsEditMode(isActive);
    };
  }, []);

  return (
    <PageContainer>
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
        <BasicInformationForm
          userInfo={userInfo}
          exitEditModeHandler={changeEditModeHandler(false)}
        />
      ) : (
        <BasicInformation
          userInfo={userInfo}
          email={authenticatedUser?.email}
        />
      )}
      <PageTitle title="公開ルート" />
    </PageContainer>
  );
};

export default MypageContent;
