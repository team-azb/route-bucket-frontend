import { CreateUserRequestBody } from "../../../../api/auth";
import { validateUserInfo } from "../../../../api/users";
import {
  Gender,
  ValidationErrorCode,
  ValidationMessages,
} from "../../../../types";

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

const errorCode2ErrorMessage = (
  code: ValidationErrorCode | undefined,
  invalidFormatMsg: string,
  alreadyExistsMsg: string = "",
  reservedWordMsg: string = ""
): string => {
  switch (code) {
    case "INVALID_FORMAT":
      return invalidFormatMsg;
    case "ALREADY_EXISTS":
      return alreadyExistsMsg;
    case "RESERVED_WORD":
      return reservedWordMsg;
    default:
      return "";
  }
};

const passwordConfimationErrorMessage = (
  password: string,
  confirmation: string
) => {
  return password === confirmation ? "" : "パスワードと不一致";
};

export const validateAndGetMessages = async (
  fieldName: Fields,
  value: string,
  prevForm: Form
): Promise<ValidationMessages> => {
  switch (fieldName) {
    case RequiredFields.ID:
      const { id } = await validateUserInfo({ [fieldName]: value });
      return {
        [RequiredFields.ID]: errorCode2ErrorMessage(
          id,
          "ユーザーIDのパターンと不一致",
          "すでに登録されているid",
          "そのidは使用できない文字列です"
        ),
      };
    case RequiredFields.NAME:
      const { name } = await validateUserInfo({ [fieldName]: value });
      return {
        [RequiredFields.NAME]: errorCode2ErrorMessage(
          name,
          "ニックネームは1文字以上50文字以下"
        ),
      };
    case RequiredFields.EMAIL:
      const { email } = await validateUserInfo({ [fieldName]: value });
      return {
        [RequiredFields.EMAIL]: errorCode2ErrorMessage(
          email,
          "不適切なemailの形式",
          "すでに登録されているemail"
        ),
      };
    case RequiredFields.PASSWORD:
      const { password } = await validateUserInfo({ [fieldName]: value });
      return {
        [RequiredFields.PASSWORD]: errorCode2ErrorMessage(
          password,
          "パスワードは6文字以上"
        ),
        [RequiredFields.PASSWORD_CONFIRMATION]: passwordConfimationErrorMessage(
          value,
          prevForm.password_confirmation
        ),
      };
    case RequiredFields.PASSWORD_CONFIRMATION:
      return {
        [RequiredFields.PASSWORD_CONFIRMATION]: passwordConfimationErrorMessage(
          prevForm.password,
          value
        ),
      };
    case OptionalFields.BRITHDATE:
      const { birthdate } = await validateUserInfo({ [fieldName]: value });
      return {
        [OptionalFields.BRITHDATE]: errorCode2ErrorMessage(
          birthdate,
          "生年月日が不適切です"
        ),
      };
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
