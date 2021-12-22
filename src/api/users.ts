import axios from "axios";
import { UserInfo } from "../types";

export const getUser = async (userId: string) => {
  try {
    const res = await axios.get<UserInfo>(`/users/${userId}`);
    return res;
  } catch (error) {
    console.error(error);
  }
};
