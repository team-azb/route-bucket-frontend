import React, { ChangeEvent, useState, useCallback } from "react";
import { useHistory } from "react-router";
import Dialog from "@mui/material/Dialog";
import { toast } from "react-toastify";
import GenderRadioGroup from "../GenderRadioGroup";
import InputWithError from "../../../molecules/InputWithError";
import FormField from "../../../atoms/FormField";
import SubmitButton from "../SubmitButton";
import EmailVerificationDialogContent from "../../../atoms/EmailVerificationDialogContent";
import {
  signUp,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "../../../../api/auth";
import { dynamicPathGenerator } from "../../../../consts/uriComponents";
import {
  Form,
  form2payload,
  initialFormValue,
  isUnableToSend,
  Fields,
  validateAndGetMessages,
} from "./helper";
import styles from "./style.module.css";
import { ValidationMessages } from "../../../../types";

const SignUpForm = () => {
  const [form, setForm] = useState<Form>(initialFormValue);
  const [validatonMessages, setValidatonMessages] =
    useState<ValidationMessages>(initialFormValue);
  const [dialogFlag, setDialogFlag] = useState(false);
  const history = useHistory();

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
      setForm((prevForm) => {
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

  const sendFormHandler = async () => {
    try {
      const payload = form2payload(form);
      await signUp(payload);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
    }
    const user = await signInWithEmailAndPassword(form.email, form.password);
    await sendEmailVerification(user);
    setDialogFlag(true);
  };

  const handleClose = useCallback(async () => {
    try {
      setDialogFlag(false);
      toast.success("サインイン成功");
      history.push(dynamicPathGenerator.mypage(user.uid));
    } catch (error) {
      toast.error("サインイン失敗");
    }
  }, [history]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <FormField>
          <label className={styles.label}>
            ID
            <br />
            <span className={styles.span}>
              ※ユーザーの識別のために使用されます。後から変更することはできません。
            </span>
          </label>
          <InputWithError
            id="id"
            name="id"
            type="text"
            onChange={changeFormHandler}
            errorMessage={validatonMessages.id}
          />
        </FormField>
        <FormField>
          <label className={styles.label}>ニックネーム</label>
          <InputWithError
            id="name"
            name="name"
            type="text"
            onChange={changeFormHandler}
            errorMessage={validatonMessages.name}
          />
        </FormField>
        <FormField>
          <label className={styles.label}>メールアドレス</label>
          <InputWithError
            id="enamil"
            name="email"
            type="email"
            onChange={changeFormHandler}
            errorMessage={validatonMessages.email}
          />
        </FormField>
        <FormField>
          <label className={styles.label}>パスワード</label>
          <InputWithError
            id="password"
            name="password"
            type="password"
            onChange={changeFormHandler}
            errorMessage={validatonMessages.password}
          />
        </FormField>
        <FormField>
          <label className={styles.label}>パスワード(確認用)</label>
          <InputWithError
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            onChange={changeFormHandler}
            errorMessage={validatonMessages.password_confirmation}
          />
        </FormField>
        <FormField>
          <label className={styles.label}>（オプション）性別</label>
          <GenderRadioGroup gender={form.gender} onChange={changeFormHandler} />
        </FormField>
        <FormField>
          <label className={styles.label}>（オプション）生年月日</label>
          <InputWithError
            id="birthdate"
            name="birthdate"
            type="date"
            onChange={changeFormHandler}
            errorMessage={validatonMessages.birthdate}
          />
        </FormField>
        <FormField className={styles.buttonWrapper}>
          <SubmitButton
            disabled={isUnableToSend(form, validatonMessages)}
            onClick={sendFormHandler}
          >
            サインアップ
          </SubmitButton>
        </FormField>
      </div>
      <Dialog open={dialogFlag} onClose={handleClose}>
        <EmailVerificationDialogContent
          email={form.email}
          handleClose={handleClose}
        />
      </Dialog>
    </div>
  );
};

export default SignUpForm;
