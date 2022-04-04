import axios from "axios";
import {
  Gender,
  UserInfo,
  ValidationErrorCode,
  ValidationFields,
  ValidationResponse,
} from "../types";

type UpdateUserRequestBody = {
  name?: string;
  gender?: Gender;
  birthdate?: string;
  icon_url?: string;
};

export const getUser = async (userId: string) => {
  const res = await axios.get<UserInfo>(`/users/${userId}`);
  return res;
};

export const updateUser = async (
  userId: string,
  token: string,
  payload: UpdateUserRequestBody
) => {
  const res = await axios.patch<UserInfo>(`/users/${userId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const validateUserInfo = async (payload: ValidationFields) => {
  const res = await axios.post<ValidationResponse>(`/users/validate/`, payload);
  return res.data;
};

export const errorCode2ErrorMessage = (
  code: ValidationErrorCode | undefined,
  invalidFormatMsg: string,
  alreadyExistsMsg = "",
  reservedWordMsg = ""
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
