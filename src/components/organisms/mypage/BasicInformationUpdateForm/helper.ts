import {
  validateUserInfo,
  errorCode2ErrorMessage,
} from "../../../../api/users";
import { ValidationMessages } from "../../../../types";

export enum Fields {
  NAME = "name",
  BIRTHDATE = "birthdate",
}

export type Form = {
  [field in Fields]: string;
};

export const validateBasicInfoFormFieldAndGetMessages = async (
  fieldName: Fields,
  value: string
): Promise<ValidationMessages> => {
  switch (fieldName) {
    case Fields.NAME: {
      const { name } = await validateUserInfo({ [fieldName]: value });
      return {
        [Fields.NAME]: errorCode2ErrorMessage(
          name,
          "ニックネームは1文字以上50文字以下"
        ),
      };
    }
    case Fields.BIRTHDATE: {
      const { birthdate } = await validateUserInfo({ [fieldName]: value });
      return {
        [Fields.BIRTHDATE]: errorCode2ErrorMessage(
          birthdate,
          "生年月日が不適切です"
        ),
      };
    }

    default:
      return {};
  }
};

export const isInvalidForm = (
  form: Form,
  validatonMessages: ValidationMessages
) => {
  const hasEmptyField = Object.values(Fields).some((key) => {
    return form[key] === "";
  });

  if (!hasEmptyField) {
    return Object.keys(validatonMessages).some((key) => {
      return validatonMessages[key as Fields] !== "";
    });
  } else {
    return true;
  }
};
