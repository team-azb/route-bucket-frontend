import React, { ChangeEvent, useState, useCallback } from "react";
import { useHistory } from "react-router";
import Dialog from "@mui/material/Dialog";
import { toast } from "react-toastify";
import GenderRadioGroup from "../GenderRadioGroup";
import InputWithError from "../../../molecules/InputWithError";
import FormField from "../../../atoms/form/FormField";
import FormContainer from "../../../atoms/form/FormContainer";
import SingleFormWrapper from "../../../atoms/form/SingleFormWrapper";
import FormLabel from "../../../atoms/form/FormLabel";
import SubmitButton from "../../../atoms/form/SubmitButton";
import EmailVerificationDialogContent from "../../../atoms/EmailVerificationDialogContent";
import {
  signUp,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "../../../../api/auth";
import { pagePaths } from "../../../../consts/uriComponents";
import {
  Form,
  form2payload,
  initialFormValue,
  isInvalidForm,
  Fields,
  validateSignUpFormFieldAndGetMessages,
} from "./helper";
import styles from "./style.module.css";
import { ValidationMessages } from "../../../../types";

const SignUpForm = () => {
  const [form, setForm] = useState<Form>(initialFormValue);
  const [validationMessages, setvalidationMessages] =
    useState<ValidationMessages>(initialFormValue);
  const [dialogFlag, setDialogFlag] = useState(false);
  const history = useHistory();

  const asyncUpdateValidationMessages = async (
    fieldName: Fields,
    value: string,
    prevForm: Form
  ) => {
    const result = await validateSignUpFormFieldAndGetMessages(
      fieldName,
      value,
      prevForm
    );
    setvalidationMessages((prevState) => {
      return {
        ...prevState,
        ...result,
      };
    });
  };

  const changeFormHandler = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prevForm) => {
        asyncUpdateValidationMessages(
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
    setDialogFlag(true);
  };

  const handleClose = useCallback(async () => {
    try {
      const user = await signInWithEmailAndPassword(form.email, form.password);
      await sendEmailVerification(user);
      setDialogFlag(false);
      toast.success("サインインに成功しました。");
      history.push(pagePaths.mypage(user.uid));
    } catch (error) {
      toast.error("サインインに失敗しました。");
    }
  }, [form.email, form.password, history]);

  return (
    <SingleFormWrapper>
      <FormContainer className={styles.container} isPureForm={false}>
        <FormField className={styles.field}>
          <FormLabel>
            ID
            <br />
            <span className={styles.span}>
              ※ユーザーの識別のために使用されます。後から変更することはできません。
            </span>
          </FormLabel>
          <InputWithError
            id="id"
            name="id"
            type="text"
            onChange={changeFormHandler}
            errorMessage={validationMessages.id}
          />
        </FormField>
        <FormField className={styles.field}>
          <FormLabel>ニックネーム</FormLabel>
          <InputWithError
            id="name"
            name="name"
            type="text"
            onChange={changeFormHandler}
            errorMessage={validationMessages.name}
          />
        </FormField>
        <FormField className={styles.field}>
          <FormLabel>メールアドレス</FormLabel>
          <InputWithError
            id="enamil"
            name="email"
            type="email"
            onChange={changeFormHandler}
            errorMessage={validationMessages.email}
          />
        </FormField>
        <FormField className={styles.field}>
          <FormLabel>パスワード</FormLabel>
          <InputWithError
            id="password"
            name="password"
            type="password"
            onChange={changeFormHandler}
            errorMessage={validationMessages.password}
          />
        </FormField>
        <FormField className={styles.field}>
          <FormLabel>パスワード(確認用)</FormLabel>
          <InputWithError
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            onChange={changeFormHandler}
            errorMessage={validationMessages.password_confirmation}
          />
        </FormField>
        <FormField className={styles.field}>
          <FormLabel>（オプション）性別</FormLabel>
          <GenderRadioGroup gender={form.gender} onChange={changeFormHandler} />
        </FormField>
        <FormField className={styles.field}>
          <FormLabel>（オプション）生年月日</FormLabel>
          <InputWithError
            id="birthdate"
            name="birthdate"
            type="date"
            onChange={changeFormHandler}
            errorMessage={validationMessages.birthdate}
          />
        </FormField>
        <FormField className={styles.buttonWrapper}>
          <SubmitButton
            disabled={isInvalidForm(form, validationMessages)}
            onClick={sendFormHandler}
          >
            サインアップ
          </SubmitButton>
        </FormField>
      </FormContainer>
      <Dialog open={dialogFlag} onClose={handleClose}>
        <EmailVerificationDialogContent
          email={form.email}
          handleClose={handleClose}
        />
      </Dialog>
    </SingleFormWrapper>
  );
};

export default SignUpForm;
