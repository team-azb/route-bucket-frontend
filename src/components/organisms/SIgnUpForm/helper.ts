import * as EmailValidator from "email-validator";
import { CreateUserRequestBody } from "../../../api/auth";

const USER_ID_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHERS = "others",
}

export enum RequiredFields {
  ID = "id",
  NAME = "name",
  EMAIL = "email",
  PASSWORD = "password",
  PASSWORD_CONFIRMATION = "password_confirmation",
}

export enum OptionalFields {
  GENDER = "gender",
  BRITHDATE = "birthdate",
}

type RequiredForm = {
  [field in RequiredFields]: string;
};

type OptionalForm = {
  [OptionalFields.GENDER]: Gender | "";
  [OptionalFields.BRITHDATE]: string;
};

export type Form = RequiredForm & OptionalForm;

export const initialFormValue: Form = {
  id: "",
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  gender: "",
  birthdate: "",
};

const emptyOrMessage = (judge: boolean, message: string) => {
  return judge ? "" : message;
};

const mergeValidationMessageForm = (
  prevValidationMessage: Form,
  newMessages: { [field in RequiredFields | OptionalFields]?: string }
) => {
  return { ...prevValidationMessage, ...newMessages } as Form;
};

export const updateValidationMessages = (
  fieldName: RequiredFields | OptionalFields,
  value: string,
  form: Form,
  prevValidationMessage: Form
) => {
  switch (fieldName) {
    case RequiredFields.ID:
      return mergeValidationMessageForm(prevValidationMessage, {
        [RequiredFields.ID]: emptyOrMessage(
          isValidUserId(value),
          "ユーザーIDのパターンと不一致"
        ),
      });
    case RequiredFields.NAME:
      return mergeValidationMessageForm(prevValidationMessage, {
        [RequiredFields.NAME]: emptyOrMessage(
          isValidUserName(value),
          "ニックネームは1文字以上50文字以下"
        ),
      });
    case RequiredFields.EMAIL:
      return mergeValidationMessageForm(prevValidationMessage, {
        [RequiredFields.EMAIL]: emptyOrMessage(
          isValidEmail(value),
          "不適切なemailの形式"
        ),
      });
    case RequiredFields.PASSWORD:
      return mergeValidationMessageForm(prevValidationMessage, {
        [RequiredFields.PASSWORD]: emptyOrMessage(
          isValidPassword(value),
          "パスワードは6文字以上"
        ),
        [RequiredFields.PASSWORD_CONFIRMATION]: emptyOrMessage(
          isValidPasswordConfirmation(
            value,
            form[RequiredFields.PASSWORD_CONFIRMATION]
          ),
          "パスワードと不一致"
        ),
      });
    case RequiredFields.PASSWORD_CONFIRMATION:
      return mergeValidationMessageForm(prevValidationMessage, {
        [RequiredFields.PASSWORD_CONFIRMATION]: emptyOrMessage(
          isValidPasswordConfirmation(value, form[RequiredFields.PASSWORD]),
          "パスワードと不一致"
        ),
      });
    case OptionalFields.BRITHDATE:
      return mergeValidationMessageForm(prevValidationMessage, {
        [OptionalFields.BRITHDATE]: emptyOrMessage(
          optionFieldWrapper(value, isValidBrithdate),
          "生年月日が不適切です"
        ),
      });
    default:
      return prevValidationMessage;
  }
};

const isValidUserId = (value: string) => {
  return USER_ID_REGEX.test(value);
};

const isValidUserName = (value: string) => {
  return value.length > 0 && value.length < 51;
};

const isValidEmail = (value: string) => {
  return EmailValidator.validate(value);
};

const isValidPassword = (value: string) => {
  return value.length > 5;
};

const isValidPasswordConfirmation = (
  password: string,
  confirmation: string
) => {
  return password === confirmation;
};

const isValidBrithdate = (date: string) => {
  const now = new Date();
  return new Date(date) < now;
};

const optionFieldWrapper = (
  value: string,
  callback: (value: string) => boolean
) => {
  return value === "" ? true : callback(value);
};

export const form2payload = (form: Form) => {
  const payload: { [field: string]: string } = {};
  Object.values(RequiredFields).forEach((value) => {
    payload[value] = form[value];
  });

  Object.values(OptionalFields).forEach((value) => {
    if (form[value] !== "") {
      payload[value] = form[value];
    }
  });
  return payload as CreateUserRequestBody;
};

export const isUnableToSend = (form: Form, validatonMessages: Form) => {
  const hasEmptyField = Object.values(RequiredFields).some((key) => {
    return form[key] === "";
  });

  if (!hasEmptyField) {
    return Object.keys(validatonMessages).some((key) => {
      return validatonMessages[key as OptionalFields] !== "";
    });
  } else {
    return true;
  }
};
