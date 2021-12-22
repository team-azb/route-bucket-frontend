import React, { ChangeEvent, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import GenderRadioGroup from "../GenderRadioGroup";
import InputWithError from "../../../molecules/InputWithError";
import FormField from "../../../atoms/FormField";
import SubmitButton from "../SubmitButton";
import { signUp, signInWithEmailAndPassword } from "../../../../api/auth";
import { pagePaths } from "../../../../consts/uriComponents";
import {
  Form,
  updateValidationMessages,
  form2payload,
  initialFormValue,
  isUnableToSend,
  Fields,
} from "./helper";
import styles from "./style.module.css";

const SignUpForm = () => {
  const [form, setForm] = useState<Form>(initialFormValue);
  const [validatonMessages, setValidatonMessages] =
    useState<Form>(initialFormValue);
  const history = useHistory();

  const changeFormHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => {
      setValidatonMessages((prevValidationMessages) => {
        return updateValidationMessages(
          event.target.name as Fields,
          event.target.value,
          prevForm,
          prevValidationMessages
        );
      });
      return {
        ...prevForm,
        [event.target.name]: event.target.value,
      };
    });
  };

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
    try {
      await signInWithEmailAndPassword(form.email, form.password);
      toast.success("サインイン成功");
      history.push(pagePaths.ROUTE_INDEX);
    } catch (error) {
      toast.error("サインイン失敗");
    }
  };

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
    </div>
  );
};

export default SignUpForm;
