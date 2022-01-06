import axios from "axios";
import { UserInfo, ValidationFields, ValidationResponse } from "../types";

export const getUser = async (userId: string) => {
  const res = await axios.get<UserInfo>(`/users/${userId}`);
  return res;
};

export const validateUserInfo = async (payload: ValidationFields) => {
  const res = await axios.post<ValidationResponse>(`/users/validate/`, payload);
  return res.data;
};
