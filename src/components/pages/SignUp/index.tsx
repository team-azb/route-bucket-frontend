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
} from "./helper";
import "./style.css";

enum FormFields {
  ID = "id",
  NAME = "name",
  EMAIL = "email",
  PASSWORD = "password",
  PASSWORD_CONFIRMATION = "password_confirmation",
}

type Form = {
  [field in FormFields]: string;
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
  }
};

const SignUp = () => {
  const [form, setForm] = useState<Form>({
    id: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
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
    <div className="signup__container">
      <h1 className="signup__title">サインアップ</h1>
      <hr />
      <div className="signup__form--wrapper">
        <div className="signup__form--container">
          <div className="signup__form--field">
            <label htmlFor="id" className="signup__form--label">
              ID
              <br />
              <span className="signup__form--span">
                ※ユーザーの識別のために使用されます。後から変更不可することはできません。
              </span>
            </label>
            <input
              type="text"
              name="id"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
            <label className="signup__form--error-label" htmlFor="id">
              {validatonMessages.id}
            </label>
          </div>
          <div className="signup__form--field">
            <label htmlFor="name" className="signup__form--label">
              ニックネーム
              <br />
              <span className="signup__form--span">
                ※IDとは別にユーザー名として使用されます。後から変更可能です。
              </span>
            </label>
            <input
              type="text"
              name="name"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
            <label className="signup__form--error-label" htmlFor="name">
              {validatonMessages.name}
            </label>
          </div>
          <div className="signup__form--field">
            <label htmlFor="email" className="signup__form--label">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
            <label className="signup__form--error-label" htmlFor="email">
              {validatonMessages.email}
            </label>
          </div>
          <div className="signup__form--field">
            <label htmlFor="password" className="signup__form--label">
              パスワード
            </label>
            <input
              type="password"
              name="password"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
            <label className="signup__form--error-label" htmlFor="password">
              {validatonMessages.password}
            </label>
          </div>
          <div className="signup__form--field">
            <label htmlFor="confirmation" className="signup__form--label">
              パスワード(確認用)
            </label>
            <input
              type="password"
              name="password_confirmation"
              className="signup__form--input"
              onChange={changeFormHandler}
            />
            <label className="signup__form--error-label" htmlFor="confirmation">
              {validatonMessages.password_confirmation}
            </label>
          </div>
          <div className="signup__form--field">
            <button
              disabled={isUnableToSend(form)}
              className="signup__form--button"
              onClick={sendFormHandler}
            >
              サインアップ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
