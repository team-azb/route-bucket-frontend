import React, { ChangeEvent, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import {
  signUp,
  CreateUserRequestBody,
  signInWithEmailAndPassword,
} from "../../../api/auth";
import { pagePaths } from "../../../consts/uriComponents";
import {
  isValidEmail,
  isValidUserId,
  isValidUserName,
  isValidPassword,
  isValidPasswordConfirmation,
  isValidBrithdate,
  optionFieldWrapper,
} from "./helper";
import styles from "./style.module.css";

enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHERS = "others",
}

enum FormFields {
  ID = "id",
  NAME = "name",
  EMAIL = "email",
  PASSWORD = "password",
  PASSWORD_CONFIRMATION = "password_confirmation",
  GENDER = "gender",
  BRITHDATE = "birthdate",
}

type Form = {
  [FormFields.ID]: string;
  [FormFields.NAME]: string;
  [FormFields.EMAIL]: string;
  [FormFields.PASSWORD]: string;
  [FormFields.PASSWORD_CONFIRMATION]: string;
  [FormFields.GENDER]?: Gender | "na";
  [FormFields.BRITHDATE]?: Date;
};

const mergeValidationMessageForm = (
  prevValidationMessage: Form,
  newMessages: { [field in FormFields]?: string }
) => {
  return { ...prevValidationMessage, ...newMessages } as Form;
};

const updateValidationMessages = (
  fieldName: FormFields,
  value: string,
  form: Form,
  prevValidationMessage: Form
) => {
  switch (fieldName) {
    case FormFields.ID:
      return mergeValidationMessageForm(prevValidationMessage, {
        [FormFields.ID]: isValidUserId(value)
          ? ""
          : "ユーザーIDのパターンと不一致",
      });
    case FormFields.NAME:
      return mergeValidationMessageForm(prevValidationMessage, {
        [FormFields.NAME]: isValidUserName(value)
          ? ""
          : "ニックネームは1文字以上50文字以下",
      });
    case FormFields.EMAIL:
      return mergeValidationMessageForm(prevValidationMessage, {
        [FormFields.EMAIL]: isValidEmail(value) ? "" : "不適切なemailの形式",
      });
    case FormFields.PASSWORD:
      return mergeValidationMessageForm(prevValidationMessage, {
        [FormFields.PASSWORD]: isValidPassword(value)
          ? ""
          : "パスワードは6文字以上",
        [FormFields.PASSWORD_CONFIRMATION]: isValidPasswordConfirmation(
          value,
          form[FormFields.PASSWORD_CONFIRMATION]
        )
          ? ""
          : "パスワードと不一致",
      });
    case FormFields.PASSWORD_CONFIRMATION:
      return mergeValidationMessageForm(prevValidationMessage, {
        [FormFields.PASSWORD_CONFIRMATION]: isValidPasswordConfirmation(
          value,
          form[FormFields.PASSWORD]
        )
          ? ""
          : "パスワードと不一致",
      });
    case FormFields.BRITHDATE:
      return mergeValidationMessageForm(prevValidationMessage, {
        [FormFields.BRITHDATE]: optionFieldWrapper(value, isValidBrithdate)
          ? ""
          : "生年月日が不適切です",
      });
    default:
      return prevValidationMessage;
  }
};

const SignUpForm = () => {
  const [form, setForm] = useState<Form>({
    id: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    gender: "na",
  });
  const [validatonMessages, setValidatonMessages] = useState<Form>({
    id: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const history = useHistory();

  const changeFormHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => {
      setValidatonMessages((prevValidationMessages) => {
        return updateValidationMessages(
          event.target.name as FormFields,
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
      await signUp(form as CreateUserRequestBody);
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

  const isUnableToSend = (form: Form) => {
    const hasEmptyField = Object.keys(form).some((key) => {
      return form[key as FormFields] === "";
    });

    if (!hasEmptyField) {
      return Object.keys(validatonMessages).some((key) => {
        return validatonMessages[key as FormFields] !== "";
      });
    } else {
      return true;
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
              ※ユーザーの識別のために使用されます。後から変更不可することはできません。
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
              value="na"
              checked={form.gender === "na"}
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
            disabled={isUnableToSend(form)}
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
