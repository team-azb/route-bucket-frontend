import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserInfo, ValidationMessages } from "../../../../types";
import IconImageUpload from "../IconImageUpload";
import FormField from "../../../atoms/FormField";
import InputWithError from "../../../molecules/InputWithError";
import { useSignedInUserInfoContext } from "../../../../contexts/AuthenticationProvider";
import { Fields, Form, isUnableToSend, validateAndGetMessages } from "./helper";
import { updateUser } from "../../../../api/users";
import styles from "./style.module.css";
import { toast } from "react-toastify";
import { pagePaths } from "../../../../consts/uriComponents";

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
    useState<ValidationMessages>({});
  const [previewFile, setPreviewFile] = useState<File>();
  const previewUrl = useMemo(() => {
    return previewFile ? URL.createObjectURL(previewFile) : userInfo.icon_url;
  }, [previewFile, userInfo.icon_url]);
  const { authenticatedUser } = useSignedInUserInfoContext();
  const history = useHistory();

  const asyncUpdatgeValidationMessages = async (
    fieldName: Fields,
    value: string
  ) => {
    const result = await validateAndGetMessages(fieldName, value);
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
          event.target.value
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

  const submitFormHandler = useCallback(async () => {
    const token = await authenticatedUser?.getIdToken();
    if (token) {
      try {
        await updateUser(userInfo.id, token, userInfoForm);
        toast.success("ユーザー情報の更新に成功");
        exitEditingModeHandler();
        history.push(pagePaths.mypage(userInfo.id));
      } catch (error) {
        toast.error("ユーザー情報の更新に失敗");
      }
    } else {
      toast.error("ユーザートークンの取得に失敗");
    }
  }, [
    authenticatedUser,
    userInfo.id,
    userInfoForm,
    exitEditingModeHandler,
    history,
  ]);

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
          <button
            disabled={isUnableToSend(userInfoForm, validatonMessages)}
            className={styles.submitButton}
            onClick={submitFormHandler}
          >
            更新
          </button>
          <button className={styles.button} onClick={exitEditingModeHandler}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationUpdateForm;
