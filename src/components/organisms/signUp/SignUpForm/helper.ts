import { CreateUserRequestBody } from "../../../../api/auth";
import { validateUserInfo } from "../../../../api/users";
import { Gender, ValidationMessages } from "../../../../types";

enum RequiredFields {
  ID = "id",
  NAME = "name",
  EMAIL = "email",
  PASSWORD = "password",
  PASSWORD_CONFIRMATION = "password_confirmation",
}

enum OptionalFields {
  GENDER = "gender",
  BRITHDATE = "birthdate",
}

export type Fields = RequiredFields | OptionalFields;

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

export const validateAndGetMessages = async (
  fieldName: Fields,
  value: string,
  prevForm: Form
): Promise<ValidationMessages> => {
  switch (fieldName) {
    case RequiredFields.ID:
      const { id } = await validateUserInfo({ [fieldName]: value });
      if (id === "INVALID_FORMAT") {
        return { [RequiredFields.ID]: "ユーザーIDのパターンと不一致" };
      } else if (id === "ALREADY_EXISTS") {
        return { [RequiredFields.ID]: "すでに登録されているid" };
      } else {
        return { [RequiredFields.ID]: "" };
      }
    case RequiredFields.NAME:
      const { name } = await validateUserInfo({ [fieldName]: value });
      if (name === "INVALID_FORMAT") {
        return { [RequiredFields.NAME]: "ニックネームは1文字以上50文字以下" };
      } else {
        return { [RequiredFields.NAME]: "" };
      }
    case RequiredFields.EMAIL:
      const { email } = await validateUserInfo({ [fieldName]: value });
      if (email === "INVALID_FORMAT") {
        return { [RequiredFields.EMAIL]: "不適切なemailの形式" };
      } else if (email === "ALREADY_EXISTS") {
        return { [RequiredFields.EMAIL]: "すでに登録されているemail" };
      } else {
        return { [RequiredFields.EMAIL]: "" };
      }
    case RequiredFields.PASSWORD:
      const { password } = await validateUserInfo({ [fieldName]: value });
      let result: ValidationMessages;
      if (value !== prevForm.password) {
        result = {
          [RequiredFields.PASSWORD_CONFIRMATION]: "パスワードと不一致",
        };
      } else {
        result = { [RequiredFields.PASSWORD_CONFIRMATION]: "" };
      }
      if (password === "INVALID_FORMAT") {
        result = {
          ...result,
          [RequiredFields.PASSWORD]: "パスワードは6文字以上",
        };
      } else {
        result = { ...result, [RequiredFields.PASSWORD]: "" };
      }
      return result;
    case RequiredFields.PASSWORD_CONFIRMATION:
      if (value !== prevForm.password) {
        return { [RequiredFields.PASSWORD_CONFIRMATION]: "パスワードと不一致" };
      } else {
        return { [RequiredFields.PASSWORD_CONFIRMATION]: "" };
      }
    case OptionalFields.BRITHDATE:
      const { birthdate } = await validateUserInfo({ [fieldName]: value });
      if (birthdate === "INVALID_FORMAT") {
        return { [OptionalFields.BRITHDATE]: "生年月日が不適切です" };
      } else {
        return { [OptionalFields.BRITHDATE]: "" };
      }
    default:
      return {};
  }
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

export const isUnableToSend = (
  form: Form,
  validatonMessages: ValidationMessages
) => {
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
