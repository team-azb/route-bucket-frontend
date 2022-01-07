import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { UserInfo, ValidationMessages } from "../../../../types";
import IconImageUpload from "../IconImageUpload";
import FormField from "../../../atoms/form/FormField";
import FormLabel from "../../../atoms/form/FormLabel";
import InputWithError from "../../../molecules/InputWithError";
import { useAuthenticationInfoContext } from "../../../../contexts/AuthenticationProvider";
import { Fields, Form, isUnableToSend, validateAndGetMessages } from "./helper";
import { updateUser } from "../../../../api/users";
import styles from "./style.module.css";
import { toast } from "react-toastify";
import { dynamicPathGenerator } from "../../../../consts/uriComponents";
import { uploadUserIconAndGetUrl } from "../../../../api/storage";

type BasicInformationFormProps = {
  exitEditModeHandler: () => void;
  userInfo: UserInfo;
};

const BasicInformationForm = ({
  exitEditModeHandler,
  userInfo,
}: BasicInformationFormProps) => {
  const [userInfoForm, setUserInfoForm] = useState<Form>(userInfo as Form);
  const [validatonMessages, setValidatonMessages] =
    useState<ValidationMessages>({});
  const [previewFile, setPreviewFile] = useState<File>();
  const previewUrl = useMemo(() => {
    return previewFile ? URL.createObjectURL(previewFile) : userInfo.icon_url;
  }, [previewFile, userInfo.icon_url]);
  const { authenticatedUser } = useAuthenticationInfoContext();
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
        const iconUrl =
          previewFile &&
          (await uploadUserIconAndGetUrl(userInfo.id, previewFile));
        await updateUser(userInfo.id, token, {
          ...userInfoForm,
          icon_url: iconUrl,
        });
        toast.success("ユーザー情報の更新に成功");
        history.push(dynamicPathGenerator.mypage(userInfo.id));
      } catch (error) {
        toast.error("ユーザー情報の更新に失敗");
      }
    } else {
      toast.error("ユーザートークンの取得に失敗");
    }
  }, [authenticatedUser, previewFile, userInfo.id, userInfoForm, history]);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <IconImageUpload src={previewUrl} onChange={changeImageHandler} />
        <div className={styles.fieldContainer}>
          <FormField className={styles.field}>
            <FormLabel>ニックネーム</FormLabel>
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
            <FormLabel>生年月日</FormLabel>
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
          <button className={styles.button} onClick={exitEditModeHandler}>
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInformationForm;
