import { validateUserInfo } from "../../../../api/users";
import { errorCode2ErrorMessage } from "../../../../helpers/form";
import { ValidationMessages } from "../../../../types";

export enum Fields {
  NAME = "name",
  BIRTHDATE = "birthdate",
}

export type Form = {
  [field in Fields]: string;
};

export const validateAndGetMessages = async (
  fieldName: Fields,
  value: string,
  prevForm: Form
): Promise<ValidationMessages> => {
  switch (fieldName) {
    case Fields.NAME:
      const { name } = await validateUserInfo({ [fieldName]: value });
      return {
        [Fields.NAME]: errorCode2ErrorMessage(
          name,
          "ニックネームは1文字以上50文字以下"
        ),
      };
    case Fields.BIRTHDATE:
      const { birthdate } = await validateUserInfo({ [fieldName]: value });
      return {
        [Fields.BIRTHDATE]: errorCode2ErrorMessage(
          birthdate,
          "生年月日が不適切です"
        ),
      };
    default:
      return {};
  }
};
