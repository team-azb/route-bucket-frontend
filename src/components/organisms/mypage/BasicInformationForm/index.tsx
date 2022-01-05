import React, { ChangeEvent, useCallback, useState } from "react";
import { UserInfo } from "../../../../types";
import IconImage from "../IconImage";
import FormField from "../../../atoms/FormField";
import InputWithError from "../../../molecules/InputWithError";
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
  const changeFormHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUserInfoForm((prevForm) => {
        return {
          ...prevForm,
          [event.target.name]: event.target.value,
        };
      });
    },
    []
  );

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <IconImage src={userInfoForm.icon_url} />
        <div className={styles.fieldContainer}>
          <FormField className={styles.field}>
            <label className={styles.label}>ニックネーム</label>
            <InputWithError
              id="name"
              name="name"
              type="text"
              value={userInfoForm.name}
              onChange={changeFormHandler}
              errorMessage=""
            />
          </FormField>
          <FormField className={styles.field}>
            <label className={styles.label}>生年月日</label>
            <InputWithError
              id="birthdate"
              name="birthdate"
              type="date"
              value={userInfoForm.birthdate}
              onChange={changeFormHandler}
              errorMessage=""
            />
          </FormField>
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
