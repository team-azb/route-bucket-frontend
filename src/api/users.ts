import axios from "axios";
import {
  Gender,
  UserInfo,
  ValidationFields,
  ValidationResponse,
} from "../types";
import { generateAxiosHeaderWithBearer } from "./helpers";

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
  const res = await axios.patch<UserInfo>(
    `/users/${userId}`,
    payload,
    generateAxiosHeaderWithBearer(token)
  );
  return res;
};

export const validateUserInfo = async (payload: ValidationFields) => {
  const res = await axios.post<ValidationResponse>(`/users/validate/`, payload);
  return res.data;
};
