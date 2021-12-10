import React, { ChangeEvent, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  signUp,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "../../../api/auth";
import { pagePaths } from "../../../consts/uriComponents";
import {
  Form,
  updateValidationMessages,
  RequiredFields,
  OptionalFields,
  form2payload,
  initialFormValue,
  isUnableToSend,
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
          event.target.name as RequiredFields | OptionalFields,
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
      const user = await signInWithEmailAndPassword(form.email, form.password);
      await sendEmailVerification(user);
      toast.success("サインイン成功");
      history.push(pagePaths.ROUTE_INDEX);
    } catch (error) {
      toast.error("サインイン失敗");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.field}>
          <label htmlFor="id" className={styles.label}>
            ID
            <br />
            <span className={styles.span}>
              ※ユーザーの識別のために使用されます。後から変更することはできません。
            </span>
          </label>
          <input
            type="text"
            name="id"
            className={styles.input}
            onChange={changeFormHandler}
          />
          <label className={styles.errorLabel} htmlFor="id">
            {validatonMessages.id}
          </label>
        </div>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            ニックネーム
            <br />
            <span className={styles.span}>
              ※IDとは別にユーザー名として使用されます。後から変更可能です。
            </span>
          </label>
          <input
            type="text"
            name="name"
            className={styles.input}
            onChange={changeFormHandler}
          />
          <label className={styles.errorLabel} htmlFor="name">
            {validatonMessages.name}
          </label>
        </div>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            className={styles.input}
            onChange={changeFormHandler}
          />
          <label className={styles.errorLabel} htmlFor="email">
            {validatonMessages.email}
          </label>
        </div>
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            パスワード
          </label>
          <input
            type="password"
            name="password"
            className={styles.input}
            onChange={changeFormHandler}
          />
          <label className={styles.errorLabel} htmlFor="password">
            {validatonMessages.password}
          </label>
        </div>
        <div className={styles.field}>
          <label htmlFor="confirmation" className={styles.label}>
            パスワード(確認用)
          </label>
          <input
            type="password"
            name="password_confirmation"
            className={styles.input}
            onChange={changeFormHandler}
          />
          <label className={styles.errorLabel} htmlFor="confirmation">
            {validatonMessages.password_confirmation}
          </label>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>（オプション）性別</label>
          <div className={styles.radioGroupContainer}>
            <input
              className={styles.radioGroupRadio}
              id="male"
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={changeFormHandler}
            />
            <label className={styles.radioGroupLabel} htmlFor="male">
              男性
            </label>
            <input
              className={styles.radioGroupRadio}
              id="female"
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={changeFormHandler}
            />
            <label className={styles.radioGroupLabel} htmlFor="female">
              女性
            </label>
            <input
              className={styles.radioGroupRadio}
              id="others"
              type="radio"
              name="gender"
              value="others"
              checked={form.gender === "others"}
              onChange={changeFormHandler}
            />
            <label className={styles.radioGroupLabel} htmlFor="others">
              その他
            </label>
            <input
              className={styles.radioGroupRadio}
              id="na"
              type="radio"
              name="gender"
              value=""
              checked={form.gender === ""}
              onChange={changeFormHandler}
            />
            <label className={styles.radioGroupLabel} htmlFor="na">
              未回答
            </label>
          </div>
          <label className={styles.errorLabel} htmlFor="confirmation">
            {validatonMessages.gender}
          </label>
        </div>
        <div className={styles.field}>
          <label htmlFor="birthdate" className={styles.label}>
            （オプション）生年月日
          </label>
          <input
            type="date"
            name="birthdate"
            className={styles.input}
            onChange={changeFormHandler}
          />
          <label className={styles.errorLabel} htmlFor="birthdate">
            {validatonMessages.birthdate}
          </label>
        </div>
        <div className={[styles.field, styles.buttonWrapper].join(" ")}>
          <button
            disabled={isUnableToSend(form, validatonMessages)}
            className={styles.button}
            onClick={sendFormHandler}
          >
            サインアップ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
