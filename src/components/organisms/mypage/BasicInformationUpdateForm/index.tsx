import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { UserInfo, ValidationMessages } from "../../../../types";
import IconImageUpload from "../IconImageUpload";
import FormField from "../../../atoms/FormField";
import InputWithError from "../../../molecules/InputWithError";
import styles from "./style.module.css";
import { Fields, Form, validateAndGetMessages } from "./helper";

type BasicInformationUpdateFormProps = {
  exitEditingModeHandler: () => void;
  userInfo: UserInfo;
};

const BasicInformationUpdateForm = ({
  exitEditingModeHandler,
  userInfo,
}: BasicInformationUpdateFormProps) => {
  const [userInfoForm, setUserInfoForm] = useState<Form>(userInfo as Form);
  const [validatonMessages, setValidatonMessages] =
    useState<ValidationMessages>();
  const [previewFile, setPreviewFile] = useState<File>();
  const previewUrl = useMemo(() => {
    return previewFile ? URL.createObjectURL(previewFile) : userInfo.icon_url;
  }, [previewFile, userInfo.icon_url]);

  const asyncUpdatgeValidationMessages = async (
    fieldName: Fields,
    value: string,
    prevForm: Form
  ) => {
    const result = await validateAndGetMessages(fieldName, value, prevForm);
    setValidatonMessages((prevState) => {
      return {
        ...prevState,
        ...result,
      };
    });
  };

  const changeFormHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setUserInfoForm((prevForm) => {
        asyncUpdatgeValidationMessages(
          event.target.name as Fields,
          event.target.value,
          prevForm
        );
        return {
          ...prevForm,
          [event.target.name]: event.target.value,
        };
      });
    },
    []
  );

  const changeImageHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setPreviewFile(event.target.files[0]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <IconImageUpload src={previewUrl} onChange={changeImageHandler} />
        <div className={styles.fieldContainer}>
          <FormField className={styles.field}>
            <label className={styles.label}>ニックネーム</label>
            <InputWithError
              id="name"
              name="name"
              type="text"
              value={userInfoForm.name}
              onChange={changeFormHandler}
              errorMessage={validatonMessages?.name}
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
              errorMessage={validatonMessages?.birthdate}
            />
          </FormField>
          <button className={styles.submitButton}>更新</button>
          <button className={styles.button} onClick={exitEditingModeHandler}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationUpdateForm;
