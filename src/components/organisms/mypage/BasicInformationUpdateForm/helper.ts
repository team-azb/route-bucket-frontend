import {
  validateUserInfo,
  usersRespErrCode2ErrMsg,
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
        [Fields.NAME]: usersRespErrCode2ErrMsg(
          name,
          "ニックネームは1文字以上50文字以下"
        ),
      };
    }
    case Fields.BIRTHDATE: {
      const { birthdate } = await validateUserInfo({ [fieldName]: value });
      return {
        [Fields.BIRTHDATE]: usersRespErrCode2ErrMsg(
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
  validationMessages: ValidationMessages
) => {
  const hasEmptyField = Object.values(Fields).some((key) => {
    return form[key] === "";
  });

  if (!hasEmptyField) {
    return Object.keys(validationMessages).some((key) => {
      return validationMessages[key as Fields] !== "";
    });
  } else {
    return true;
  }
};
