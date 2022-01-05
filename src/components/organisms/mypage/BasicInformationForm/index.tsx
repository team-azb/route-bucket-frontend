import React, { useState } from "react";
import { UserInfo } from "../../../../types";
import BasicInformationField from "../BasicInformationField";
import IconImage from "../IconImage";
import styles from "./style.module.css";

type BasicInformationFormProps = {
  exitEditModeHandler: () => void;
  userInfo: UserInfo;
};

const BasicInformationForm = ({
  exitEditModeHandler,
  userInfo,
}: BasicInformationFormProps) => {
  const [userInfoForm, setUserInfoForm] = useState<UserInfo>(userInfo);
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <IconImage src={userInfoForm.icon_url} />
        <div className={styles.fieldContainer}>
          <BasicInformationField
            id="name"
            labelName="ニックネーム"
            fieldValue={userInfoForm.name}
          />
          <BasicInformationField
            id="birthdate"
            labelName="生年月日"
            fieldValue={userInfoForm.birthdate}
          />
        </div>
      </div>
      <div className={[styles.row, styles.buttonWrapper].join(" ")}>
        <button className={styles.button}>更新</button>
        <button className={styles.button} onClick={exitEditModeHandler}>
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default BasicInformationForm;
